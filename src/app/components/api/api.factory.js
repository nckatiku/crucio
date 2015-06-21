'use strict';

angular.module('crucio')
  .factory('API', function($http, $mdToast) {
  	var apiBase = 'http://dev.crucio-leipzig.de/api/v1';

  	return {
  		get: function(path, data) {
  			return $http.get(apiBase + path, {params: data}).error(function() {
          $mdToast.show($mdToast.simple().content('Hier ist ein Fehler passiert...').position('top right').hideDelay(2000));
        });
  		},
  		post: function(path, data) {
        return $http.post(apiBase + path, data).error(function() {
          $mdToast.show($mdToast.simple().content('Hier ist ein Fehler passiert...').position('top right').hideDelay(2000));
        });
  		},
  		put: function(path, data) {
        return $http.put(apiBase + path, data).error(function() {
          $mdToast.show($mdToast.simple().content('Hier ist ein Fehler passiert...').position('top right').hideDelay(2000));
        });
  		},
  		delete: function(path, data) {
        return $http.delete(apiBase + path, {params: data}).error(function() {
          $mdToast.show($mdToast.simple().content('Hier ist ein Fehler passiert...').position('top right').hideDelay(2000));
        });
  		}
  	};
  });
