<!DOCTYPE html>
<html id="ng-app" lang="de" ng-app="crucio.outside">
	<head>
		<?php include 'parts/header.php'; ?>
		
		<title>Registrieren | Crucio</title>
		
		<script src="public/js/ui-bootstrap-tpls.min.js"></script>
		<script>
			var module = angular.module('crucio.outside', ['ui.bootstrap']);
			module.controller('ctrl', function($scope, $http, $window, $modal, Validate) {
				// Check if user is in local storage
				if (angular.isDefined(localStorage.user)) {
					$window.location.replace('/questions');
				}
				
				/* $scope.$watch("username", function( newValue, oldValue ) {
					if(newValue != oldValue) {
						$scope.error_no_name = !Validate.non_empty(newValue);
						$scope.error_duplicate_name = 0;
					}
				}, true); */
				
				// Register Function
				$scope.register = function() {
					
					// Errors
					$scope.no_name_error = false;
					$scope.duplicate_name_error = false;
					$scope.no_mail_error = false;
					$scope.duplicate_mail_error = false;
					$scope.no_semester_error = false;
					$scope.no_password_error = false;
					$scope.no_passwordc_error = false;
					
					// Form Validation
					var validation = true;
					if (!$scope.username) {
					    $scope.no_name_error = true;
					    validation = false;
				    }
				    if (!Validate.email($scope.email)) {
					    $scope.no_mail_error = true;
					    validation = false;
				    }
				    if (!$scope.semester || $scope.semester <= 0) {
					    $scope.no_semester_error = true;
					    validation = false;
				    }
				    if (!$scope.password) {
					    $scope.no_password_error = true;
					    validation = false;
				    }
				    if ($scope.password != $scope.passwordc) {
					    $scope.no_passwordc_error = true;
					    validation = false;
				    }
				    if (!validation) { return false; }
					
					
					var post_data = { username: $scope.username, email: $scope.email, password: $scope.password, semester: $scope.semester, course: $scope.course };
					$http.post('api/v1/users', post_data).success(function(data) {
						if (data.status == 'success') {
							$modal.open({ templateUrl: 'register-modal.html' });
					
						} else if (data['status'] == 'error_username_taken') {
							$scope.duplicate_name_error = true;
					
					    } else if (data.status == 'error_email_taken') {
							$scope.duplicate_mail_error = true;
					    	
					    } else {
							$scope.no_name_error = true;
							$scope.no_mail_error = true;
							$scope.no_semester_error = true;
							$scope.no_password_error = true;
					    }
					});
				}
			});
			
			module.service('Validate', function($http) {
				var whitelist = Array();
				$http.get('api/v1/whitelist').success(function(data) {
					whitelist = data.whitelist;
				});
			
				this.email = function(email) {
					var regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
					// var regex = /med\d\d\D\D\D@studserv\.uni-leipzig\.de/; // Nur Medi
			
					if (whitelist.length == 0) { return true; }
					if (regex.test(email)) { return true; }
			
					for (var i = 0; i < whitelist.length; i++) {
						if(whitelist[i].mail_address == email) { return true; }
					}
					return false;
				}
			});
		</script>
		
		<script id="register-modal.html" type="text/ng-template">
		    <div class="modal-header">
		        <h3 class="modal-title">Registrierung</h3>
		    </div>
		    <div class="modal-body">
		        <p><i class="fa fa-check"></i> Du hast dich erfolgreich registriert. Schau mal in deinen Mail Account.</p>
		    </div>
		    <div class="modal-footer">
		        <button class="btn btn-default" type="button" ng-click="$close()">Zurück</button>
		    </div>
		</script>
	</head>

	<body class="body">
		<div class="wrap">
			<div class="container-white">
    			<div class="container container-top-bar">
	    			<div class="row">
			    		<div class="col-md-9 col-md-offset-1 col-sm-8 col-sm-offset-1">
							<h1><a href="/" target="_self"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>

			    		<div class="col-xs-6 col-md-2 col-sm-3">
				    		<a class="btn btn-block btn-index-top" href="/" target="_self">
					        	<i class="fa fa-sign-in fa-fw hidden-xs"></i> Anmelden
							</a>
			    		</div>
	    			</div>
    			</div>
    		</div>

			<div class="container-back-image container-padding-4" style="margin-top:2px;">
				<div class="container container-text container-text-light">
    				<i class="fa fa-pencil-square-o fa-5x"></i>
    				<h4>Registrieren</h4>
    			</div>
			</div>

			<form class="form-horizontal" ng-controller="ctrl">
				<div class="container-padding-4">
					<div class="container">
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Name</label>
			    	        <div class="col-sm-4">
			    	    		<input class="form-control span5 form-control-out" type="text" placeholder="Vorname Nachname" ng-class="{'has-error': no_name_error || duplicate_name_error}" ng-model="username"/>
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="no_name_error">Kein Name</span>
			    	        <span class="label validation-error label-danger" ng-show="duplicate_name_error">Name wird bereits verwendet</span>
			    	    </div>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">E-Mail</label>
			    	        <div class="col-sm-4">
			    	    		<input class="form-control span5 form-control-out" type="text" placeholder="________@studserv.uni-leipzig.de" ng-class="{'has-error': no_mail_error || duplicate_mail_error}" ng-model="email" />
			    	        </div>
			    	        <span class="label label-danger validation-error" ng-show="no_mail_error">Keine gültige E-Mail-Adresse</span>
			    	        <span class="label label-danger validation-error" ng-show="duplicate_mail_error">E-Mail-Adresse wird bereits verwendet</span>
			    	    </div>
					
			    	    <hr>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Studienfach</label>
			    	        <div class="col-sm-3">
			    	        	<div class="btn-group">
					            	<label class="btn btn-default" btn-radio="1" ng-model="course">Humanmedizin</label>
								</div>
			    	        </div>
			    	    </div>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Fachsemester</label>
			    	        <div class="col-sm-2">
			    	        	<input class="form-control form-control-out" type="number" ng-class="{'has-error': no_semester_error}" ng-model="semester">
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="no_semester_error">Kein gültiges Semester</span>
			    	    </div>
					
			    	    <hr>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Passwort</label>
			    	        <div class="col-sm-4">
			    	    		<input class="form-control span5 form-control-out" type="password" ng-class="{'has-error': no_password_error}" ng-model="password"/>
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="no_password_error">Kein gültiges Passwort</span>
			    	    </div>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Passwort bestätigen</label>
			    	        <div class="col-sm-4">
			    	    		<input class="form-control span5 form-control-out" type="password" ng-class="{'has-error': no_passwordc_error}" ng-model="passwordc"/>
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="no_passwordc_error">Passwörter nicht gleich</span>
			    	    </div>
					</div>
				</div>
				
				<div class="container-light-grey container-padding-4">
					<div class="container container-text container-text-dark">
    					<i class="fa fa-legal fa-5x"></i>
    					<h4>Warte! Was ist mit den AGB?</h4>
    					<p>
	    					Na, heute sind wir mal nicht so. Einfach nett zueinander sein und nichts böses machen. Ihr seid selbst für Fragen und Klausuren verantwortlich, die ihr hochladet. Und es wär cool, wenn wir deine Antworten dazu verwenden könnten besonders schwierige Fragen herauszufinden. Die können wir dir dann gesondert vorschlagen, so wird das Lernen noch effektiver. Falls du diese Auswertung deiner Daten nicht willst, kannst du sie unter deinen Einstellungen abschalten.
    					</p>
				
						<button class="btn btn-green btn-lg" ng-click="register()">Registrieren</button>
    				</div>
				</div>
			</div>
		</div>

		<?php include 'parts/footer.php'; ?>
	</body>
</html>