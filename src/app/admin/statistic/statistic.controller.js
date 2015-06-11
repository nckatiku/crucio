'use strict';

angular.module('crucio')
  .controller('AdminStatisticCtrl', function ($scope, API) {
    API.get('/statistic').success(function(data) {
    	$scope.statistic = data.statistic;
    });
  });
