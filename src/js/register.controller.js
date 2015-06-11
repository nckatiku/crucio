'use strict';

angular.module('crucio.register', ['ngMaterial', 'ngMessages', 'angular-google-analytics'])
  .config(function ($mdThemingProvider, AnalyticsProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('indigo');

    AnalyticsProvider.setAccount('UA-47836301-1');
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.useAnalytics(true);
  })

  .run(function (Analytics) { })

  .controller('ctrl', function($scope, $http, $mdDialog) {
		// Register Function
		$scope.register = function() {
      if ($scope.registerForm.$valid) {
        var params = {
          username: $scope.username,
          email: $scope.mail.replace('@','(@)'),
          password: $scope.password,
          semester: $scope.semester,
          course_id: $scope.course_id
        };
        $http.post('http://dev.crucio-leipzig.de/api/v1/users', params).success(function(data) {
          if (!data.error) {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Registrierung')
                .content('Du hast dich erfolgreich registriert. Schau mal in deinen Mail Account.')
                .ok('Zurück')
            );

          } else {
            if (data.error === 'error_email_taken') {
              $scope.registerForm.$error.taken = true;
              $scope.registerForm.mail.$error.taken = true;
            }

            if (data.error === 'error_username_taken') {
              $scope.registerForm.$error.taken = true;
              $scope.registerForm.username.$error.taken = true;
            }

            if (data.error === 'error_email_not_allowed') {
              $scope.registerForm.$error.notAllowed = true;
              $scope.registerForm.mail.$error.notAllowed = true;
            }
          }
        });
      }
    };

    $scope.$watch('username', function() {
      delete $scope.registerForm.$error.taken;
      delete $scope.registerForm.username.$error.taken;
    });

    $scope.$watch('mail', function() {
      delete $scope.registerForm.$error.taken;
      delete $scope.registerForm.mail.$error.taken;

      delete $scope.registerForm.$error.notAllowed;
      delete $scope.registerForm.mail.$error.notAllowed;
    });

    $scope.$watchGroup(['password', 'passwordc'], function() {
      if ($scope.password !== $scope.passwordc) {
        $scope.registerForm.$error.different = true;
        $scope.registerForm.passwordc.$error.different = true;

      } else {
        delete $scope.registerForm.$error.different;
        delete $scope.registerForm.passwordc.$error.different;
      }
      $scope.registerForm.passwordc.$validate();
    });

    $scope.course_id = 0;
    $scope.courses = [{course_id: 0, course_name: 'Humanmedizin'}];
  });
