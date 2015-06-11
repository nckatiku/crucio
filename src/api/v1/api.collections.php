<?php

$app->group('/collections', function () use ($app) {

  $app->get('', function() use ($app) {
		$mysql = start_mysql();
		
		$limit = $app->request()->params('limit');
		$limit_sql_limit = "";
		if ($limit) {
  		$limit_sql_limit = "LIMIT $limit ";
		}
		
		$user_id = $app->request()->params('user_id');
		$user_id_sql_where = "";
		if ($user_id) {
  		$user_id_sql_where = "AND c.user_id = $user_id ";
		}
		
		$collections = get_all($mysql,
	    "SELECT c.* 
      FROM collections c 
      WHERE 1 = 1 "
        .$user_id_sql_where
        .$limit_sql_limit
	  , [$user_id]);
		  
		foreach($collections as &$collection) {
  		$collection['data'] = unserialize($collection['data']);
		}
		unset($collection);
    
    $response['collections'] = $collections;
		print_response($app, $response);
	});
  
  
	$app->get('/:collection_id', function($collection_id) use ($app) {
		$mysql = start_mysql();
		
		$collection = get_fetch($mysql, "SELECT c.* FROM collections c WHERE c.collection_id = ?", [$collection_id]);
		$collection['data'] = unserialize($collection['data']);
		
		$response['collection'] = $collection;
		print_response($app, $response);
	});
	
	
	
	$app->group('/prepare', function () use ($app) {
  	
  	$app->get('/collection/:collection_id', function($collection_id) use ($app) {
  		$mysql = start_mysql();
  		
  		$random = $app->request()->params('random');
  		$load_questions = $app->request()->params('load_questions');
  		$load_first_question = $app->request()->params('load_first_question');
  		
  		$collection_ = get_fetch($mysql, "SELECT c.* FROM collections c WHERE c.collection_id = ?", [$collection_id]);
  		$collection = (array)unserialize($collection_['data']);
  		$question_id_list = $collection['question_id_list'];
  		
  		/// Load questions
      $questions = [];
  		for ($i = 0; $i < count($question_id_list); $i++) {
  			$question_id = $question_id_list[$i];
  			
  			if ($load_questions OR ($i == 0 AND $load_first_question)) {
  				$questions[$question_id] = execute_mysql($mysql, "SELECT q.* FROM questions q WHERE q.question_id = ?", [$question_id], function($stmt, $mysql) {
  					$response = $stmt->fetch(PDO::FETCH_ASSOC);
  					$response['answers'] = unserialize($response['answers']);
  					$response['info'] = get_fetch($mysql, "SELECT e.* FROM exams e WHERE e.exam_id = ?", [ $response['exam_id'] ]);
  					return $response;
  				});
  			}
  		}
  		
  		// Create the rest...
  		$collection['questions'] = $questions;
  		$collection['user_datas'] = [];
  		
  		$response['collection'] = $collection;
  		print_response($app, $response);
  	});
  	
  	
    $app->get('/categories', function() use ($app) {
  		$mysql = start_mysql();
  		
  		$random = $app->request()->params('random');
  		$load_questions = $app->request()->params('load_questions');
  		$load_first_question = $app->request()->params('load_first_question');
  		
  		$selected_categories = json_decode($app->request()->params('selected_categories'));
  		$selected_question_count = $app->request()->params('selected_question_count');
  		$condition = $app->request()->params('condition');
      
      // Questions List
  		function get_question_id_stmt($mysql, $sql_condition, $parameters, $conditions) {
  			return execute_mysql($mysql, 
  			  "SELECT DISTINCT q.question_id 
  			  FROM questions q 
  			  INNER JOIN exams e ON q.exam_id = e.exam_id 
  			  WHERE e.subject = ? "
  			    .$sql_condition
  			  , $parameters, function($stmt, $mysql) {
  				$response['stmt'] = $stmt;
  				return $response;
  			});
  		}
  
  		$question_id_list = [];
  		foreach ($selected_categories as $subject => $categories) {
  			if (count($categories) == 0) {
  				$result = get_question_id_stmt($mysql, "", [$subject], $conditions);
  				while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
  					$question_id_list[] = $row['question_id'];
  				}
  
  			} else {
  				foreach ($categories as $category) {
  					$result = get_question_id_stmt($mysql, "AND q.topic = ? ", [$key], $conditions);
  					while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
  						$question_id_list[] = $row['question_id'];
  					}
  				}
  			}
  		}
      
      if ($random) {
        shuffle($question_id_list);
      }
  
  		if ($selected_question_count > 0) {
  			$question_id_list = array_slice($question_id_list, 0, $selected_question_count);
  		}
  		
  		
  		// Load questions
      $questions = [];
  		for ($i = 0; $i < count($question_id_list); $i++) {
  			$question_id = $question_id_list[$i];
  			
  			if ($load_questions OR ($i == 0 AND $load_first_question)) {
  				$questions[$question_id] = execute_mysql($mysql, "SELECT q.* FROM questions q WHERE q.question_id = ?", [$question_id], function($stmt, $mysql) {
  					$response = $stmt->fetch(PDO::FETCH_ASSOC);
  					$response['answers'] = unserialize($response['answers']);
  					$response['info'] = get_fetch($mysql, "SELECT e.* FROM exams e WHERE e.exam_id = ?", [ $response['exam_id'] ]);
  					return $response;
  				});
  			}
  		}
  		
      
      // Info
  		$info = [];
  		$info['type'] = 'subject';
  		$info['categories'] = $selected_categories;
  	  $info['condition'] = $condition;
  
  		$collection['info'] = $info;
  		$collection['question_id_list'] = $question_id_list;
  		$collection['questions'] = $questions;
  		$collection['user_datas'] = [];
  
  	  $response['collection'] = $collection;
  	  print_response($app, $response);
  	});
  
  
  	$app->get('/exam/:exam_id', function($exam_id) use ($app) {
  		$mysql = start_mysql();
  		
  		$random = $app->request()->params('random');
  		$load_questions = $app->request()->params('load_questions');
  		$load_first_question = $app->request()->params('load_first_question');
  
      // Create questions List
      $random_sql_order = "";
      if ($random) {
    		$random_sql_order = "ORDER BY RAND() ";
      }
  
  		$question_id_list = [];
  		$result = execute_mysql($mysql, 
  		  "SELECT DISTINCT q.question_id 
  		  FROM questions q 
  		  WHERE q.exam_id = ? "
  		    .$random_sql_order
  		, [$exam_id], function($stmt, $mysql) {
  			$response['stmt'] = $stmt;
  			return $response;
  		});
  		while ($row = $result['stmt']->fetch(PDO::FETCH_ASSOC)) {
  			$question_id = $row['question_id'];
  			$question_id_list[] = $question_id;
  		}
  		
  		
  		// Info
  		$info = get_fetch($mysql, "SELECT e.*, u.username, u.email FROM exams e INNER JOIN users u ON u.user_id = e.user_id_added WHERE e.exam_id = ?", [$exam_id]);
  		$info['type'] = 'exam';
  		
  		
      // Load questions
      $questions = [];
  		for ($i = 0; $i < count($question_id_list); $i++) {
  			$question_id = $question_id_list[$i];
  			
  			if ($load_questions OR ($i == 0 AND $load_first_question)) {
  				$questions[$question_id] = execute_mysql($mysql, "SELECT q.* FROM questions q WHERE q.question_id = ?", [$question_id], function($stmt, $mysql) {
  					$response = $stmt->fetch(PDO::FETCH_ASSOC);
  					$response['answers'] = unserialize($response['answers']);
  					$response['info'] = get_fetch($mysql, "SELECT e.* FROM exams e WHERE e.exam_id = ?", [ $response['exam_id'] ]);
  					return $response;
  				});
  			}
  		}

      $collection = [];
  		$collection['info'] = $info;
  		$collection['question_id_list'] = $question_id_list;
  		$collection['questions'] = $questions;
  		$collection['user_datas'] = [];
  
  		$response['collection'] = $collection;
  		print_response($app, $response);
  	});
  	
  	
  	$app->get('/tag', function() use ($app) {
  		$mysql = start_mysql();
  		
  		$random = $app->request()->params('random');
  		$load_questions = $app->request()->params('load_questions');
  		$load_first_question = $app->request()->params('load_first_question');
  		
  		$tag = urldecode($app->request()->params('tag'));
  		$question_id_list_string =  $app->request()->params('question_id_list');
      $question_id_list = explode(",", $question_id_list_string);
  

  		// Info
  		$info = [];
  		$info['type'] = 'tag';
  		$info['tag'] = $tag;
  		
  		
      // Load questions
      $questions = [];
  		for ($i = 0; $i < count($question_id_list); $i++) {
  			$question_id = $question_id_list[$i];
  			
  			if ($load_questions OR ($i == 0 AND $load_first_question)) {
  				$questions[$question_id] = execute_mysql($mysql, "SELECT q.* FROM questions q WHERE q.question_id = ?", [$question_id], function($stmt, $mysql) {
  					$response = $stmt->fetch(PDO::FETCH_ASSOC);
  					$response['answers'] = unserialize($response['answers']);
  					$response['info'] = get_fetch($mysql, "SELECT e.* FROM exams e WHERE e.exam_id = ?", [ $response['exam_id'] ]);
  					return $response;
  				});
  			}
  		}
  
  		$collection['info'] = $info;
  		$collection['question_id_list'] = $question_id_list;
  		$collection['questions'] = $questions;
  		$collection['user_datas'] = [];
  
  		$response['collection'] = $collection;
  		print_response($app, $response);
  	});
  	
  	
  	$app->get('/search', function() use ($app) {
  		$mysql = start_mysql();
  		
  		$random = $app->request()->params('random');
  		$load_questions = $app->request()->params('load_questions');
  		$load_first_question = $app->request()->params('load_first_question');
  		
  		$query = urldecode($app->request()->params('query'));
  		$subject = urldecode($app->request()->params('subject'));
  		$semester = $app->request()->params('semester');
  		$question_id_list_string =  $app->request()->params('question_id_list');
      $question_id_list = explode(",", $question_id_list_string);
  

  		// Info
  		$info = [];
  		$info['type'] = 'search';
  		$info['query'] = $query;
  		$info['subject'] = $subject;
  		$info['semester'] = $semester;
  		
  		
      // Load questions
      $questions = [];
  		for ($i = 0; $i < count($question_id_list); $i++) {
  			$question_id = $question_id_list[$i];
  			
  			if ($load_questions OR ($i == 0 AND $load_first_question)) {
  				$questions[$question_id] = execute_mysql($mysql, "SELECT q.* FROM questions q WHERE q.question_id = ?", [$question_id], function($stmt, $mysql) {
  					$response = $stmt->fetch(PDO::FETCH_ASSOC);
  					$response['answers'] = unserialize($response['answers']);
  					$response['info'] = get_fetch($mysql, "SELECT e.* FROM exams e WHERE e.exam_id = ?", [ $response['exam_id'] ])['result'];
  					return $response;
  				});
  			}
  		}
  
  		$collection['info'] = $info;
  		$collection['question_id_list'] = $question_id_list;
  		$collection['questions'] = $questions;
  		$collection['user_datas'] = [];
  
  		$response['collection'] = $collection;
  		print_response($app, $response);
  	});
  });
	
	

	$app->post('', function() use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "INSERT INTO collections (user_id, data, save_date) VALUES (?, ?, ?)", [$data->user_id, serialize($data->data), time()], function($stmt, $mysql) {
			$response['collection_id'] = $mysql->lastInsertId();
			return $response;
		});
		print_response($app, $response);
	});


	$app->put('/:collection_id', function($collection_id) use ($app) {
		$data = json_decode($app->request()->getBody());

		$mysql = start_mysql();
		$response = execute_mysql($mysql, "UPDATE collections SET data = ?, save_data = ? WHERE collection_id = ?", [serialize($data->data), time(), $collection_id]);
		print_response($app, $response);
	});


	$app->delete('/:collection_id', function($collection_id) use ($app) {
		$mysql = start_mysql();
		$response = execute_mysql($mysql, "DELETE FROM collections WHERE collection_id = ?", [$collection_id], null);
		print_response($app, $response);
	});
});

?>
