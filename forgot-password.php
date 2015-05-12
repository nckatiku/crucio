<!DOCTYPE html>
<html id="ng-app" lang="de" ng-app="crucio.outside">
	<head>
		<?php include 'public/php/header.php'; ?>
		
		<title>Passwort vergessen | Crucio</title>
		
		<script src="public/js/ui-bootstrap-tpls.min.js"></script>
		<script>
			var module = angular.module('crucio.outside', ['ui.bootstrap'], function($locationProvider) { $locationProvider.html5Mode(true); });
			module.controller('ctrl', function($scope, $http, $window, $modal, $location) {
				// Check if user is in local storage
				if (angular.isDefined(localStorage.user)) {
					$window.location.replace('/questions');
				}

				$scope.confirm = $location.search().confirm;
				$scope.deny = $location.search().deny;

				if ($scope.confirm) {
					var post_data = {token: $scope.confirm};
					$http.post('api/v1/users/password/confirm', post_data).success(function(data) {
						$modal.open({ templateUrl: 'forgot-confirm-modal.html' });
					});
				}
				
				if ($scope.deny) {
					var post_data = {token: $scope.deny};
					$http.post('api/v1/users/password/deny', post_data).success(function(data) {
						$modal.open({ templateUrl: 'forgot-deny-modal.html' });
					});
				}
				
				// Reset Password Function
				$scope.reset = function() {
					
					// Init Values
					$scope.no_mail_error = false;
					$scope.already_mail_error = false;
					
					// Form Validation
					var validation = true;
				    if (!$scope.email) {
					    $scope.no_mail_error = true;
					    validation = false;
				    }
				    if (!validation) { return false; }
				    
				    var post_data = {email: $scope.email};
					$http.post('api/v1/users/password/reset', post_data).success(function(data) {
						if (data.status == 'success') {
							$modal.open({ templateUrl: 'forgot-succes-modal.html' });
						
						} else if(data.status == 'error_email') {
							$scope.no_mail_error = true;
						
						} else if(data.status == 'error_already_requested') {
							$scope.already_mail_error = true;
						}
					});
				};
			});		
		</script>
		
		
		<script id="forgot-succes-modal.html" type="text/ng-template">
		    <div class="modal-header">
		        <h4 class="modal-title">Passwort zur�cksetzen</h4>
		    </div>
		    <div class="modal-body">
		        <p><i class="fa fa-check"></i> Wir werden dein Passwort zur�cksetzen. Schau mal in deinen Mail Account.</p>
		    </div>
		    <div class="modal-footer">
		        <button class="btn btn-default" type="button" ng-click="$close()">Zur�ck</button>
		    </div>
		</script>
		
		
		<script id="forgot-confirm-modal.html" type="text/ng-template">
		    <div class="modal-header">
		        <h4 class="modal-title">Neues Passwort</h4>
		    </div>
		    <div class="modal-body">
		        <p ng-show="status == 'success'">
					<i class="fa fa-check"></i> Wir haben dir ein neues Passwort zugeschickt. Schau mal in deinen Mail Account.
				</p>

				<p ng-show="status == 'error_token'">
					<i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist da nicht der richtige Schl�ssel.
				</p>
		    </div>
		    <div class="modal-footer">
		        <button class="btn btn-default" type="button" ng-click="$close()">Zur�ck</button>
		    </div>
		</script>
		
		
		<script id="forgot-deny-modal.html" type="text/ng-template">
		    <div class="modal-header">
		        <h4 class="modal-title">Doch kein neues Passwort...</h4>
		    </div>
		    <div class="modal-body">
		        <p ng-show="status == 'success'">
					<i class="fa fa-check"></i> Du hast die Anfage abgebrochen. Kein Problem.
				</p>

				<p ng-show="status == 'error_token'">
					<i class="fa fa-remove"></i> Da stimmt was nicht, irgendwie ist da nicht der richtige Schl�ssel.
				</p>
		    </div>
		    <div class="modal-footer">
		        <button class="btn btn-default" type="button" ng-click="$close()">Zur�ck</button>
		    </div>
		</script>
	</head>

	<body class="body">
		<div class="wrap">
			<div class="container-top-bar" style="margin-bottom: 2px;">
	    		<div class="container">
		    		<div class="row">
			    		<div class="col-sm-10">
				    		<h1><a href="/" target="_self"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>

			    		<div class="col-sm-2">
				    		<a class="btn btn-index-top" href="/" target="_self">
					        	<i class="fa fa-sign-in fa-fw"></i> Anmelden
							</a>
			    		</div>
		    		</div>
	    		</div>
	    	</div>

	    	<div class="container-back-image container-padding-4">
				<div class="container container-text container-text-light">
	    			<i class="fa fa-question fa-5x"></i>
	    			<h4>Passwort vergessen</h4>
	    		</div>
			</div>

			<div class="container-light-grey container-padding-4">
				<div class="container container-text container-text-dark">
	    			<p>
		    			Du kannst hier deine E-Mail-Adresse eintragen, wir schicken dir dann ein neues Passwort zu.<br>
		    			Bei Fragen kannst du uns gerne schreiben.
	    			</p>
	    		</div>
			</div>
			
			<div class="container-padding-2">
				<div class="container">
					<form class="form-horizontal" ng-controller="ctrl">
						<div class="form-group">
						    <label class="col-sm-3 control-label">E-Mail-Adresse</label>
					        <div class="col-sm-4">
					    		<input class="form-control form-control-out" type="text" ng-model="email" ng-class="{'has-error': no_mail_error ||�already_mail_error}"/>
					        </div>
					        <span class="label validation-error label-danger" ng-show="no_mail_error">Keine g�ltige E-Mail-Adresse</span>
					        <span class="label validation-error label-danger" ng-show="already_mail_error">
					        	F�r die E-Mail-Adresse wurde bereits das Passwort zur�ckgesetzt.
					        </span>
					    </div>
				
						<div class="form-group">
						    <div class="col-sm-3 col-sm-offset-3">
						    	<button class="btn btn-accent-color-2" ng-click="reset()">
						    		Zur�cksetzen
						    	</button>
						    </div>
						</div>
		    		</form>
				</div>
			</div>
		</div>

		<?php include 'public/php/footer.php'; ?>
	</body>
</html>