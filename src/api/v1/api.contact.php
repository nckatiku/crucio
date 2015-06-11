<?php

$app->group('/contact', function () use ($app) {

	$app->post('/send-mail', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$name = trim($data->name);
		$email = str_replace('(@)', '@', trim($data->mail));
		$subject = 'Allgemeine Anfrage';

		$text = trim($data->text);
		$destination = 'kontakt@crucio-leipzig.de, allgemeinerkontakt@crucio-leipzig.de';

		$sender_name = $name.' - Kontakt Crucio';
		$sender_email = 'kontaktfeld@crucio-leipzig.de';

		$hooks = [
		  "searchStrs" => ["#MESSAGE#", "#MAIL#", "#USERNAME#"],
			"subjectStrs" => [$text, $email, $name]
		];
		$response = send_template_mail('contact.php', $destination, $subject, $hooks, $sender_name, $sender_email);

		print_response($app, $response);
	});


	$app->post('/send-mail-question', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$name = trim($data->name);
		$email = str_replace('(@)', '@', trim($data->mail));
    $subject = 'Zur Frage #'.$data->question_id;
    $mail_subject_html = '';
    
		if ($data->mail_subject) {
			$mail_subject_html = '<dt>Anliegen</dt><dd>'.$data->mail_subject.'</dd>';
		}

		$sender_name = $name.' - Kontakt Crucio';
		$sender_email = 'kontaktfeld@crucio-leipzig.de';

		$destination = 'kontakt@crucio-leipzig.de, '.$data->author_mail;

		$hooks = [
		  "searchStrs" => ["#MESSAGE#", "#MAIL#", "#USERNAME#", "#AUTHOR#", "#QUESTION#", "#QUESTION_ID#", "#SUBJECT#", "#DATE2#", "#EXAM_ID#", "#MAIL_SUBJECT#"],
			"subjectStrs" => [trim($data->text), $email, $name, $data->author, $data->question, $data->question_id, $data->subject, $data->date, $data->exam_id, $mail_subject_html]
		];
		$response = send_template_mail('contact-question.php', $destination, $subject, $hooks, $sender_name, $sender_email);

		print_response($app, $response);
	});
});

?>
