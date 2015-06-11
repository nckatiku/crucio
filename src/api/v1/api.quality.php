<?php

$app->group('/quality', function () use ($app) {

	$app->get('', function() use ($app) {
		$mysql = start_mysql();
		$response = array();

		$response['format'] = get_all($mysql, "SELECT q.* FROM questions q WHERE q.question LIKE '%1)%'", [], 'list');
		$response['format'] = array_merge($response['format'], get_all($mysql, "SELECT q.* FROM questions q WHERE q.question regexp '^[0-9].[\.)] +'", [], 'number'));
		$response['format'] = array_merge($response['format'], get_all($mysql, "SELECT q.* FROM questions q WHERE q.question LIKE '%^%' OR q.answers LIKE '%^%'", [], 'super'));
		$response['format'] = array_merge($response['format'], get_all($mysql, "SELECT q.* FROM questions q WHERE q.question LIKE '%^%' OR q.answers LIKE '%^%'", [], 'special'));

		$response['duplicate'] = array_merge($response['format'], get_all($mysql, "SELECT q.* FROM questions q GROUP BY q.question, q.answers, q.exam_id HAVING COUNT(question_id) > 1", [], 'duplicate'))['duplicate'];

		$response['wrong'] = get_all($mysql, "SELECT question_id, sum(case when correct = 1 then 1 else 0 end) / count(*) as 'right', sum(case when correct = 0 then 1 else 0 end) / count(*) as wrong, count(*) as number FROM results WHERE correct > -1 AND attempt = 1 GROUP BY question_id ORDER BY wrong desc, number desc LIMIT 100", [], 'wrong')['wrong'];
		print_response($app, $response);
	});
});

?>
