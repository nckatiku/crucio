<!DOCTYPE html>
<html ng-app="crucio.outside" id="ng-app">
	<head>
		<?php include 'parts/header.php'; ?>
		
		<title>Registrieren | Crucio</title>
		
		<script src="public/js/ui-bootstrap-tpls.min.js"></script>
		<script type="text/javascript">
			var angularModule = angular.module('crucio.outside', ['ui.bootstrap']);
			angularModule.controller('ctrl', function($scope, $http, $window, $modal, Validate) {
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
					$scope.noNameError = false;
					$scope.duplicateNameError = false;
					$scope.noMailError = false;
					$scope.duplicateMailError = false;
					$scope.noSemesterError = false;
					$scope.noPasswordError = false;
					$scope.noPasswordCError = false;
					
					// Form Validation
					var validation = true;
					if (!$scope.username) {
					    $scope.noNameError = true;
					    validation = false;
				    }
				    if (!Validate.email($scope.email)) {
					    $scope.noMailError = true;
					    validation = false;
				    }
				    if (!$scope.semester || $scope.semester <= 0) {
					    $scope.noSemesterError = true;
					    validation = false;
				    }
				    if (!$scope.password) {
					    $scope.noPasswordError = true;
					    validation = false;
				    }
				    if ($scope.password != $scope.passwordc) {
					    $scope.noPasswordCError = true;
					    validation = false;
				    }
				    if (!validation) { return false; }
					
					
					var postData = { username: $scope.username, email: $scope.email, password: $scope.password, semester: $scope.semester, course: $scope.course };
					$http.post('api/v1/users', postData).success(function(data) {
						if (data.status == 'success') {
							$modal.open({ templateUrl: 'register-modal.html' });
					
						} else if (data['status'] == 'error_username_taken') {
							$scope.duplicateNameError = true;
					
					    } else if (data.status == 'error_email_taken') {
							$scope.duplicateMailError = true;
					    	
					    } else {
							$scope.noNameError = true;
							$scope.noMailError = true;
							$scope.noSemesterError = true;
							$scope.noPasswordError = true;
					    }
					});
				}
			});
			
			angularModule.service('Validate', function($http) {
				var whitelist = Array();
				$http.get('api/v1/whitelist').success(function(data) {
					whitelist = data.whitelist;
				});
			
				this.email = function(email) {
					var regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
					// var regex = /med\d\d\D\D\D@studserv\.uni-leipzig\.de/; // Nur Medi
			
					if (whitelist.length == 0)
						return true;
			
					if (regex.test(email))
						return true;
			
					for (var i = 0; i < whitelist.length; i++) {
						if(whitelist[i].mail_address == email)
							return true;
					}
					return false;
				}
			});
		</script>
		
		<script type="text/ng-template" id="register-modal.html">
		    <div class="modal-header">
		        <h3 class="modal-title">Registrierung</h3>
		    </div>
		    <div class="modal-body">
		        <p><i class="fa fa-check"></i> Du hast dich erfolgreich registriert. Schau mal in deinen Mail Account.</p>
		    </div>
		    <div class="modal-footer">
		        <button type="button" class="btn btn-default" ng-click="$close()">Zurück</button>
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
			    	    		<input class="form-control span5 form-control-out" ng-class="{'has-error': noNameError || duplicateNameError}" ng-model="username" type="text" placeholder="Vorname Nachname"/>
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="noNameError">Kein Name</span>
			    	        <span class="label validation-error label-danger" ng-show="duplicateNameError">Name wird bereits verwendet</span>
			    	    </div>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">E-Mail</label>
			    	        <div class="col-sm-4">
			    	    		<input class="form-control span5 form-control-out" ng-class="{'has-error': noMailError || duplicateMailError}" ng-model="email" type="text" placeholder="________@studserv.uni-leipzig.de"/>
			    	        </div>
			    	        <span class="label label-danger validation-error" ng-show="noMailError">Keine gültige E-Mail-Adresse</span>
			    	        <span class="label label-danger validation-error" ng-show="duplicateMailError">E-Mail-Adresse wird bereits verwendet</span>
			    	    </div>
					
			    	    <hr>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Studienfach</label>
			    	        <div class="col-sm-3">
			    	        	<div class="btn-group">
					            	<label class="btn btn-default" ng-model="course" btn-radio="1">Humanmedizin</label>
								</div>
			    	        </div>
			    	    </div>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Fachsemester</label>
			    	        <div class="col-sm-2">
			    	        	<input class="form-control form-control-out" ng-class="{'has-error': noSemesterError}" ng-model="semester" type="number">
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="noSemesterError">Kein gültiges Semester</span>
			    	    </div>
					
			    	    <hr>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Passwort</label>
			    	        <div class="col-sm-4">
			    	    		<input class="form-control span5 form-control-out" ng-class="{'has-error': noPasswordError}" ng-model="password" type="password"/>
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="noPasswordError">Kein gültiges Passwort</span>
			    	    </div>
					
			    	    <div class="form-group">
			    	        <label class="col-sm-3 control-label">Passwort bestätigen</label>
			    	        <div class="col-sm-4">
			    	    		<input class="form-control span5 form-control-out" ng-class="{'has-error': noPasswordCError}" ng-model="passwordc" type="password"/>
			    	        </div>
			    	        <span class="label validation-error label-danger" ng-show="noPasswordCError">Passwörter nicht gleich</span>
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