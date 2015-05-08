<!DOCTYPE html>
<html ng-app="crucio.outside" id="ng-app">
	<head>
		<?php include 'parts/header.php'; ?>
		
		<title>Kontakt | Crucio</title>
		
		<script src="public/js/ui-bootstrap-tpls.min.js"></script>
		<script>
			var angularModule = angular.module('crucio.outside', ['ui.bootstrap']);
			angularModule.controller('ctrl', function($scope, $http, $location, $modal) {
				// Check if user is in local storage
				if (angular.isDefined(localStorage.user)) {
					$scope.user = angular.fromJson(localStorage.user);
					
					$scope.username = $scope.user.username;
					$scope.email = $scope.user.email;
					
					// Check if contact request is for a specific question
					var route_params = $location.search();
					var question_id = route_params['question_id'];
					if (question_id) {
						$scope.question_id = question_id;
						$scope.subject = route_params['s'];
						if ($scope.subject == '') {
							$scope.subject = 'Allgemein';
						} else if ($scope.subject == 'Antwort') {
							$scope.subject = 'Falsche Antwort';
						}
						
						$http.get('api/v1/questions/' + $scope.question_id).success(function(data) {
							$scope.question = data.question;
						});
					}
				}
			
				$scope.validateMail = function(mail) {
					var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					if (regex.test(mail)) { return false; }
					return true;
				}
			
				$scope.sendMail = function() {
					
					// Errors
					$scope.noNameError = false;
					$scope.noMailError = false;
					
					// Init Values
					var destination = 'kontakt@crucio-leipzig.de';
					
					// Form Validation
					var validation = true;
					if (!$scope.username) {
						validation = false;
						$scope.noNameError = true;
					}
					if (validateMail($scope.email)) {
						validation = false;
						$scope.noMailError = true;
					}
					if (!validation) { return false; }
					
					
					if ($scope.question_id) {
						destination += ', ' + $scope.question.email; // Author
						
						var post_data = {'name': $scope.username, 'email': $scope.email.replace('@','(@)'), 'text': $scope.text, 'question_id': $scope.question_id, 'author': $scope.question.username, 'question': $scope.question.question, 'exam_id': $scope.question.exam_id, 'subject': $scope.question.subject, 'date': $scope.question.date, 'author_email': $scope.question.email, 'mail_subject': $scope.subject};
						$http.post('api/v1/contact/send-mail-question', post_data).success(function(data) {
						    $modal.open({ templateUrl: 'contact-modal.html' });
						});
					
					} else {
						var post_data = {'name': $scope.username, 'email': $scope.email.replace('@','(@)'), 'text': $scope.text};
						$http.post('api/v1/contact/send-mail', post_data).success(function(data) {
						    $modal.open({ templateUrl: 'contact-modal.html' });
						});
					}
				}
			});
		</script>
		
		<script type="text/ng-template" id="contact-modal.html">
		    <div class="modal-header">
		        <h4 class="modal-title">Nachricht abgeschickt.</h4>
		    </div>
		    <div class="modal-body">
		        <p><i class="fa fa-check"></i> Danke f�r deine Nachricht. Wir k�mmern uns so schnell es geht.</p>
		    </div>
		    <div class="modal-footer">
		        <button type="button" class="btn btn-success" ng-click="$close()">Schlie�en</button>
		    </div>
		</script>
	</head>

	<body ng-controller="ctrl">
		<div class="wrap">
			<div class="container-top-bar" style="margin-bottom: 2px;">
	    		<div class="container">
		    		<div class="row">
			    		<div class="col-sm-10">
				    		<h1><a href="/"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>

			    		<div class="col-sm-2">
				    		<a href="/" class="btn btn-index-top" ng-if="!user">
					        	<i class="fa fa-sign-in fa-fw"></i> Anmelden
							</a>
							
							<a href="/questions" class="btn btn-index-top" ng-if="user">
					        	<i class="fa fa-angle-left fa-fw"></i> Zur�ck
							</a>
			    		</div>
		    		</div>
	    		</div>
	    	</div>
	    	
	    	<div class="container-back-image">
				<div class="container container-text container-text-light container-padding-4">
	    			<i class="fa fa-bullhorn fa-5x"></i>
	    			<h4>Kontakt</h4>
	    			<p>
		    			Bei Angelegenheiten wie z.B. Rechtschreibfehler in Fragen, falschen Antworten, unverst�ndlichen Erkl�rungen, Klausurw�nschen oder Bugs, k�nnt ihr euch nat�rlich hier an uns wenden.
	    			</p>
				</div>
	    	</div>

			<div class="container-padding-2">
				<form class="container form-horizontal">
					<div class="form-group">
						<label class="col-sm-2">Name</label>
						<div class="col-sm-6">
							<input ng-model="username" type="text" class="form-control form-control-out" ng-class="{'has-error': noNameError}">
						</div>
						<span class="label validation-error label-danger" ng-show="noNameError">Kein Name</span>
					</div>

					<div class="form-group">
					   	<label class="col-sm-2">E-Mail-Adresse</label>
					   	<div class="col-sm-6">
					   		<input ng-model="email" type="text" class="form-control form-control-out" ng-class="{'has-error': noMailError}">
					   	</div>
					   	<span class="label validation-error label-danger" ng-show="noMailError">Keine g�ltige E-Mail-Adresse</span>
					</div>

					<div class="form-group" ng-show="question_id">
						<label class="col-sm-2">Frage</label>
						<div class="col-sm-6">
							<span>{{ question.question }}</span>
						</div>
					</div>

					<div class="form-group" ng-show="question_id">
						<label class="col-sm-2">Klausur</label>
						<div class="col-sm-6">
							<span>{{ question.subject }}, {{ question.date }}</span>
						</div>
					</div>

					<div class="form-group" ng-show="question_id">
						<label class="col-sm-2">Anliegen</label>
						<div class="col-sm-6">
							<span>{{ subject }}</span>
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-2">Bemerkungen</label>
						<div class="col-sm-6">
							<textarea ng-model="text" class="form-control form-control-out" rows="3" placeholder="..."></textarea>
						</div>
						<span class="label validation-error label-danger"></span>
					</div>

					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button class="btn btn-accent-color-2" ng-click="sendMail()">Senden</button>
						</div>
					</div>
				</form>
			</div>
		</div>

		<?php require_once('parts/footer.php'); ?>
	</body>
</html>