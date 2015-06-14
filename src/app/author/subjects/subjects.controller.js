'use strict';

angular.module('crucio')
  .controller('AuthorSubjectsCtrl', function ($scope, API) {
    API.get('/subjects/categories').success(function(data) {
			$scope.subjects = data.subjects;
		});
  });
