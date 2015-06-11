'use strict';

angular.module('crucio')
  .controller('AdminCtrl', function ($scope, $state) {
    $scope.getIndexOfCurrentState = function() {
      switch($state.current.url) {
        case '/users': return 0;
        case '/whitelist': return 1;
        case '/tools': return 2;
        case '/statistic': return 3;
      }
    };
  });
