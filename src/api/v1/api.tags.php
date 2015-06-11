<?php

$app->group('/tags', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		
		$tag = $app->request()->params('tag'); 
		
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
		
		$question_id = $app->request()->params('question_id');
		$question_id_sql_where = "";
		if ($question_id) {
  		$question_id_sql_where = "AND t.question_id = $question_id ";
		}

		$questions = get_all($mysql, 
		  "SELECT t.*, q.*, e.subject, e.subject_id , e.semester 
		  FROM tags t 
		  INNER JOIN questions q ON t.question_id = q.question_id 
		  INNER JOIN exams e ON q.exam_id = e.exam_id 
		  INNER JOIN users u ON t.user_id = u.user_id 
		  WHERE t.tags != '' "
		    .$user_id_sql_where
		    .$question_id_sql_where
		    .$limit_sql_limit
		);
		
		// Explode tags from string to array
		foreach ($questions as &$question) {
  		$question['tags'] = explode(",", $question['tags']);
		}
		unset($question);
		
		// Check if tags contain tag
		if ($tag) {
  		for ($i = 0; $i < count($questions); ) {
    		if (!in_array($tag, $questions[$i]['tags'])) {
      		array_splice($questions, $i, 1);
    		} else {
      		$i++;
    		}
  		}
		}
		
		$response['questions'] = $questions;
		print_response($app, $response);
	});
	
	
	$app->get('/distinct', function() use ($app) {
		$mysql = start_mysql();
		
		$user_id = $app->request()->params('user_id');
		$user_id_sql_where = "";
		if ($user_id) {
  		$user_id_sql_where = "AND t.user_id = $user_id ";
		}
		
		$tags = get_all($mysql, 
		  "SELECT DISTINCT t.tags
		  FROM tags t 
		  INNER JOIN users u ON t.user_id = u.user_id 
		  WHERE t.tags != '' "
		    .$user_id_sql_where
		);
		
		$distinct_tags = [];
		foreach ($tags as $tag) {
  		foreach (explode(",", $tag['tags']) as $single_tag) {
    		$distinct_tags[] = $single_tag;
  		}
		}
		
		$response['tags'] = array_unique($distinct_tags);
		print_response($app, $response);
	});
	

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());
		
		$tags = $data->tags;

		$mysql = start_mysql();
		if ($tags == '') {
  		execute_mysql($mysql, "DELETE FROM tags WHERE question_id = ? AND user_id = ?", [$data->question_id, $data->user_id]);
		
		} else {
  		execute_mysql($mysql, "INSERT INTO tags (question_id, user_id, tags) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tags = ?", [$data->question_id, $data->user_id, $tags, $tags]);
		}
		
		$response = [];
		print_response($app, $response);
	});
	
	$app->delete('', function() use ($app) {
		$data = json_decode($app->request()->getBody());
		
		$tag = $app->request()->params('tag');
		$user_id = $app->request()->params('user_id');
		
		$mysql = start_mysql();
		$tags = get_all($mysql, 
		  "SELECT t.*
		  FROM tags t 
		  INNER JOIN users u ON t.user_id = u.user_id 
		  WHERE t.tags != '' AND t.user_id = ?"
		, [$user_id]);
		
		foreach ($tags as $question_tag) {
  		$tags_array = explode(",", $question_tag['tags']);
  		if (in_array($tag, $tags_array)) {
    		$new_tag_array = array_diff($tags_array, [$tag]);
    		$new_tags = implode($new_tag_array, ",");
    		execute_mysql($mysql, "UPDATE tags SET tags = ? WHERE question_id = ? AND user_id = ?", [$new_tags, $question_tag['question_id'], $user_id]);
  		}
		}

		print_response($app, $response);
	});
});

?>
