angular.module('app.learn', ['ui.slider'])

	.controller('questionsCtrl', function($scope, Page, Auth, API, Exam, $location, Selection) {
		Page.setTitleNav('Lernen | Crucio', 'Lernen');
		$scope.user = Auth.user();

		$scope.exam_search = {subject: '', semester: '', query: '', query_keys: ['subject', 'semester', 'date']};
		$scope.comment_search = {query: '', query_keys: ['comment', 'username', 'question_id']};
		$scope.tag_search = {query: '', query_keys: ['tag']};

		$scope.question_field_message = '';

		$scope.selection_subject_list = {};
		$scope.selection_number_questions = 0;
		$scope.number_questions_in_choosen_subjects = 0;
		$scope.conditions = 1;
		
		$scope.tab_active = 'abstract';


		var spinner = new Spinner({length: 0, radius: 18, color: '#333', shadow: false});
		
		$scope.slider = { step: 10, min: 0, max: $scope.number_questions_in_choosen_subjects}
		
		$scope.$watch('selection_subject_list', function( newValue, oldValue ) {
			var post_data = {ignoreLoadingBar: true, selection_subject_list: $scope.selection_subject_list};
			API.post('/learn/number-questions', post_data, function(data) {
				$scope.number_questions_in_choosen_subjects = data.number_questions;

				if ($scope.selection_number_questions == 0) {
					$scope.selection_number_questions = Math.min($scope.number_questions_in_choosen_subjects, 50);
				}

				if ($scope.selection_number_questions > $scope.number_questions_in_choosen_subjects) {
					$scope.selection_number_questions = $scope.number_questions_in_choosen_subjects;
				}
			});
		}, true);

		$scope.$watch('number_questions_in_choosen_subjects', function( newValue, oldValue ) {
			var max = $scope.number_questions_in_choosen_subjects;
			if (max > 200) { max = 200; }
				

			var step = 10;
			if (max < 40) { step = 4; }
			if (max < 20) { step = 1; }
				

			if (max < 200)
				if (max % step != 0)
					max += step;
			$scope.slider = { step: step, min: 0, max: max}
		}, true);
		
		API.get('/exams/user_id/' + $scope.user.user_id, function(data) {
			$scope.exams = data.exam;
			$scope.distinct_semesters = Selection.find_distinct($scope.exams, 'semester');
			$scope.distinct_subjects = Selection.find_distinct($scope.exams, 'subject');

			// Find Exams for Abstract
		    $scope.abstract_exams = [];
		    $scope.exams.forEach(function(entry) {
		    	var select = true;

		    	if (entry.semester != $scope.user.semester) { select = false; }
		    	if (entry.date == 'unbekannt') { select = false; }

		    	if ($scope.exams.length > 10) {
			    	if (entry.question_count < 30) { select = false; }
		    	}

		    	if (entry.answered_questions > 0) { select = true; }

		    	if (select) {
		    		if (entry.answered_questions > 0) {
			    		$scope.abstract_exams.unshift(entry);
		    		
		    		} else {
			    		$scope.abstract_exams.push(entry);
		    		}
		    	}
		    });

		    $scope.ready = 1;
		});

		API.get('/tags/' + $scope.user.user_id, function(data) {
			$scope.tags = data.tags;

			$scope.distinct_tags = [];
		    $scope.tags.forEach(function(entry) {
		    	entry.tags.split(',').forEach(function(tagText) {
		    		if ($scope.distinct_tags.indexOf(tagText) == -1) {
		    			$scope.distinct_tags.push(tagText);
					}
				});
		    });

		    function clone(obj) {
			    if (null == obj || 'object' != typeof obj) return obj;
			    var copy = obj.constructor();
			    for (var attr in obj) {
			        if (obj.hasOwnProperty(attr)) { copy[attr] = clone(obj[attr]); }
			    }
			    return copy;
			}

			function sortByKey(array, key) {
			    return array.sort(function(a, b) {
			        var x = a[key];
			        var y = b[key];
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });
			}

			$scope.questions_by_tag = {};
		    $scope.distinct_tags.forEach(function(distinct_tag) {
			    $scope.questions_by_tag[distinct_tag] = [];
		    });
		    $scope.distinct_tags.forEach(function(distinct_tag) {
			    $scope.tags.forEach(function(entry) {
					entry.tags.split(',').forEach(function(tagText) {
						if (distinct_tag == tagText) {
							$scope.questions_by_tag[distinct_tag].push(entry);
						}
					});
				});
		    });
		});

		API.get('/comments/' + $scope.user.user_id, function(data) {
			$scope.comments = data.comments;
			
			$scope.questions_by_comment = {};
		    $scope.comments.forEach(function(c) {
			    $scope.questions_by_comment[c.question] = [];
		    });
		    $scope.comments.forEach(function(c) {
			    $scope.questions_by_comment[c.question].push(c);
		    });
		});
		
		API.get('/subjects/categories', function(data) {
			$scope.subject_list = {};
			data.subjects.forEach(function(subject) {
				$scope.subject_list[subject.name] = [];
		    });
		    data.categories.forEach(function(category) {
				$scope.subject_list[category.subject_name].push(category.name);
		    });
		})


		$scope.learn_exam = function(exam_id) {
	    	var random = 1;
	    	API.get('/exams/action/prepare/' + exam_id + '/' + random, function(data) {
		    	var question_list = {list: data.list, exam_id: exam_id};
	    		Exam.setCurrentQuestionList(question_list);
				$location.path('/question').search('id', question_list.list[0].question_id);
			});
		}

		$scope.learn_subjects = function() {
			var post_data = {selection_subject_list: $scope.selection_subject_list, selection_number_questions: $scope.selection_number_questions};
			API.post('/learn/prepare', post_data, function(data) {
		    	var question_list = {list: data.list, selection_subject_list: selection_subject_list};
	    		Exam.setCurrentQuestionList(question_list);
				$location.path('/question').search('id', question_list.list[0].question_id);
			});
		}

		$scope.reset_results = function(index) {
			var exam_id = $scope.exams[index].exam_id;
			$scope.exams[index].answered_questions = 0;
			API.delete('/results/' + $scope.user.user_id + '/' + exam_id, function(data) { });
		}

		$scope.reset_abstract_results = function(index) {
			var exam_id = $scope.abstract_exams[index].exam_id;
			$scope.abstract_exams[index].answered_questions = 0;
			API.delete('/results/' + $scope.user.user_id + '/' + exam_id, function(data) { });
		}

		$scope.toggle_selection = function(subject, category, checked) {
			var selection = $scope.selection_subject_list;
			var subjects = $scope.subject_list;

			if (!checked) { checked = false; }

			if (Object.keys(selection).indexOf(subject) > -1) { // If Subject in Selection Keys
				if (selection[subject].length == 0) { // If Subject in Selection has Empty Array
					if (category == 'all') {
						selection[subject] = null;
					}

				} else if (selection[subject].length > 0) { // If Subject in Selection has Full Array
					if (category == 'all') {
						if (!checked) {
							selection[subject] = subjects[subject].slice(0);
						} else {
							selection[subject] = null;
						}

					} else {
						var idx = selection[subject].indexOf(category);
						if (idx > -1) {
							selection[subject].splice(idx, 1);
							if (selection[subject].length == 0) {
								selection[subject] = null;
							}
								
						} else {
							selection[subject].push(category);
						}
					}

				} else { // If Subject in Selection has No Array
					if (category == 'all') {
						selection[subject] = subjects[subject].slice(0);
					
					} else {
						selection[subject] = [category];
					}
				}

			} else {
				if (category == 'all') {
					selection[subject] = subjects[subject].slice(0);
				
				} else {
					selection[subject] = [category];
				}
			}
		}

		$scope.search_question = function() {
			$scope.search_results = [];

			var query_question = $scope.question_search_query;
			$scope.question_field_message = '';
			if (query_question.length) {
				spinner.spin(document.getElementById('spinner'));

				API.get('/questions/search/' + $scope.question_search_query + '/' + $scope.user.user_id, function(data) {
				    spinner.stop();

		    	    if (data.result.length == 0) {
			    	    $scope.question_field_message = 'Nichts gefunden ;(';

		    	    } else if (data.result.length > 100) {
			    	    $scope.question_field_message = 'Zu Viel gefunden, geht es ein bisschen konkreter? ;(';

		    	    } else {
		    	    	$scope.search_results = data.result;
		    	    }
				});
		    }
		}

		$scope.exam_in_selection = function(index) {
			return Selection.is_element_included($scope.exams[index], $scope.exam_search);
		}

		$scope.exam_in_selection_count = function() {
			return Selection.count($scope.exams, $scope.exam_search);
		}

		$scope.comment_in_selection = function(index) {
			return Selection.is_element_included($scope.comments[index], $scope.comment_search);
		}

		$scope.comment_in_selection_count = function() {
			return Selection.count($scope.comments, $scope.comment_search);
		}
	})


	.controller('examCtrl', function($scope, $routeParams, Page, Auth, API, Exam, $location, $modal) {
		Page.setTitleNav('Klausur | Crucio', 'Lernen');
		$scope.user = Auth.user();
		
		$scope.exam_id = $routeParams.id;
		$scope.question_list = {exam_id: $scope.exam_id, list: []};

		$scope.Math = window.Math;

		$scope.current_index = 0;
		
		API.get('/exams/' + $scope.exam_id, function(data) {
			$scope.exam = data;

			var questions =  $scope.exam.questions;
			for (i = 0; i < questions.length; i++) {
				var q = questions[i];
				$scope.question_list.list[i] = q;
			}
		});

		$scope.save_answer = function(question_i, given_answer) {
			$scope.question_list.list[question_i].given_result = String(given_answer);
		}

		$scope.hand_exam = function() {
			Exam.setCurrentQuestionList($scope.question_list);
			$location.path('/analysis').search('id', null);
		}

		$scope.open_image_model = function(file_name) {
			var modalInstance = $modal.open({
		    	templateUrl: 'imageModalContent.html',
		    	controller: 'ModalInstanceCtrl',
				resolve: {
					image_url: function() { return file_name; }
				}
			});
		};
	})


	.controller('questionCtrl', function($scope, Page, Auth, API, $routeParams, Exam, $location, $modal, $window) {
		Page.setTitleNav('Frage | Crucio', 'Lernen');
		$scope.user = Auth.user();
		
		Array.prototype.getIndexBy = function(name, value) {
		    for (var i = 0; i < this.length; i++) {
		        if (this[i][name] == value) {
		            return i;
		        }
		    }
		}

		$scope.answerButtonClass = 'btn-primary';
		
		$scope.question_list = Exam.currentQuestionList();

		$scope.question_id = $routeParams.id;
		$scope.reset_session = $routeParams.reset_session;
		
		// If Question does not exists, pass forward to the questions page
		if (!$scope.question_id) { $window.location.replace('/questions'); }

		$scope.show_explanation = 0;
		$scope.given_result = 0;
		$scope.strike = {};

		if ($scope.reset_session) {
			$scope.question_list = {};
			Exam.setCurrentQuestionList($scope.question_list);
		}

		if ($scope.question_list) {
			if (Object.keys($scope.question_list).length) {
				$scope.index = $scope.question_list.list.getIndexBy('question_id', $scope.question_id);
				$scope.length = $scope.question_list.list.length;
				$scope.show_answer = $scope.question_list.list[$scope.index].mark_answer;
				$scope.given_result = $scope.question_list.list[$scope.index].given_result;
				if ($scope.question_list.list[$scope.index].strike) {
					$scope.strike = $scope.question_list.list[$scope.index].strike;
				}
			}
		}

		$scope.$watch('strike', function( newValue, oldValue ) {
			if ($scope.question_list) {
				if (Object.keys($scope.question_list).length) {
					$scope.question_list.list[$scope.index].strike = newValue;
					Exam.setCurrentQuestionList($scope.question_list);
				}
			}
		}, true);
		
		API.get('/questions/' + $scope.question_id + '/user/' + $scope.user.user_id, function(data) {
			$scope.question = data;

			if ($scope.question.question_image_url) {
				if (false) {
					$scope.question.question_image_url = 'public' + $scope.question.question_image_url.slice(2);
					if (!image_exist($scope.question.question_image_url))
						$scope.question.question_image_url = '';
				} else {
					$scope.question.question_image_url = '/public/files/' + $scope.question.question_image_url;
				}
			}
			
			if ($scope.question.comments) {
				for (var i = 0; i < $scope.question.comments.length; i++) {
					$scope.question.comments[i].voting = ( parseInt($scope.question.comments[i].voting) || 0 );
					$scope.question.comments[i].user_voting = ( parseInt($scope.question.comments[i].user_voting) || 0 );
				}
			}
			

			function image_exist(url) {
				var img = new Image();
				img.src = url;
				return img.height != 0;
			}

			// Tag Functions
			var tags = [];
			if ($scope.question.tags) {
				tags = $scope.question.tags.split(',');
			}
				
			$('#tagInput').tagsManager({
			    prefilled: tags,
			    maxTags: 5,
			    replace: true,
			    output: null,
			    tagsContainer: null,
			    tagCloseIcon: '&times;',
			    tagClass: 'tm-tag-danger',
			    onlyTagList: false,
			    createHandler: function(tagManager, tags) {
			    	var post_data = {tags: tags, question_id: $scope.question_id, user_id: $scope.user.user_id};
			    	API.post('/tags', post_data, function(data) { });
			    },
			    removeHandler: function(tagManager, tags) {
			    	var post_data = {tags: tags, question_id: $scope.question_id, user_id: $scope.user.user_id};
			    	API.post('/tags', post_data, function(data) { });
			    }
			});

			if ($scope.given_result) {
				$scope.check_answer($scope.given_result);
			}

			if ($scope.show_answer) {
				$scope.mark_answer($scope.given_result);
			}

			// User has seen the Question
			// $scope.save_answer(-1);
		});

		// -- If Show Solution Button is Clicked
		$scope.show_solution = function() {
			var correct_answer = $scope.correct_answer();

			var correct = (correct_answer == $scope.given_result) ? 1 : 0;

	    	if (correct_answer == 0) { correct = -1; }
	    	if ($scope.question.type == 1) { correct = -1; }

	    	var post_data = {correct: correct, question_id: $scope.question_id, user_id: $scope.user.user_id, given_result: $scope.given_result};
	    	API.post('/results', post_data, function(data) { });

			if ($scope.question_list) {
	    		if (Object.keys($scope.question_list).length) {
		    		$scope.question_list.list[$scope.index].mark_answer = 1;
		    		Exam.setCurrentQuestionList($scope.question_list);
	    		}
	    	}

			$scope.mark_answer($scope.given_result);
		}

		// -- Saves the Answer
		$scope.save_answer = function(given_answer) {
			$scope.given_result = given_answer;

			if ($scope.question_list) {
				if (Object.keys($scope.question_list).length) {
					$scope.question_list.list[$scope.index].given_result = given_answer;
					Exam.setCurrentQuestionList($scope.question_list);
				}
			}
	    }

		// -- Checks the Answer Box
		$scope.check_answer = function(answer) {
			$scope.checked_answer = answer;
		}

		// -- Returns Correct Answer
		$scope.correct_answer = function() {
			return $scope.question.correct_answer;
		}

		// -- Colors the Given Answers and shows the correct Solution
		$scope.mark_answer = function(given_answer) {
			$scope.mark_answer_free = true;
			var type = $scope.question.type;
			var correct_answer = $scope.correct_answer();
	    	if (type > 1) {
	    		$scope.check_answer(given_answer);

				if (given_answer == correct_answer) {

				    $scope.correctAnswer = given_answer;
				    $scope.answerButtonClass = 'btn-success';
				} else {
				    $scope.wrongAnswer = given_answer;
				    $scope.correctAnswer = correct_answer;
				    $scope.answerButtonClass = 'btn-danger';
				}
	    	} else if (type == 1) {
		    	$scope.answerButtonClass = 'btn-info';
	    	}
		}

		$scope.add_comment = function() {
			var now = new Date() / 1000;
			var post_data = {comment: $scope.comment_text, question_id: $scope.question_id, reply_to: 0, username: $scope.user.username, date: now};
			API.post('/comments/' + $scope.user.user_id, post_data, function(data) {
				post_data.voting = 0;
	    		post_data.user_voting = 0;
	    		post_data.comment_id = data.comment_id;
	    		$scope.question.comments.push(post_data);
	    		$scope.comment_text = '';
			});
		}

		$scope.delete_comment = function(index) {
			var comment_id = $scope.question.comments[index].comment_id;
			API.delete('/comments/' + comment_id, function(data) { });
			$scope.question.comments.splice(index, 1);
		}

		$scope.open_image_model = function() {
			$modal.open({
		    	templateUrl: 'imageModalContent.html',
		    	controller: 'ModalInstanceCtrl',
				resolve: {
					image_url: function() { return $scope.question.question_image_url; }
				}
			});
		};
	})


	.controller('ModalInstanceCtrl', function ($scope, $modalInstance, image_url) {
		$scope.image_url = image_url;
	})


	.controller('analysisCtrl', function($scope, Page, Auth, API, Exam) {
		Page.setTitleNav('Analyse | Crucio', 'Lernen');
		$scope.user = Auth.user();
		
		Array.prototype.getArrayByKey = function(name) {
			var array = [];
		    for (var i = 0; i < this.length; i++) {
		        if (this[i][name]) {
		            array.push(this[i]);
		        }
		    }
		    return array;
		}
		
		$scope.question_list = Exam.currentQuestionList();

		// Post Results
		for (var i = 0; i < $scope.question_list.list.length; i++) {
			var question = $scope.question_list.list[i];

			if (!question.mark_answer) { // Don't save results again, they were saved during the question page
				if (question.type > 1) { // Don't save free questions
					if (question.given_result > 0) {
						var correct = (question.correct_answer == question.given_result) ? 1 : 0;
						if (question.correct_answer == 0) { correct = -1; }

						var post_data = {correct: correct, question_id: question.question_id, user_id: $scope.user.user_id, given_answer: question.given_result};
						API.post('/results', post_data, function(data) { });
					}
				}
				question.mark_answer = 'analysis';
			}
		}

		$scope.workedquestion_list = $scope.question_list.list.getArrayByKey('given_result');
		$scope.exam_id = $scope.question_list.exam_id;

		$scope.all_question_count = $scope.question_list.list.length;
		$scope.worked_question_count = $scope.workedquestion_list.length;

		$scope.correct_q_count = 0;
		$scope.wrong_q_count = 0;
		$scope.seen_q_count = 0;
		$scope.solved_q_count = 0;
		$scope.free_q_count = 0;
		$scope.no_answer_q_count = 0;

		$scope.get_random = function(min, max) {
			if (min > max) { return -1; }
			if (min == max) { return min; }

			var r;
			do {
				r = Math.random();
			} while(r == 1.0);

			return min + parseInt(r * (max - min + 1));
		}

		$scope.random = $scope.get_random(0, 1000);

		for (var i = 0; i < $scope.worked_question_count; i++) {
			var question = $scope.workedquestion_list[i];

			if (question.correct_answer == question.given_result && question.given_result > 0 && question.correct_answer > 0) {
				$scope.correct_q_count++;
			}
			if (question.correct_answer != question.given_result && question.given_result > 0 && question.correct_answer > 0) {
				$scope.wrong_q_count++;
			}
			if (question.given_result > 0) { $scope.solved_q_count++; }
			if (question.given_result > -2) { $scope.seen_q_count++; }
			if (question.type == 1) { $scope.free_q_count++; }
			if (question.correct_answer == 0 && question.type!=1) { $scope.no_answer_q_count++; }
		}

		if ($scope.exam_id) {
			API.get('/exams/' + $scope.exam_id, function(data) {
				$scope.exam = data;
			});
		}
	})


	.controller('statisticsCtrl', function($scope, Page, Auth) {
		Page.setTitleNav('Statistik | Crucio', 'Lernen');
		$scope.user = Auth.user();
	})


	.factory('Exam', function() {
		return {
			currentQuestionList: function() {
				return angular.fromJson(localStorage.currentQuestionList);
			},
			setCurrentQuestionList: function(newQuestionList) {
				localStorage.currentQuestionList = angular.toJson(newQuestionList);
			}
		}
	})

	.filter('newline_to_br', function($sce) {
	   return function (text) {
	       if (text !== undefined) return text.replace(/\n/g, '<br>');
	   };
	})

	.directive('timeago', function() {
		var strings = {
			prefixAgo: "vor",
			prefixFromNow: "in",
			suffixAgo: "",
			suffixFromNow: "",
			seconds: "wenigen Sekunden",
			minute: "etwa einer Minute",
			minutes: "%d Minuten",
			hour: "etwa einer Stunde",
			hours: "%d Stunden",
			day: "etwa einem Tag",
			days: "%d Tagen",
			month: "etwa einem Monat",
			months: "%d Monaten",
			year: "etwa einem Jahr",
			years: "%d Jahren",
			wordSeparator: " ",
			numbers: []
		}

		return {
	    	restrict:'A',
			link: function(scope, element, attrs){
				attrs.$observe("timeago", function(){
					var given = parseInt(attrs.timeago);
					var current = new Date().getTime();

					var distance_millis = Math.abs(current - given);
					var seconds = distance_millis / 1000;
					var minutes = seconds / 60;
					var hours = minutes / 60;
					var days = hours / 24;
					var years = days / 365;

					var prefix = strings.prefixAgo;
					var suffix = strings.suffixAgo;

					function is_function(functionToCheck) {
						var getType = {};
						return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
					}

					function substitute(stringOrFunction, number) {
						var string = is_function(stringOrFunction) ? stringOrFunction(number, distance_millis) : stringOrFunction;
						var value = (strings.numbers && strings.numbers[number]) || number;
						return string.replace(/%d/i, value);
					}

					var words = seconds < 45 && substitute(strings.seconds, Math.round(seconds)) ||
					  seconds < 90 && substitute(strings.minute, 1) ||
					  minutes < 45 && substitute(strings.minutes, Math.round(minutes)) ||
					  minutes < 90 && substitute(strings.hour, 1) ||
					  hours < 24 && substitute(strings.hours, Math.round(hours)) ||
					  hours < 42 && substitute(strings.day, 1) ||
					  days < 30 && substitute(strings.days, Math.round(days)) ||
					  days < 45 && substitute(strings.month, 1) ||
					  days < 365 && substitute(strings.months, Math.round(days / 30)) ||
					  years < 1.5 && substitute(strings.year, 1) ||
					  substitute(strings.years, Math.round(years));

					var separator = strings.wordSeparator;

					String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
					var result = [prefix, words, suffix].join(separator).trim();
					element.text(result);
				});
			}
		};
	})
	
	.directive('crCommentVote', function(API) {
		return {
			restrict: 'E',
			scope: { user: '=', comment: '=' },
			controller: function($scope, API) {
				$scope.increase_user_voting = function() {
					$scope.comment.user_voting = $scope.comment.user_voting == 1 ? 1 : $scope.comment.user_voting + 1;
					var post_data = {user_voting: $scope.comment.user_voting};
					API.post('/comments/' + $scope.comment.comment_id + '/user/' + $scope.user.user_id, post_data, function(data) { });
				}
				
				$scope.decrease_user_voting = function() {
					$scope.comment.user_voting = $scope.comment.user_voting == -1 ? -1 : $scope.comment.user_voting - 1;
					var post_data = {user_voting: $scope.comment.user_voting};
					API.post('/comments/' + $scope.comment.comment_id + '/user/' + $scope.user.user_id, post_data, function(data) { });
				}
			},
			templateUrl: 'public/html/cr-comment-vote.html',
			transclude: true
		};
	});