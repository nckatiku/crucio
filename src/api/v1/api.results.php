<?php

$app->group('/results', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		
		$limit = $app->request()->params('limit');
		$limit_sql_limit = "";
		if ($limit) {
  		$limit_sql_limit = "LIMIT $limit ";
		}
		
		$user_id = $app->request()->params('user_id');
		$user_id_sql_where = "";
		if ($user_id) {
  		$user_id_sql_where = "AND t.user_id = $user_id ";
		}
		
		$question_id = $app->request()->params('user_id');
		$question_id_sql_where = "";
		if ($question_id) {
  		$question_id_sql_where = "AND t.question_id = $question_id ";
		}
		
		$response = get_all($mysql, 
		  "SELECT r.* 
		  FROM results r 
		  WHERE 1 = 1 "
		    .$user_id_sql_where
		    .$question_id_sql_where
		    .$limit_sql_limit
		, [], 'results');
		print_response($app, $response);
	});


	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$user_id = $data->user_id;
		$data_list = $data->data_list;

		$mysql = start_mysql();

		$response = [];
		foreach ($data_list as $question_data) {
			$question_id = $question_data->question_id;
			$correct = $question_data->correct;
			$given_result = $question_data->given_result;

			$attempt = execute_mysql($mysql, "SELECT IF(MAX(attempt), MAX(attempt), 0) AS max_attempt FROM results WHERE user_id = ? AND question_id = ?", [$user_id, $question_id], function($stmt, $mysql) {
				$response['max'] = $stmt->fetchAll(PDO::FETCH_ASSOC)['max_attempt'];
				return $response;
			});

			$response = execute_mysql($mysql, "INSERT INTO results (user_id, question_id, attempt, correct, given_result, date, resetted) VALUES (?, ?, ?, ?, ?, ?, '0')", [$user_id, $question_id, $attempt['max'] + 1, $correct, $given_result, time()]);
		}
		print_response($app, $response);
	});


	$app->delete('/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE results SET resetted = '1' WHERE user_id = ?", [$user_id]);
		print_response($app, $response);
	});


	$app->delete('/:user_id/:exam_id', function($user_id, $exam_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE results r, questions q SET r.resetted = '1' WHERE r.question_id = q.question_id AND q.exam_id = ? AND r.user_id = ?", [$exam_id, $user_id]);
		print_response($app, $response);
	});
});

?>
