<!DOCTYPE html>
<html id="ng-app" lang="de" ng-app="crucio.outside">
	<head>
		<?php include 'parts/header.php'; ?>
		
		<title>Account Aktivierung | Crucio</title>
		
		<script src="public/js/ui-bootstrap-tpls.min.js"></script>
		<script>
			var angularModule = angular.module('crucio.outside', []);
			angularModule.controller('ctrl', function($scope, $http, $window, $location) {
				// Check if user is in local storage
				if (angular.isDefined(localStorage.user)) {
					$window.location.replace('/questions');
				}
				
				// Errors
				$scope.noTokenError = false;
				$scope.unknownError = false;
				
				// Get and analyze token from URL
				var route_params = $location.search();
				var token = $location.search().token;
				if (token) {
					var postData = {token: token};
					$http.post('api/v1/users/action/activate', postData).success(function(data) {
						if (data.status == 'error_unknown') {
							$scope.unknownError = true;
						
						} else if (data.status == 'error_no_token') {
							$scope.noTokenError = true;
						
						}
					});
					
				} else {
					$scope.noTokenError = true;
				}
			});
		</script>
	</head>

	<body class="body" ng-controller="ctrl">
		<div class="wrap">
			<div class="container-top-bar" style="margin-bottom: 2px;">
	    		<div class="container">
		    		<div class="row">
			    		<div class="col-sm-10 col-xs-8">
				    		<h1><a href="/"><i class="fa fa-check-square-o"></i> Crucio</a></h1>
			    		</div>

			    		<div class="col-sm-2 col-xs-4">
				    		<a class="btn btn-index-top" href="/">
					        	<i class="fa fa-sign-in fa-fw"></i> Anmelden
							</a>
			    		</div>
		    		</div>
	    		</div>
	    	</div>

	    	<div class="container-back-image container-padding-4">
				<div class="container container-text container-text-light">
	    			<i class="fa fa-user fa-5x"></i>
	    			<h4>Account Aktivieren</h4>
	    		</div>
			</div>

			<div class="container-padding-4">
				<div class="container">
			    <div class="row">
			    	<div class="col-sm-10 col-sm-offset-1">
			    		<center ng-if="noTokenError">
						    <div class="alert alert-danger">
						    	Der Schlüssel konnte deinen Account nicht aktivieren. Wir haben einfach keinen Schlüssel gefunden.
						    </div>
						</center>
						
						<center ng-if="unknownError">
						    <div class="alert alert-danger">
						    	Der Schlüssel konnte deinen Account nicht aktivieren. <br> Entweder passt der Schlüssel nicht oder dein Account ist bereits aktiviert.
						    </div>
						</center>

						<center ng-if="!unknownError && !noTokenError">
						    <div class="alert alert-success">
						    	Dein Account ist aktiviert und deine E-Mail-Adresse bestätigt. Willkommen bei Crucio!
						    </div>

						    <a class="btn btn-success" href="/">Zur Anmeldung</a>
						</center>
			    	</div>
			    </div>
				</div>
			</div>
		</div>

	    <?php include 'parts/footer.php'; ?>
	</body>
</html>