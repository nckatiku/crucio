<?php

$app->group('/subjects', function (){

    $this->get('', function($request, $response, $args) {
        $mysql = init();

        $stmt = $mysql->prepare(
		    "SELECT c.*, s.subject_id, s.name as 'subject'
		    FROM subjects s
		    LEFT JOIN categories c ON c.subject_id = s.subject_id"
		);

		$categories = getAll($stmt);

		$subjects = [];
		foreach($categories as $e) {
    		if (count($subjects) == 0 || end($subjects)['subject_id'] != $e['subject_id']) {
                $subjects[] = [
                    'subject_id' => $e['subject_id'],
                    'subject' => $e['subject'],
                    'categories' => [],
                ];
            }
            if ($e['category_id']) {
                $subjects[count($subjects) - 1]['categories'][] = [
                    'category_id' => $e['category_id'],
                    'category' => $e['name'],
                ];
            }
		}

		$data['subjects'] = $subjects;
		return createResponse($response, $data);
	});

	$this->get('/categories', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

        $stmt = $mysql->prepare(
		    "SELECT c.*, s.subject_id, s.name as 'subject'
		    FROM subjects s
		    LEFT JOIN categories c ON c.subject_id = s.subject_id
		    WHERE s.subject_id = IFNULL(:subject_id, s.subject_id)"
		);
		$stmt->bindValue(':subject_id', $query_params['subject_id'], PDO::PARAM_INT);

		$data['categories'] = getAll($stmt);
		return createResponse($response, $data);
	});
});

?>