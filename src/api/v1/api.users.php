<?php

$app->group('/users', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		
		$limit = $app->request()->params('limit');
		$limit_sql_limit = "";
		if ($limit) {
  		$limit_sql_limit = "LIMIT $limit ";
		}
		
		$group_id = $app->request()->params('group_id');
		$group_id_sql_where = "";
		if ($group_id) {
  		// Admins are also authors...
  		if ($group_id == 3) {
    		$group_id_sql_where = "AND (u.group_id = 3 OR g.group_id = 2) ";
    		
  		} else {
    		$group_id_sql_where = "AND u.group_id = $group_id ";
  		}
		}
		
		$semester = $app->request()->params('semester');
		$semester_sql_limit = "";
		if ($semester) {
  		$semester_sql_where = "AND u.semester = $semester ";
		}
		
		$query = $app->request()->params('query');
		$query_sql_where = "";
    if ($query) {
  		$query_sql_where = "AND (u.username LIKE '%$query%' OR u.email LIKE '%$query%') ";
		}
		
		$response = get_all($mysql,
		  "SELECT u.*, g.group_id, g.name AS 'group_name'
		  FROM users u
		  LEFT JOIN groups g ON u.group_id = g.group_id 
		  WHERE 1 = 1 "
		    .$group_id_sql_where
		    .$semester_sql_where
		    .$query_sql_where
		  ."ORDER BY g.name ASC, u.user_id DESC "
		    .$limit_sql_limit
		, [], 'users');
		print_response($app, $response);
	});


	$app->get('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = get_fetch($mysql, "SELECT u.*, g.name FROM users u, groups g WHERE u.group_id = g.group_id AND u.user_id = ?", [$user_id], 'user');
		print_response($app, $response);
	});
	
	$app->get('/distinct/groups', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT DISTINCT g.* FROM groups g ORDER BY g.name ASC", [], 'groups');
		print_response($app, $response);
	});
	
	$app->get('/distinct/semesters', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT DISTINCT u.semester FROM users u ORDER BY u.semester ASC", [], 'semesters');
		print_response($app, $response);
	});


	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());
		$username = $data->username;
		$email = str_replace('(@)', '@', sanitize($data->email));
		$clean_password = trim($data->password);
		$clean_username = sanitize($username);
		$semester = $data->semester;
		$course_id = $data->course_id;
		$activation_token = 0;

		$mysql = start_mysql();
		global $website_url;
		global $allow_email_suffix;
		global $allow_whitelist;

		$whitelist_mails = get_all($mysql, "SELECT w.* FROM whitelist w");
		$whitelist = [];
		foreach ($whitelist_mails as $mail) {
  		$whitelist[] = $mail['mail_address'];
		}

		if (!strlen($username)) {
			$response['error'] = 'error_no_username';
		}
		if (!strlen($email)) {
			$response['error'] = 'error_no_email';
		}
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$response['error'] = 'error_email_not_allowed';
			
		} else if (in_array($email, $whitelist) && $allow_whitelist) {

		} else if (preg_match("/[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/", $email) && $allow_email_suffix) {

		} else {
			$response['error'] = 'error_email_not_allowed';
		}
		if (get_count($mysql, "users WHERE username_clean = ?", [$clean_username]) > 0) {
			$response['error'] = 'error_username_taken';
		}
		if (get_count($mysql, "users WHERE email = ?", [$email]) > 0) {
			$response['error'] = 'error_email_taken';
		}

		if (!$response['error']) {
			$secure_pass = generate_hash($clean_password);
			$activation_token = generate_activation_token($mysql);

			$activation_message = $website_url.'activate-account?token='.$activation_token;
			$hooks = ["searchStrs" => ["#ACTIVATION-MESSAGE", "#ACTIVATION-KEY", "#USERNAME#"],
			    "subjectStrs" => [$activation_message, $activation_token, $username]];
			send_template_mail('new-registration.php', $email, 'Willkommen bei Crucio', $hooks);

			$response = execute_mysql($mysql, "INSERT INTO users (username, username_clean, password, email, activationtoken, last_activation_request, sign_up_date, course_id, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [$username, $clean_username, $secure_pass, $email, $activation_token, time(), time(), $course_id, $semester]);
		}

		print_response($app, $response);
	});


	$app->post('/action/login', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$email = str_replace('(@)', '@', trim($data->email));
		$password = trim($data->password);
		$remember_choice = !empty( $data->remember_me ) ? trim( $data->remember_me ) : 0;

		$mysql = start_mysql();

		if (!strlen($email)) {
			$response['error'] = 'error_no_email';
		}
		if (!strlen($password)) {
			$response['error'] = 'error_no_password';
		}

		if (!$response['error']) {
			if (get_count($mysql, "users WHERE email = ?", [sanitize($email)]) == 0) {
	    	$response['error'] = 'error_wrong_mail_password';

	    } else {
	    	$userdetails = fetch_user_details_by_mail($mysql, $email);

	    	if ($userdetails['active'] == 0) {
	    		$response['error'] = 'error_account_not_active';

	    	} else {
	    		$entered_pass = generate_hash($password, $userdetails['password']);

	    		if ($entered_pass != $userdetails['password']) {
	    			$response['error'] = 'error_wrong_mail_password';

	    		} else {
	    			$userdetails['display_username'] = $userdetails['username'];
	    			$userdetails['clean_username'] = $userdetails['username_clean'];
	    			$userdetails['hash_pw'] = $userdetails['password'];
	    			$userdetails['remember_me'] = $remember_choice;

	    			$response = execute_mysql($mysql, "UPDATE users SET last_sign_in = ? WHERE user_id = ?", [time(), $userdetails['user_id']]);
	    			$response['logged_in_user'] = $userdetails;
	    		}
	    	}
	    }
		}

		print_response($app, $response);
	});


	$app->post('/action/activate', function() use ($app) {
		$data = json_decode($app->request()->getBody());
		$token = $data->token;

		$mysql = start_mysql();
		
		if (!strlen($token)) {
			$response['error'] = 'error_no_token';
		}

		$response['token'] = $token;
		if ((get_count($mysql, "users WHERE activationtoken = ?", [$token]) != 1)) {
			$response['error'] = 'error_unknown';

		} else {
			execute_mysql($mysql, "UPDATE users SET active = 1 WHERE activationtoken = ? LIMIT 1", [$token]);
		}

	    print_response($app, $response);
	});


	$app->put('/:user_id/account', function($user_id) use ($app) {
		$mysql = start_mysql();
		$data = json_decode($app->request()->getBody());
		$user = get_fetch($mysql, "SELECT u.* FROM users u WHERE u.user_id = ? LIMIT 1", [$user_id]);

		$old_email = $user['email'];

		$email = str_replace('(@)', '@', sanitize($data->email));

		if ((get_count($mysql, "users WHERE email = ?", [sanitize($clean_email)]) > 0) && $email != $old_email) {
  		$response['error'] = 'error_email_taken';
		}
		
		// E-Mail-Whitelist / Regex Check
			
		if (!$response['error']) {
  		$response = execute_mysql($mysql, "UPDATE users SET email = ?, semester = ?, course_id = ? WHERE user_id = ?", [$email, $data->semester, $data->course_id, $user_id]);
		}

		print_response($app, $response);
	});
	
	$app->put('/:user_id/password', function($user_id) use ($app) {
		$mysql = start_mysql();
		$data = json_decode($app->request()->getBody());
		
		$user = get_fetch($mysql, "SELECT u.* FROM users u WHERE u.user_id = ? LIMIT 1", [$user_id]);
		$old_hash_pw = $user['password'];

    $entered_pass = generate_hash($data->current_password, $old_hash_pw);
    $entered_pass_new = generate_hash($data->password, $old_hash_pw);

    if ($entered_pass != $old_hash_pw) {
	    $response['error'] = 'error_wrong_password';
    }

    if (!$response['error']) {
    	$secure_pass = generate_hash($data->password);
    	$response = execute_mysql($mysql, "UPDATE users SET password = ? WHERE user_id = ?", [$secure_pass, $user_id]);
    }

		print_response($app, $response);
	});

	$app->put('/:user_id/settings', function($user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE users SET highlightExams = ?, showComments = ?, repetitionValue = ?, useAnswers = ?, useTags = ? WHERE user_id = ?", [$data->highlightExams, $data->showComments, $data->repetitionValue, $data->useAnswers, $data->useTags, $user_id]);
		print_response($app, $response);
	});

	$app->put('/:user_id/group', function($user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE users SET group_id = ? WHERE user_id = ?", [$data->group_id, $user_id]);
		print_response($app, $response);
	});

	$app->delete('/test-account', function() use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM users WHERE email = 'siasola@gmail.com'", []);
		print_response($app, $response);
	});


	$app->group('/password', function () use ($app) {

		$app->post('/reset', function() use ($app) {
			$mysql = start_mysql();
			$data = json_decode($app->request()->getBody());
			$email = str_replace('(@)', '@', $data->email);

			if (get_count($mysql, "users WHERE email = ?", [sanitize($email)]) == 0) {
  			$response['error'] = 'error_no_mail';
			}

			if (!$response['error']) {
			    $userdetails = fetch_user_details_by_mail($mysql, $email);

			    if($userdetails['LostpasswordRequest'] == 1) {
			        $response['error'] = 'error_already_requested';

			    } else {
			        global $website_url;
			        $confirm_url = $website_url."forgot-password?confirm=".$userdetails["activationtoken"];
			        $deny_url = $website_url."forgot-password?deny=".$userdetails["activationtoken"];

			        //Setup our custom hooks
			        $hooks = ["searchStrs" => ["#CONFIRM-URL#", "#DENY-URL#", "#USERNAME#"], "subjectStrs" => [$confirm_url, $deny_url, $userdetails['username']]];

			        send_template_mail('lost-password-request.php', $email, 'Neues Passwort I', $hooks);

			        flag_lostpassword_request($mysql, $userdetails['username'], 1);
			    }
			}

			print_response($app, $response);
		});


		$app->post('/confirm', function() use ($app) {
			$mysql = start_mysql();
			$data = json_decode($app->request()->getBody());

			if($data->token == "" || !validate_activation_token($mysql, $data->token, TRUE)) {
				$response['status'] = 'error_token';

			} else {
				$rand_pass = get_unique_code(15);
				$secure_pass = generate_hash($rand_pass);
				$userdetails = fetch_user_details_by_token($mysql, $data->token);

				//Setup our custom hooks
				$hooks = ["searchStrs" => ["#GENERATED-PASS#","#USERNAME#"], "subjectStrs" => [$rand_pass, $userdetails['username']]];

				send_template_mail('your-lost-password.php', $userdetails['email'], 'Neues Passwort II', $hooks);

				$new_activation_token = generate_activation_token($mysql);
				$response = execute_mysql($mysql, "UPDATE users SET password = ?, activationtoken = ? WHERE activationtoken = ?", [$secure_pass, $new_activation_token, sanitize($data->token)]);

				flag_lostpassword_request($mysql, $userdetails["username_clean"], 0);
				$response['mail'] = $userdetails;
				$response['status'] = 'success';
			}

			print_response($app, $response, false);
		});


		$app->post('/deny', function() use ($app) {
			$mysql = start_mysql();
			$data = json_decode($app->request()->getBody());

			if ($data->token == "" || !validate_activation_token($mysql, $data->token, TRUE)) {
				$response['status'] = 'error_token';

			} else {
				$userdetails = fetch_user_details($mysql, NULL, $data->token);
				flag_lostpassword_request($mysql, $userdetails['username_clean'], 0);

				$response['status'] = 'success';
			}

			print_response($app, $response, false);
		});
	});
	
	$app->delete('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM users WHERE user_id = ?", [$user_id], null);
		print_response($app, $response);
	});
});

?>
