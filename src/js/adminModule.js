angular.module('app.admin', ['angles'])

	.controller('adminCtrl', function($scope, Page, Auth, API, Selection, $interval) {
		Page.setTitleNav('Verwaltung | Crucio', 'Admin');
		$scope.user = Auth.user();
		
		$scope.tab_active = 'users';

		$scope.user_search = {'semester': '', 'group': '', 'login': '', 'query': '', 'query_keys': ['group_name', 'username']};
		$scope.comment_search = {'question_id': '', 'username': '', 'query': '', 'query_keys': ['question', 'comment', 'username', 'question_id']};

		$scope.update_activity = false;
		$scope.show_activity = {search_query: !true, result: !true, login: !true, register: !true, comment: !true, exam_new: !true, exam_update: !true};

		$scope.$watch('comment_search', function(newValue, oldValue) {
			$scope.questions_by_comment_display = [];
			if ($scope.questions_by_comment) {
				$scope.questions_by_comment.forEach(function(comments) {
					for (var i = 0; i < comments.length; i++) {
						var comment = comments[i];
						
						// Check if Comment satisfies search query
						if (Selection.is_element_included(comment, newValue)) {
							var found_idx = -1;
							for (var j = 0; j < $scope.questions_by_comment_display.length; j++) {
							    if ($scope.questions_by_comment_display[j][0].question == comment.question) {
							        found_idx = j;
							        break;
							    }
							}
							
							// Add to Array at Found Index
							if (found_idx > -1) {
								$scope.questions_by_comment_display[found_idx].push(comment);
								
							// Create New Array
							} else {
								$scope.questions_by_comment_display.push([comment]);
							}
						}
					}
		    	});
			}
		    $scope.questions_by_comment_display.sort(function(a, b) {return b[0].date - a[0].date});
		}, true);
		
		API.get('/users', function(data) {
			$scope.users = data.users;
			$scope.distinct_semesters = Selection.find_distinct($scope.users, 'semester');
			$scope.distinct_semesters.sort(function(a, b) {return a-b});
			$scope.distinct_groups = ['Standard', 'Admin', 'Autor'];
		});
		
		API.get('/comments', function(data) {
			$scope.comments = data.comments;
			$scope.distinct_questions = Selection.find_distinct($scope.comments, 'question_id');
			$scope.distinct_users = Selection.find_distinct($scope.comments, 'username');

			$scope.questions_by_comment = [];
			$scope.comments.forEach(function(c) {
				var found = -1;
				for (var i = 0; i < $scope.questions_by_comment.length; i++) {
				    if ($scope.questions_by_comment[i][0].question == c.question) {
				        found = i;
				        break;
				    }
				}

			    if (found > -1) {
				    $scope.questions_by_comment[found].push(c);
			    
			    } else {
				    $scope.questions_by_comment.push([c]);
			    }
		    });
		    $scope.questions_by_comment_display = $scope.questions_by_comment;
		});
		
		API.get('/whitelist', function(data) {
			$scope.whitelist = data.whitelist;
		});
		
		API.get('/stats/general', function(data) {
			$scope.stats = data.stats;
		});


		$scope.add_mail = function() {
			var email = $scope.new_whitelist_mail;
			if (email.length) {
				$scope.whitelist.push({username: '', mail_address: email});

				var post_data = {mail_address: email.replace('@','(@)')};
				API.post('/whitelist', post_data, function(data) { });
			}
		}

		$scope.remove_mail = function(index) {
			var email = $scope.whitelist[index].mail_address;
			if (email.length) {
				$scope.whitelist.splice(index, 1);
				API.delete('/whitelist/' + email, function(data) { });
			}
		}

		$scope.send_mail = function() {
			var mailAddresses = '';

	    	$('#user-table tbody tr:visible').children('td').children('a').each(function(i, obj) {
	    		mailAddresses += $(obj).attr('data-original-title') + ',';
	    	});

	    	mailAddresses = mailAddresses.slice(0,-1);
	    	$window.location.href = 'mailto:' + mailAddresses;
		}

		$scope.is_today = function(date) {
			var today = new Date();

			var date_c = new Date(date * 1000);
			if (today.toDateString() == date_c.toDateString()) {
				return true;
			
			} else {
				return false;
			}
		};

		$scope.is_yesterday = function(date) {
			var today = new Date();
			var diff = today - 1000 * 60 * 60 * 24;
			var yesterday = new Date(diff);

			var date_c = new Date(date * 1000);
			if (yesterday.toDateString() == date_c.toDateString()) {
				return true;
			
			} else {
				return false;
			}
		};

		$scope.user_in_selection = function(index) {
			return Selection.is_element_included($scope.users[index], $scope.user_search);
		}

		$scope.user_in_selection_count = function() {
			return Selection.count($scope.users, $scope.user_search);
		}

		$scope.comment_in_selection_count = function() {
			return Selection.count($scope.comments, $scope.comment_search);
		}

		$scope.change_all_semester = function(number) {
			var post_data = {number: number};
			API.post('/admin/change-semester/dFt(45i$hBmk*I', post_data, function(data) {
	    		alert(data.status);
			});
		}

		$scope.remove_test_account = function(index) {
			API.delete('/users/test-account', function(data) {
				alert(data.status);
			});
		}
	})
	
	.controller('liveStatisticsCtrl', function($scope, Page, Auth, API, $interval) {
		Page.setTitleNav('Live Statistik | Crucio', 'Admin');
		$scope.user = Auth.user();
		$scope.tab_active = 'live-statistic';
		
		$scope.update_activity = false;
		$scope.show_activity = {search_query: !true, result: !true, login: !true, register: !true, comment: !true, exam_new: !true, exam_update: !true};

		var first = true;

		function reloadData() {
			API.get('/stats/general', function(data) {
				$scope.stats = data.stats;

				if (first) {
					$scope.chart_users = [{value: parseInt($scope.stats.user_count_semester[0]), color: "#e74c3c", label: "1. Semester"},
						{value: parseInt($scope.stats.user_count_semester[1]), color: "#e67e22", label: "2. Semester"},
						{value: parseInt($scope.stats.user_count_semester[2]), color: "#f1c40f", label: "3. Semester"},
						{value: parseInt($scope.stats.user_count_semester[3]), color: "#2ecc71", label: "4. Semester"},
						{value: parseInt($scope.stats.user_count_semester[4]), color: "#1abc9c", label: "5. Semester"},
						{value: parseInt($scope.stats.user_count_semester[5]), color: "#3498db", label: "6. Semester"},
						{value: parseInt($scope.stats.user_count_semester[6]), color: "#34495e", label: ">6. Semester"}];

					$scope.chart_exams = [{value: parseInt($scope.stats.exam_count_semester[0]), color: "#e74c3c", label: "1. Semester"},
						{value: parseInt($scope.stats.exam_count_semester[1]), color: "#e67e22", label: "2. Semester"},
						{value: parseInt($scope.stats.exam_count_semester[2]), color: "#f1c40f", label: "3. Semester"},
						{value: parseInt($scope.stats.exam_count_semester[3]), color: "#2ecc71", label: "4. Semester"},
						{value: parseInt($scope.stats.exam_count_semester[4]), color: "#1abc9c", label: "5. Semester"},
						{value: parseInt($scope.stats.exam_count_semester[5]), color: "#3498db", label: "6. Semester"},
						{value: parseInt($scope.stats.exam_count_semester[6]), color: "#34495e", label: ">6. Semester"}];

					$scope.chart_questions = {
					    labels: ["Gesamt", "Sichtbar", "Mit Lösung", "Mit Erklärung", "Mit Kategorie", "Freie Frage"],
					    datasets: [{
					        data: [$scope.stats.question_count, $scope.stats.visible_question_count, $scope.stats.question_count-$scope.stats.question_without_answer_count, $scope.stats.question_explanation_count, $scope.stats.question_topic_count, $scope.stats.question_free_count]
					    }]
					};

					/* $scope.chart_time_user = {
					    labels: [$scope.stats.result_dep_time_day[0], $scope.stats.result_dep_time_day[1]],
						datasets: [
						    {
						        label: "Nutzer",
						        fillColor: "rgba(220,220,120,0.2)",
								strokeColor: "rgba(220,220,120,1)",
								pointColor: "rgba(220,220,120,1)",
								pointStrokeColor: "#fff",
								pointHighlightFill: "#fff",
						        data: [$scope.stats.result_dep_time_day[0], $scope.stats.result_dep_time_day[1]]
						    }
						]
					};

					$scope.chart_time_question = {
					    labels: $scope.stats.date_name,
						datasets: [
						    {
					        	label: "Fragen",
						        fillColor: "rgba(151,187,205,0.2)",
								strokeColor: "rgba(151,187,205,1)",
								pointColor: "rgba(151,187,205,1)",
								pointStrokeColor: "#fff",
								pointHighlightFill: "#fff",
								pointHighlightStroke: "rgba(151,187,205,1)",
						        data: $scope.stats.question_count_time
						    }
						]
					};

					$scope.chart_time_result = {
					    labels: $scope.stats.date_name,
						datasets: [
						    {
						        label: "Antworten",
						        fillColor: "rgba(251,127,105,0.2)",
								strokeColor: "rgba(251,127,105,1)",
								pointColor: "rgba(251,127,105,1)",
								pointStrokeColor: "#fff",
								pointHighlightFill: "#fff",
								pointHighlightStroke: "rgba(251,187,205,1)",
						        data: $scope.stats.result_count_time
						    }
						]
					}; */

					$scope.chart_time_result_today = {
						labels: $scope.stats.result_dep_time_today_label,
						datasets: [
						    {
						        label: "My Second dataset",
						        fillColor: "rgba(151,187,205,0.2)",
						        strokeColor: "rgba(151,187,205,1)",
						        pointColor: "rgba(151,187,205,1)",
						        pointStrokeColor: "#fff",
						        pointHighlightFill: "#fff",
						        pointHighlightStroke: "rgba(151,187,205,1)",
						        data: $scope.stats.result_dep_time_today
						    }
						]
					};

					first = false;
				}
			});

			API.get('/stats/search-queries', function(data) {
			   $scope.search_queries = data.search_queries;
			});

			API.post('/stats/activities', $scope.show_activity, function(data) {
			   $scope.activities = data.activities;
			});
		}

		reloadData();
		var timerData = $interval(function () {
			if ($scope.update_activity) { reloadData(); }	
		}, 2400);


	})
	
	.controller('qualityCtrl', function($scope, Page, Auth, API) {
		Page.setTitleNav('Verwaltung | Crucio', 'Admin');
		$scope.user = Auth.user();
		$scope.tab_active = 'format';
		
		API.get('/quality', function(data) {
			$scope.format = data.format;
			$scope.wrong = data.wrong;
		});
	})
	
	.directive('crGroup', function(API) {
		return {
			restrict: 'E',
			scope: { user: '=' },
			controller: function($scope, API) {
				$scope.change_group = function() {
					var user_id = $scope.user.user_id;
					var group_id = $scope.user.group_id;
					var group_name_array = ['Standard', 'Admin', 'Autor'];
					
					// Change Group ID
					if (group_id == 1) {
						group_id = 3;
					} else if (group_id == 2) {
						// Admins should not be changed
						// group_id = 1;
					} else if (group_id == 3) {
						// group_id = 2;
						group_id = 1;
					}
					
					$scope.user.group_id = group_id;
					$scope.user.group_name = group_name_array[group_id - 1];
					
					var post_data = {group_id: group_id};
					API.put('/users/' + user_id + '/group', post_data, function(data) { });
				}
			},
			templateUrl: 'public/html/cr-group.html',
			transclude: true
		};
	})
	
	.directive('timeago', function() {
		var strings = {
			prefixAgo: "vor",
			prefixFromNow: "in",
			suffixAgo: "",
			suffixFromNow: "",
			seconds: "wenigen Sekunden",
			seconds_2: "einigen Sekunden",
			minute_2: "unter einer Minute",
			minute: "etwa einer Minute",
			minute_3: "über einer Minute",
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

					var words = seconds < 10 && substitute(strings.seconds, Math.round(seconds)) ||
					  seconds < 30 && substitute(strings.seconds_2, Math.round(seconds)) ||
					  seconds < 50 && substitute(strings.minute_2, 1) ||
					  seconds < 70 && substitute(strings.minute, 1) ||
					  seconds < 90 && substitute(strings.minute_3, 1) ||
					  minutes < 55 && substitute(strings.minutes, Math.round(minutes)) ||
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
	});