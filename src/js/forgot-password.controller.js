'use strict';

angular.module('crucio.forgot-password', ['ngMaterial', 'ngMessages'])
  .controller('ctrl', function($scope, $http, $mdDialog, $location) {


		// Reset Password Function
		$scope.reset = function() {
      if ($scope.forgotPasswordForm.$valid) {
  			$http.post('http://dev.crucio-leipzig.de/api/v1/users/password/reset', {email: $scope.mail}).success(function(data) {
  				if (!data.error) {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Passwort zurücksetzen')
                .content('Schau mal in deinen Mail Account.')
                .ok('Zurück')
            );

  				} else {
            if (data.error === 'error_no_mail') {
              $scope.forgotPasswordForm.$error.noMail = true;
              $scope.forgotPasswordForm.mail.$error.noMail = true;
            }

            if (data.error === 'error_already_requested') {
              $scope.forgotPasswordForm.$error.alreadyRequested = true;
              $scope.forgotPasswordForm.mail.$error.alreadyRequested = true;
            }
          }
			  });
      }
		};


    // Check if user is in local storage
		$scope.confirm = $location.search().confirm;
		$scope.deny = $location.search().deny;

		if ($scope.confirm) {
			$http.post('http://dev.crucio-leipzig.de/api/v1/users/password/confirm', {token: $scope.confirm}).success(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Passwort zurücksetzen Teil II')
            .content('Wir haben dir ein neues Passwort zugeschickt.')
            .ok('Zurück')
        );
			});
		}

		if ($scope.deny) {
			$http.post('http://dev.crucio-leipzig.de/api/v1/users/password/deny', {token: $scope.deny}).success(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Passwort zurücksetzen')
            .content('Du hast das Zurücksetzen abgebrochen.')
            .ok('Zurück')
        );
			});
		}


    $scope.$watch('mail', function() {
      delete $scope.forgotPasswordForm.$error.noMail;
      delete $scope.forgotPasswordForm.mail.$error.noMail;

      delete $scope.forgotPasswordForm.$error.alreadyRequested;
      delete $scope.forgotPasswordForm.mail.$error.alreadyRequested;
    });
  });
