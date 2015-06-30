<?php

$app->group('/upload', function () use ($app) {

	$app->post('', function() use ($app) { 
    $basedir = '../../public/files/';

    switch ($_FILES['file']['type']) {
      case 'image/png':
        $filetype = '.png';
        break;
      
      case 'image/jpg':
        $filetype = '.jpg';
        break;
        
      case 'image/gif':
        $filetype = '.gif';
        break;
        
      case 'application/pdf':
        $filetype = '.pdf';
        break;
    }
    
    $filename = $_FILES['file']['name'].'-'.(microtime(true) * 10000).$filetype;
    $upload_dir = $basedir.$filename;
    $move_error = !move_uploaded_file($_FILES['file']['tmp_name'], $upload_dir);
  
    $response = [];
    $response['filename'] = $filename;
		print_response($app, $response);
	});
});

?>
