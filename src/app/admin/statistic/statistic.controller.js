'use strict';

angular.module('crucio')
  .controller('AdminStatisticCtrl', function ($scope, $interval, API) {
    $scope.reload = function() {
      API.get('/statistic').success(function(data) {
      	$scope.statistic = data.statistic;
      });
    };

    $scope.checkAutoReload = function() {
      if ($scope.autoReload) {
        $scope.reload();
      }
    };

    $scope.reload();
    $interval($scope.checkAutoReload, 2000);
  });
