<?php

$app->group('/subjects', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT s.* FROM subjects s", [], 'subjects');
		print_response($app, $response);
	});


	$app->get('/categories', function() use ($app) {
		$mysql = start_mysql();
		$subjects = get_all($mysql, "SELECT s.* FROM subjects s");
		$categories = get_all($mysql, "SELECT c.* FROM categories c");
		
		$result = [];
		foreach($subjects as $subject) {
  		$subject['categories'] = [];
  		$result[ $subject['subject_id'] ] = $subject;
		}
		foreach($categories as $category) {
  		$result[ $category['subject_id'] ]['categories'][] = $category;
		}

		$response['subjects'] = $result;
		print_response($app, $response);
	});


	$app->get('/categories/:subject_id', function($subject_id) use ($app) {
		$mysql = start_mysql();
		$response = get_all($mysql, "SELECT c.* FROM categories c WHERE c.subject_id = ?", [$subject_id], 'categories');
		print_response($app, $response);
	});
});

?>
