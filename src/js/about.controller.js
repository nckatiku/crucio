'use strict';

angular.module('crucio.about', ['ngMaterial'])
  .controller('ctrl', function($scope) {
    // Check if user is in session storage
    if (angular.isDefined(sessionStorage.user)) {
      $scope.user = angular.fromJson(sessionStorage.user);
    }
  });
