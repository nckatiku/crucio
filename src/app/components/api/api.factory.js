'use strict';

angular.module('crucio')
  .factory('API', function($http) {
  	var apiBase = 'http://dev.crucio-leipzig.de/api/v1';

  	return {
  		get: function(path, data) {
  			return $http.get(apiBase + path, {params: data});
  		},
  		post: function(path, data) {
        return $http.post(apiBase + path, data);
  		},
  		put: function(path, data) {
        return $http.put(apiBase + path, data);
  		},
  		delete: function(path) {
        return $http.delete(apiBase + path, {});
  		}
  	};
  });
