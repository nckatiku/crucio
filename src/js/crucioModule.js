angular.module('crucioModule', [])

	.controller('titleCtrl', function($scope, Page) {
		$scope.title = function() { return Page.title(); }
	})
	
	.controller('navCtrl', function($scope, Auth, Page) {
		$scope.nav = function() { return Page.nav(); }
		$scope.user = Auth.user();
		$scope.logout = function() { Auth.logout(); }
	})

	.controller('errorCtrl', function($scope, Page) {
		Page.setTitleNav('Fehler | Crucio', '');
	})