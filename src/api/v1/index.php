<?php

require_once('api.helper.php');
require_once('../Slim/Slim.php');


\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$host_name = $_SERVER['HTTP_HOST'];
$protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"], 0, 5)) == 'https://' ? 'https://' : 'http://';
$website_url = $protocol.$host_name.'/';


$allow_whitelist = true;
$allow_email_suffix = true;


require_once('api.exams.php');
require_once('api.questions.php');
require_once('api.contact.php');
require_once('api.whitelist.php');
require_once('api.collections.php');
require_once('api.subjects.php');
require_once('api.users.php');
require_once('api.tags.php');
require_once('api.comments.php');
require_once('api.results.php');
require_once('api.pdf.php');
require_once('api.admin.php');
require_once('api.statistic.php');
require_once('api.quality.php');


$app->run();

?>
