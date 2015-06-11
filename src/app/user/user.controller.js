'use strict';

angular.module('crucio')
  .controller('UserCtrl', function ($scope, $state) {
    $scope.getIndexOfCurrentState = function() {
      switch($state.current.url) {
        case '/settings': return 0;
        case '/account': return 1;
      }
    };
  });
