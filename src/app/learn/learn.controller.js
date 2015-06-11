'use strict';

angular.module('crucio')
  .controller('LearnCtrl', function ($scope, $state) {
    $scope.getIndexOfCurrentState = function() {
      switch($state.current.url) {
        case '/abstract': return 0;
        case '/subjects': return 1;
        case '/exams': return 2;
        case '/search': return 3;
        case '/tags': return 4;
        case '/comments': return 5;
      }
    };
  });
