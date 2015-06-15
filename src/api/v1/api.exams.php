<?php

$app->group('/exams', function () use ($app) {


	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		
		$user_id = $app->request()->params('user_id');
		
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
		
		$author_id = $app->request()->params('author_id');
		$author_id_sql_where = "";
		if ($author_id) {
  		$author_id_sql_where = "AND e.user_id_added = $author_id ";
		}
		
		$response = get_all($mysql, 
		  "SELECT e.*, u.username AS 'author', COUNT(*) AS 'question_count', s.name AS 'subject' 
		  FROM exams e
		  INNER JOIN users u ON e.user_id_added = u.user_id
		  INNER JOIN subjects s ON e.subject_id = s.subject_id 
		  INNER JOIN questions q ON e.exam_id = q.exam_id
		  WHERE 1 = 1 "
		    .$visibility_sql_where
		    .$semester_sql_where
		    .$subject_id_sql_where
		    .$author_id_sql_where
		  ."GROUP BY q.exam_id 
		  ORDER BY e.semester ASC, e.subject ASC, e.date DESC "
		    .$limit_sql_limit
		, [], 'exams');
		
		print_response($app, $response);
	});
	
	
	$app->get('/distinct/:distinct', function($distinct) use ($app) {
		$mysql = start_mysql();
		
		$visibility = $app->request()->params('visibility');
		$visibility_sql_where = "";
		if ($visibility) {
  		$visibility_sql_where = "AND e.visibility = $visibility ";
		}
		
		$sql_select = "";
		$sql_order = "";
		if ($distinct == "semester") {
  		$sql_select = "SELECT DISTINCT e.semester ";
  		$sql_order = "ORDER BY e.semester ASC";
  		
		} else if ($distinct == "subject") {
  		$sql_select = "SELECT DISTINCT e.subject_id, s.name AS 'subject_name' ";
  		$sql_order = "ORDER BY s.name ASC";
		}
		
		$response = get_all($mysql, 
		    $sql_select
		  ."FROM exams e
		  INNER JOIN users u ON e.user_id_added = u.user_id
		  INNER JOIN subjects s ON e.subject_id = s.subject_id 
		  INNER JOIN questions q ON e.exam_id = q.exam_id
		  WHERE 1 = 1 "
		    .$visibility_sql_where
		  ."GROUP BY q.exam_id "
		    .$sql_order
		, [], $distinct);
		print_response($app, $response);
	});


	/* $app->get('/user_id/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT e.*, IFNULL(r.answered_questions, 0) as answered_questions, IFNULL(qc.question_count, 0) as question_count FROM exams e LEFT JOIN (SELECT q.exam_id, COUNT(*) as answered_questions FROM questions q, results r WHERE q.question_id = r.question_id AND r.user_id = ? AND r.resetted = 0 AND r.attempt = 1 GROUP BY q.exam_id) r ON r.exam_id = e.exam_id LEFT JOIN (SELECT q.exam_id, COUNT(*) as question_count FROM questions q GROUP BY q.exam_id ) qc ON qc.exam_id = e.exam_id WHERE e.semester > 0 ORDER BY e.semester, e.subject", [$user_id], 'exams');

		print_response($app, $response);
	}); */
	
	
	$app->get('/recommended', function() use ($app) {
		$mysql = start_mysql();
		
		$limit = $app->request()->params('limit');
		$limit_sql_limit = "";
		if ($limit) {
  		$limit_sql_limit = "LIMIT $limit ";
		}
		
		$user_id = $app->request()->params('user_id');
		$user_id_sql_where = "";
		if ($user_id) {
  		$user_id_sql_where = "AND u.user_id = $user_id ";
		}
		
		$response = get_all($mysql,
		  "SELECT e.*, COUNT(*) AS 'question_count' 
		  FROM exams e 
		  INNER JOIN questions q ON q.exam_id = e.exam_id 
		  INNER JOIN users u ON e.semester = u.semester 
		  WHERE 1 = 1 "
		    .$user_id_sql_where
		  ."GROUP BY q.exam_id 
		  ORDER BY e.semester ASC, e.subject ASC, e.date DESC "
		    .$limit_sql_limit
		, [$user_id], 'exams');
		print_response($app, $response);
	});
	
	
	$app->get('/:exam_id', function($exam_id) use ($app) {
		$mysql = start_mysql();
		$exam = get_fetch($mysql, "SELECT e.*, u.username, u.email FROM exams e INNER JOIN users u ON u.user_id = e.user_id_added WHERE e.exam_id = ?", [$exam_id]);
		
		$questions = get_all($mysql, "SELECT * FROM questions WHERE exam_id = ? ORDER BY question_id ASC", [$exam_id]);
		foreach ($questions as &$question) {
      $question['answers'] = unserialize($question['answers']);
    }
    unset($question);

		
		$exam['questions'] = $questions;
		$exam['question_count'] = count($questions);
		
		$response['exam'] = $exam;
		print_response($app, $response);
	});


	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO exams (subject_id, professor, semester, date, sort, date_added, date_updated, user_id_added, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [$data->subject_id, $data->professor, $data->semester, $data->date, $data->type, time(), time(), $data->user_id_added, $data->duration, $data->notes], function($stmt, $mysql) {
			$response['exam_id'] = $mysql->lastInsertId();
			return $response;
		});
		print_response($app, $response);
	});


	$app->put('/:exam_id', function($exam_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE exams SET subject_id = ?, professor = ?, semester = ?, date = ?, sort = ?, duration = ?, notes = ?, file_name = ?, visibility = ?, date_updated = ? WHERE exam_id = ?", [$data->subject_id, $data->professor, $data->semester, $data->date, $data->sort, $data->duration, $data->notes, $data->file_name, $data->visibility, time(), $exam_id]);
		print_response($app, $response);
	});


	$app->delete('/:exam_id', function($exam_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM exams WHERE exam_id = ?", [$exam_id]);
		print_response($app, $response);
	});
});

?>
