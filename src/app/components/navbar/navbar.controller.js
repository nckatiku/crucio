'use strict';

angular.module('crucio')
  .controller('NavbarCtrl', function ($scope, $window, Auth) {
    $scope.user = Auth.getUser();

    $scope.logout = function() {
      Auth.logout();
      $window.location.replace('/login');
    };
  });
