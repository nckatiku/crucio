angular.module('app.user', ['ui.slider'])

	.controller('accountCtrl', function($scope, Page, Auth, API, Validate) {
		Page.setTitleNav('Account | Crucio', 'Name');
		$scope.user = Auth.user();
		$scope.user.semester = parseInt($scope.user.semester);

		$scope.Validate = Validate;

		$scope.old_password = '';
		$scope.wrong_password = false;

		$scope.submit_button_title = 'Speichern';

		$scope.$watch("user.email", function( newValue, oldValue ) {
			if (newValue != oldValue)
				$scope.submit_button_title = 'Speichern';
		}, true);
		$scope.$watch("old_password", function( newValue, oldValue ) {
			if (newValue != oldValue) {
				$scope.submit_button_title = 'Speichern';
				$scope.wrong_password = false;
			}
		}, true);
		$scope.$watch("new_password", function( newValue, oldValue ) {
			if (newValue != oldValue)
				$scope.submit_button_title = 'Speichern';
		}, true);
		$scope.$watch("new_password_c", function( newValue, oldValue ) {
			if (newValue != oldValue)
				$scope.submit_button_title = 'Speichern';
		}, true);

		$scope.save_user = function() {
			var validation = true;
			if (!Validate.email($scope.user.email)) {
				validation = false;
			}	
			if (!$scope.user.semester || $scope.user.semester <= 0) {
				validation = false;
			}
				
			// Assuming User Wants to Change Password
			if ($scope.old_password.length > 0) {
				if ($scope.new_password.length < 6) {
					validation = false;
				}
				if ($scope.new_password != $scope.new_password_c) {
					validation = false;
				}
			}
			
			if (!validation) {
				$scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
				return false;
			}

			$scope.submit_button_title = 'Speichern...';

			var postData = {'email': $scope.user.email.replace('@','(@)'), 'course_id': $scope.user.course_id, 'semester': $scope.user.semester, 'current_password': $scope.old_password, 'password': $scope.new_password};
			API.put('/users/' + $scope.user.user_id + '/account', postData, function(data) {
				if(data.status == 'success') {
					Auth.setUser($scope.user);
			    	$scope.submit_button_title = 'Gespeichert';

				} else {
					$scope.user = Auth.user();
					$scope.user.semester = parseInt($scope.user.semester);

					if (data.status == 'error_incorrect_password')
						$scope.wrong_password = true;

					$scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
				}
			});
		}
	})


	.controller('settingsCtrl', function($scope, Page, Auth, API) {
		Page.setTitleNav('Einstellungen | Crucio', 'Name');
		$scope.user = Auth.user();

		$scope.submit_button_title = 'Speichern';

	    $scope.update_user = function() {
		    $scope.submit_button_title = 'Speichern...';
		    
		    var postData = {'highlightExams': $scope.user.highlightExams, 'showComments': $scope.user.showComments, 'repetitionValue': $scope.user.repetitionValue, 'useAnswers': $scope.user.useAnswers, 'useTags': $scope.user.useTags};
		    API.put('/users/' + $scope.user.user_id + '/settings', postData, function(data) {
		    	if (data.status == 'success') {
			    	Auth.setUser($scope.user);
			    	$scope.submit_button_title = 'Gespeichert';

		    	} else {
		    		$scope.user = Auth.user();
		    		$scope.submit_button_title = 'Speichern nicht möglich...';
		    	}
		    });
		}

		$scope.remove_all_results = function() {
			API.delete('/results/' + $scope.user.user_id, function(data) { });
		}
	})


	.service('Validate', function(API) {
		var whitelist = Array();
		API.get('/whitelist', function(data) {
			whitelist = data.whitelist;
		});

		this.email = function(email) {
			var regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
			// var regex = /med\d\d\D\D\D@studserv\.uni-leipzig\.de/; // Nur Medi

			if (whitelist.length == 0) { return true; }
			if (regex.test(email)) { return true; }

			for (var i = 0; i < whitelist.length; i++) {
				if (whitelist[i].mail_address == email) { return true; }
			}
			return false;
		}

		this.password = function(password) {
			if (!password) { return false; }
			if (password.length < 6) { return false; }
			return true;
		}

		this.non_empty = function(text) {
			if (text.length == 0) { return false; }
			return true;
		}
	});