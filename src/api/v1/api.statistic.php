<?php

$app->group('/statistic', function () use ($app) {

	$app->get('/', function() use ($app) {
		$mysql = start_mysql();
		$statistic['time'] = time();

		$statistic['user_count'] = get_count($mysql, "users");

		$statistic['visible_exam_count'] = get_count($mysql, "exams WHERE visibility = 1");
		$statistic['visible_question_count'] = get_count($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");

		$statistic['result_count'] = get_count($mysql, "results");
		$statistic['result_count_today'] = get_count($mysql, "results WHERE date > ?", [time() - 1*24*60*60]);
		$statistic['result_per_minute'] = (get_count($mysql, "results WHERE date > ?", [time() - 30*60])) / (30.); // Last Half Hour

		$statistic['comment_count'] = get_count($mysql, "comments");
		$statistic['tag_count'] = get_count($mysql, "tags");

		$response['statistic'] = $statistic;
		print_response($app, $response);
	});


	$app->get('/graph', function() use ($app) {
		$mysql = start_mysql();
		$statistic['time'] = time();

		/* $stats['user_count'] = get_count($mysql, "users");
		$stats['user_count_register_today'] = get_count($mysql, "users WHERE sign_up_date > ?", [time() - 1*24*60*60]);
		$stats['user_count_login_today'] = get_count($mysql, "users WHERE last_sign_in > ?", [time() - 1*24*60*60]);

		$stats['exam_count'] = get_count($mysql, "exams");
		$stats['visible_exam_count'] = get_count($mysql, "exams WHERE visibility = 1");
		$stats['question_count'] = get_count($mysql, "questions");
		$stats['question_explanation_count'] = get_count($mysql, "questions WHERE explanation != ''");
		$stats['question_free_count'] = get_count($mysql, "questions WHERE type = 1");
		$stats['question_without_answer_count'] = get_count($mysql, "questions WHERE correct_answer < 1 AND type > 1");
		$stats['question_topic_count'] = get_count($mysql, "questions WHERE topic != '' AND topic != 'Sonstiges'");
		$stats['visible_question_count'] = get_count($mysql, "questions, exams WHERE exams.visibility = 1 AND questions.exam_id = exams.exam_id");
		$stats['question_worked_count'] = get_count_with_pre($mysql, "COUNT(DISTINCT question_id)", "results");
		$stats['question_worked_count_today'] = get_count_with_pre($mysql, "COUNT(DISTINCT question_id)", "results WHERE date > ?", [time() - 1*24*60*60]);

		$stats['result_count'] = get_count($mysql, "results");
		$stats['result_count_hour'] = get_count($mysql, "results WHERE date > ?", [time() - 60*60]);
		$stats['result_count_week'] = get_count($mysql, "results WHERE date > ?", [time() - 7*24*60*60]);
		$stats['result_count_today'] = get_count($mysql, "results WHERE date > ?", [time() - 1*24*60*60]);

		$stats['result_per_minute'] = (get_count($mysql, "results WHERE date > ?", [time() - 30*60])) / (30.); // Last Half Hour

		$stats['comment_count'] = get_count($mysql, "comments");
		$stats['tag_count'] = get_count($mysql, "tags");
		$stats['search_count'] = get_count($mysql, "search_queries");

		$user_count_semester = [];
		$exam_count_semester = [];
		$result_count_semester = [];
		for ($i = 1; $i < 7; $i++) {
			$user_count_semester[] = get_count($mysql, "users WHERE semester = ?", [$i]);
			$exam_count_semester[] = get_count($mysql, "exams WHERE semester = ?", [$i]);
			// $result_count_semester[] = get_count($mysql, "results r, users WHERE semester = ?", [$i]);
		}
		$user_count_semester[] = get_count($mysql, "users WHERE semester > 6");
		$exam_count_semester[] = get_count($mysql, "exams WHERE semester > 6");
		$result_count_semester[] = get_count($mysql, "results WHERE semester > 6");
		$stats['user_count_semester'] = $user_count_semester;
		$stats['exam_count_semester'] = $exam_count_semester;
		// $stats['result_count_semester'] = $result_count_semester;


		$result_dep_time = [];
		for ($i = 0; $i < 48; $i++) {
			$result_dep_time[] = get_count($mysql, "results WHERE (?+1)*30*60 > (date % 60*60*24) AND (date % 60*60*24) >= ?*30*60", [$i, $i]);
		}
		$stats['result_dep_time'] = $result_dep_time;


		$resolution = 1.5 * 60;
		$days = 2;
		$result_dep_time_today = [];
		for ($i = $days*round(24*60/$resolution); $i>=0; $i--) {
			$result_dep_time_today_label[] = ((time() % (24*60*60) - (time() % (60*60)))/(60*60) - ($resolution/60)*$i + $days*24 + 1) % 24;
			$result_dep_time_today[] = round( 60 * get_count($mysql, "results WHERE date > ? AND date < ?", [time() - ($i+1)*$resolution*60, time() - ($i)*$resolution*60]) / ($resolution) );
		}
		$stats['result_dep_time_today_label'] = $result_dep_time_today_label;
		$stats['result_dep_time_today'] = $result_dep_time_today; */


		$response['statistic'] = $$statistic;
		print_response($app, $response);
	});

	$app->get('/results', function() use ($app) {
		$mysql = start_mysql();

		$results_dep_time = [];
		for($i = 0; $i<48; $i++) {
			$results_dep_time[] = get_count($mysql, "results WHERE (?+1)*30*60 > (date % 60*60*24) AND (date % 60*60*24) >= ?*30*60", [$i, $i]);
		}
		
		$response['results_dep_time'] = $results_dep_time;
		print_response($app, $response);
	});

	
	$app->get('/user_id/:user_id', function($user_id) use ($app) {
		$mysql = start_mysql();

		$stats['exam_count'] = get_count($mysql, "results r, exams e, questions q WHERE e.exam_id = q.question_id AND r.user_id = ? AND r.question_id = q.question_id", [$user_id]);
		$stats['result_count'] = get_count($mysql, "results WHERE user_id = ?", [$user_id]);
		$stats['result_count_hour'] = get_count($mysql, "results WHERE date > ? AND user_id = ?", [time() - 60*60, $user_id]);
		$stats['result_count_week'] = get_count($mysql, "results WHERE date > ? AND user_id = ?", [time() - 7*24*60*60, $user_id]);
		$stats['result_count_today'] = get_count($mysql, "results WHERE date > ? AND user_id = ?", [time() - 1*24*60*60, $user_id]);

		$stats['comment_count'] = get_count($mysql, "comments WHERE user_id = ?", [$user_id]);
		$stats['votes_count'] = get_count($mysql, "user_comments_data WHERE user_id = ?", [$user_id]);
		$stats['tag_count'] = get_count($mysql, "tags WHERE user_id = ?", [$user_id]);

		$response['stats'] = $stats;
		print_response($app, $response);
	});
});

?>
