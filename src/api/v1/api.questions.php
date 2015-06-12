<?php

$app->group('/questions', function () use ($app) {
  
  $app->get('', function() use ($app) {
		$mysql = start_mysql();
		
		$user_id = $app->request()->params('user_id');
		$query = urldecode($app->request()->params('query'));
		
		$limit = $app->request()->params('limit');
		$limit_sql_limit = "";
		if ($limit) {
  		$limit_sql_limit = "LIMIT $limit ";
		}
		
		$visibility = $app->request()->params('visibility');
		$visibility_sql_where = "";
		if ($visibility) {
  		$visibility_sql_where = "AND e.visibility = $visibility ";
		}
		
		$semester = $app->request()->params('semester');
		$semester_sql_where = "";
		if ($semester) {
  		$semester_sql_where = "AND e.semester = $semester ";
		}
		
		$subject_id = $app->request()->params('subject_id');
		$subject_id_sql_where = "";
		if ($subject_id) {
  		$subject_id_sql_where = "AND e.subject_id = $subject_id ";
		}


		$response = get_all($mysql, 
		  "SELECT q.*, e.subject, e.subject_id, e.semester 
		  FROM questions q 
		  INNER JOIN exams e ON q.exam_id = e.exam_id 
		  WHERE 1 = 1 "
		    ."AND CONCAT(q.question, q.answers, q.explanation) LIKE ? "
		    .$visibility_sql_where
        .$semester_sql_where
        .$subject_id_sql_where
		    .$limit_sql_limit
		, ['%'.$query.'%'], 'result');
		
		print_response($app, $response);
	});
	
	
	$app->get('/list', function() use ($app) {
		$mysql = start_mysql();
		
		$user_id = $app->request()->params('user_id');
		$question_id_list_string =  $app->request()->params('question_id_list');
		$question_id_list = explode(",", $question_id_list_string);
		
		$questions = get_all($mysql, "SELECT * FROM questions WHERE question_id IN ($question_id_list_string)", []);
		foreach ($questions as &$question) {
  		$question['answers'] = unserialize($question['answers']);
  		$question['info'] = get_fetch($mysql, "SELECT * FROM exams WHERE exam_id = ?", [$question['exam_id']]);
  		$question['comments'] = get_all($mysql, "SELECT * FROM comments WHERE question_id = ? ORDER BY comment_id ASC", [$question['question_id']]);
		}
		unset($question);
		
		$response['questions'] = $questions;
		print_response($app, $response);
	});


	$app->get('/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		
		$user_id = $app->request()->params('user_id');
		
		$question = get_fetch($mysql, "SELECT * FROM questions WHERE question_id = ?", [$question_id]);
		$question['answers'] = unserialize($question['answers']);
		$question['info'] = get_fetch($mysql, "SELECT * FROM exams WHERE exam_id = ?", [$question['exam_id']]);
		
		if ($user_id) {
  		$question['comments'] = get_all($mysql, "SELECT c.*, IF(uc.user_id, uc.user_voting, 0) AS 'user_voting', u.username, (SELECT SUM(uc.user_voting) FROM user_comments_data uc WHERE uc.comment_id = c.comment_id AND uc.user_id != ?) AS 'voting' FROM users u, comments c LEFT JOIN user_comments_data uc ON c.comment_id = uc.comment_id AND uc.user_id = ? WHERE c.question_id = ? AND c.user_id = u.user_id  ORDER BY c.comment_id ASC", [$user_id, $user_id, $question_id]);
  		$question['results'] = get_all($mysql, "SELECT * FROM results WHERE user_id = ? AND question_id = ?", [$user_id, $question_id]);
  		
  		$tags = get_fetch($mysql, "SELECT tags FROM tags WHERE user_id = ? AND question_id = ?", [$user_id, $question_id]);
  		if ($tags) {
    		$question['tags'] = explode(",", $tags['tags']);
    		
  		} else {
    		$question['tags'] = [];
  		}

		} else {
  		$question['comments'] = get_all($mysql, "SELECT * FROM comments WHERE question_id = ? ORDER BY comment_id ASC", [$question_id]);
		}

		$response['question'] = $question;
		print_response($app, $response);
	});
	
	
	$app->get('/prepare/count', function() use ($app) {
		$mysql = start_mysql();
    
    $user_id = $app->request()->params('user_id');
		$selected_categories = json_decode($app->request()->params('selected_categories'));		
		$condition = $app->request()->params('condition');

		$result = 0;

		function get_question_count($mysql, $sql_condition, $parameters, $condition_) {
			if ($condition_ == "default") {
				$sql = "questions q LEFT JOIN exams e ON q.exam_id = e.exam_id WHERE e.subject = ? ".$sql_condition;
				return get_count($mysql, $sql, $parameters);

			} else if ($condition_ == "only_unsolved_questions") {
				array_unshift($parameters, $user_id);
				$sql = "questions q LEFT JOIN ( SELECT r.* FROM results r WHERE r.user_id = ? AND r.resetted = 0 ) ra ON ra.question_id = q.question_id LEFT JOIN exams e ON q.exam_id = e.exam_id WHERE e.subject = ? AND ra.result_id IS NULL ".$sql_condition;
				return get_count($mysql, $sql, $parameters);
			}
		}

		foreach ($selected_categories as $subject => $categories) {
			if (count($categories) == 0) {
				$result += get_question_count($mysql, "", [$subject], $condition);
				
			} else {
				foreach ($categories as $category) {
					$result += get_question_count($mysql, "AND q.topic = ?", [$subject, $category], $condition);
				}
			}
		}

		$response['question_count'] = $result;
    print_response($app, $response);
	});


	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO questions (question, answers, correct_answer, exam_id, date_added, user_id_added, explanation, question_image_url, type, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [$data->question, serialize($data->answers), $data->correct_answer, $data->exam_id, time(), $data->user_id_added, $data->explanation, $data->question_image_url, $data->type, $data->topic], function($stmt, $mysql) {
			$response['question_id'] = $mysql->lastInsertId();
			return $response;
		});

		print_response($app, $response);
	});


	$app->put('/:question_id', function($question_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE questions SET question = ?, answers = ?, correct_answer = ?, exam_id = ?, explanation = ?, question_image_url = ?, type = ?, topic = ? WHERE question_id = ?", [$data->question, serialize($data->answers), $data->correct_answer, $data->exam_id, $data->explanation, $data->question_image_url, $data->type, $data->topic, $question_id]);
		print_response($app, $response);
	});


	$app->delete('/:question_id', function($question_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM questions WHERE question_id = ?", [$question_id]);
		print_response($app, $response);
	});
});

?>
