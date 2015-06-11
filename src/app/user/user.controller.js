'use strict';

angular.module('crucio')
  .controller('UserCtrl', function ($scope, $state) {
    $scope.getIndexOfCurrentState = function() {
      switch($state.current.url) {
        case '/account': return 0;
        case '/settings': return 1;
      }
    };
  });
