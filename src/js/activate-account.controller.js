'use strict';

angular.module('crucio.activate-account', ['ngMaterial'])
  .controller('ctrl', function($scope, $window, $location, $http, $mdDialog) {
    // Check if user is in local storage
		if (angular.isDefined(localStorage.user)) {
		  $window.location.replace('/learn/abstract');
		}

		// Get and analyze token from URL
		$scope.token = $location.search().token; // .html#?token=...
		if ($scope.token) {
			var params = {token: $scope.token};
			$http.post('http://dev.crucio-leipzig.de/api/v1/users/action/activate', params).success(function(data) {
        if (data.error === 'error_no_token') {
          $scope.error_no_token = true;
        }

        if (data.error === 'error_unknown') {
          $scope.error_unknown = true;
        }
			});

		} else {
			$scope.error_no_token = true;
		}
  });
