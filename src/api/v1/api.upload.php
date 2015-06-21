<?php

$app->group('/upload', function () use ($app) {

	$app->post('/pdf', function() use ($app) {
  	$filename = $_FILES['file']['name'];
    
    // $tags = $_POST['tags'];  // $tags = array('dark', 'moon');
    
    // $new_filename = '123123.pdf';
    // $destination = '/public/files/'.$new_filename;
    // move_uploaded_file($_FILES['file']['tmp_name'] , $destination);
  
    $response = [];
    $response['filename'] = $filename;
		print_response($app, $response);
	});
	
	
	$app->post('/image', function() use ($app) {
		$mysql = start_mysql();
		// $response = execute_mysql($mysql, "INSERT INTO whitelist ( mail_address ) VALUES (?)", [str_replace('(@)', '@', sanitize($data->mail_address))], null);
		print_response($app, $response);
	});


	$app->delete('/:file_name', function($file_name) use ($app) {
		$mysql = start_mysql();
		// $response = execute_mysql($mysql, "DELETE FROM whitelist WHERE mail_address = ?", [$mail_address], null);
		print_response($app, $response);
	});
});

?>
