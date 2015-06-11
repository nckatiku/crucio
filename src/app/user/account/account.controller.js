'use strict';

angular.module('crucio')
  .controller('UserAccountCtrl', function ($scope, $mdToast, API, Auth, Analytics) {
    $scope.saveAccount = function() {
      if ($scope.accountForm.$valid) {
        var params = {
          email: $scope.user.email.replace('@','(@)'),
          course_id: $scope.user.course_id,
          semester: $scope.user.semester
        };
  			API.put('/users/' + $scope.user.user_id + '/account', params).success(function(data) {
          Analytics.trackEvent('user', 'save', 'account');

  				if (!data.error) {
  					Auth.setUser($scope.user);
            $mdToast.show($mdToast.simple().content('Gespeichert!').position('top right').hideDelay(2000));

  				} else {
  					if (data.error === 'error_email_taken') {
              $scope.accountForm.$error.taken = true;
              $scope.accountForm.mail.$error.taken = true;
            }

            if (data.error === 'error_email_not_allowed') {
              $scope.accountForm.$error.notAllowed = true;
              $scope.accountForm.mail.$error.notAllowed = true;
            }
  				}
  			});
      }
    };

    $scope.savePassword = function() {
      if ($scope.passwordForm.$valid) {
  			var params = {
          current_password: $scope.user.old_password,
          password: $scope.user.new_password
        };
  			API.put('/users/' + $scope.user.user_id + '/password', params).success(function(data) {
          Analytics.trackEvent('user', 'save', 'password');

  				if (!data.error) {
            $scope.user.old_password = '';
            $scope.user.new_password = '';
            $scope.user.new_password_c = '';
  					Auth.setUser($scope.user);
            $mdToast.show($mdToast.simple().content('Gespeichert!').position('top right').hideDelay(2000));

  				} else {
  					if (data.error === 'error_wrong_password') {
              $scope.passwordForm.$error.wrong = true;
              $scope.passwordForm.old_password.$error.wrong = true;
            }
  				}
  			});
      }
    };

    $scope.$watch('user.old_password', function() {
      delete $scope.passwordForm.$error.wrong;
      delete $scope.passwordForm.old_password.$error.wrong;
    });
    $scope.$watchGroup(['user.new_password', 'user.new_password_c'], function() {
      if ($scope.user.new_password !== $scope.user.new_password_c) {
        $scope.passwordForm.$error.different = true;
        $scope.passwordForm.new_password_c.$error.different = true;

      } else {
        delete $scope.passwordForm.$error.different;
        delete $scope.passwordForm.new_password_c.$error.different;
      }
      $scope.passwordForm.new_password_c.$validate();
    });

    $scope.$watch('mail', function() {
      delete $scope.accountForm.$error.notAllowed;
      delete $scope.accountForm.old_password.$error.notAllowed;

      delete $scope.accountForm.$error.taken;
      delete $scope.accountForm.old_password.$error.taken;
    });

    $scope.user = Auth.getUser();
    $scope.courses = [{course_id: 0, course_name: 'Humanmedizin'}];
  });
