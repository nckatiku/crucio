'use strict';

angular.module('crucio')
  .controller('AuthorCtrl', function ($scope, $state) {
    $scope.getIndexOfCurrentState = function() {
      switch($state.current.url) {
        case '/exams': return 0;
        case '/comments': return 1;
        case '/subjects': return 2;
        case '/advice': return 3;
      }
    };
  });
