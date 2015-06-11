<?php

$app->group('/comments', function () use ($app) {

  $app->get('', function () use ($app) {
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
		
		$query = $app->request()->params('query');
		$query_sql_where = "";
    if ($query) {
  		$query_sql_where = "AND (c.comment LIKE '%$query%' OR u.username LIKE '%$query%') ";
		}
		
		$author_id = $app->request()->params('author_id');
		$author_sql_join = "";
		$author_sql_where = "";
    if ($author_id) {
  		$author_sql_join = "INNER JOIN exams e ON q.exam_id = e.exam_id ";
  		$author_sql_where = "AND e.user_id_added = $author_id ";
		}

		$response = get_all($mysql, 
		  "SELECT c.*, u.username, q.*, e.semester, e.subject, e.subject_id 
		  FROM comments c 
		  INNER JOIN users u ON c.user_id = u.user_id 
		  INNER JOIN questions q ON c.question_id = q.question_id 
		  INNER JOIN exams e ON q.exam_id = e.exam_id "
		    .$author_sql_join
		  ."WHERE 1 = 1 "
		    .$user_id_sql_where
		    .$query_sql_where
		    .$author_sql_where
		  ."ORDER BY c.comment_id DESC "
		    .$limit_sql_limit
		  , [], 'comments');
		print_response($app, $response);
  });


  $app->post('/:user_id', function($user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO comments (user_id, date, comment, question_id, reply_to) VALUES (?, ?, ?, ?, ?)", [$user_id, time(), $data->comment, $data->question_id, $data->reply_to], function($stmt, $mysql) {
			$response['comment_id'] = $mysql->lastInsertId();
			return $response;
		});
		print_response($app, $response);
	});


	$app->post('/:comment_id/user/:user_id', function($comment_id, $user_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO user_comments_data (user_id, comment_id, user_voting, subscription) VALUES (?, ?, ?, '0') ON DUPLICATE KEY UPDATE user_voting = ?", [$user_id, $comment_id, $data->user_voting, $data->user_voting]);
		print_response($app, $response);
	});


	$app->delete('/:comment_id', function($comment_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM comments WHERE comment_id = ?", [$comment_id]);
		print_response($app, $response);
	});
});

?>
