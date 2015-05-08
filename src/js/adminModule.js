angular.module('adminModule', [])

	.controller('adminCtrl', function($scope, Page, Auth, API, Selection, $interval) {
		Page.setTitleNav('Verwaltung | Crucio', 'Admin');
		$scope.user = Auth.user();

		$scope.user_search = {'semester': '', 'group': '', 'login': '', 'query': '', 'query_keys': ['group_name', 'username']};
		$scope.comment_search = {'question_id': '', 'username': '', 'query': '', 'query_keys': ['question', 'comment', 'username', 'question_id']};

		$scope.update_activity = false;
		$scope.show_activity = {search_query: !true, result: !true, login: !true, register: !true, comment: !true, exam_new: !true, exam_update: !true};
		
		$scope.tab_active = 'users';


		$scope.$watch('comment_search', function( newValue, oldValue ) {
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

			$scope.ready = 1;
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

				var postData = {mail_address: email.replace('@','(@)')};
				API.post('/whitelist', postData, function(data) { });
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

		$scope.change_group = function(index) {
			var user_id = $scope.users[index].user_id;
			var group_id = $scope.users[index].group_id;

			if (user_id == 1) { return false };

			if (group_id == 2) {
				group_id = 1;
				$scope.users[index].group_name = 'Standard';
			} else if (group_id == 3) {
				group_id = 2;
				$scope.users[index].group_name = 'Admin';
			} else {
				group_id = 3;
				$scope.users[index].group_name = 'Autor';
			}

			$scope.users[index].group_id = group_id;
			var postData = {'group_id': group_id};
			API.put('/users/' + user_id + '/group', postData, function(data) { });
		}

		$scope.is_today = function(date) {
			var today = new Date();

			var date_c = new Date(date * 1000);
			if(today.toDateString() == date_c.toDateString()) {
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

		$scope.increase_semester = function() {
			var postData = {'number': '1'};
			API.post('/admin/change-semester/dFt(45i$hBmk*I', postData, function(data) {
	    		alert(data.status);
			});
		}

		$scope.decrease_semester = function() {
			var postData = {'number': '-1'};
	    	API.post('/admin/change-semester/dFt(45i$hBmk*I', postData, function(data) {
	    		alert(data.status);
			});
		}

		$scope.remove_test_account = function(index) {
			API.delete('/users/test-account', function(data) {
				alert(data.status);
			});
		}
	});