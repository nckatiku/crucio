'use strict';

angular.module('crucio.login', ['ngMaterial', 'ngMessages', 'angular-google-analytics'])
  .config(function ($mdThemingProvider, AnalyticsProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('indigo');

    AnalyticsProvider.setAccount('UA-47836301-1');
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.useAnalytics(true);
  })

  .run(function (Analytics) { })

  .controller('login.ctrl', function($scope, $http, $window) {
    $scope.login = function() {
      $scope.loginForm.mail.$setDirty();
      $scope.loginForm.password.$setDirty();

      if ($scope.mail.indexOf('@') < 0) {
        $scope.mail += '@studserv.uni-leipzig.de';
      }

      if ($scope.loginForm.$valid) {
        var params = {email: $scope.mail, password: $scope.password};
        $http.post('http://dev.crucio-leipzig.de/api/v1/users/action/login', params).success(function(data) {
          if (!data.error) {
            sessionStorage.fresh_login = true;
            sessionStorage.user = angular.toJson(data.logged_in_user);
            if ($scope.remember_me == true) {
              localStorage.user = angular.toJson(data.logged_in_user);

            }
            $window.location.assign('/learn/abstract');

          // Error handling
          } else {
            if (data.error === 'error_wrong_mail_password') {
              $scope.loginForm.$error.wrong = true;
              $scope.loginForm.password.$error.wrong = true;
            }

            if (data.error === 'error_account_not_active') {
              $scope.loginForm.$error.notActive = true;
              $scope.loginForm.mail.$error.notActive = true;
            }
          }
        });
      }
    };

    $scope.showForgotPassword = function() {
      if (!$scope.loginForm.password.$dirty) {
        return true;
      } else if ($scope.loginForm.password.$error.required) {
        return false;
      } else if ($scope.loginForm.password.$error.wrong) {
        return false;
      }
      return true;
    };

    $scope.$watch('mail', function() {
      delete $scope.loginForm.$error.notActive;
      delete $scope.loginForm.mail.$error.notActive;

      delete $scope.loginForm.$error.wrong;
      delete $scope.loginForm.password.$error.wrong;
    });
    $scope.$watch('password', function() {
      delete $scope.loginForm.$error.wrong;
      delete $scope.loginForm.password.$error.wrong;
    });

    // Check if user is in session storage
    if (angular.isDefined(localStorage.user)) {
      $window.location.replace('/learn/abstract');

     // Check if user is in local storage (persistant)
    } else if (angular.isDefined(sessionStorage.user)) {
      localStorage.user = sessionStorage.user;
      $window.location.replace('/learn/abstract');
    }

    // Init Values
    $scope.remember_me = true;
  });
