'use strict';

angular.module('crucio')
  .controller('UserSettingsCtrl', function ($scope, $mdToast, API, Auth) {
    $scope.saveSettings = function() {
      var params = {
    	  'highlightExams': $scope.user.highlightExams,
    	  'showComments': $scope.user.showComments,
    	  'repetitionValue': $scope.user.repetitionValue,
    	  'useAnswers': $scope.user.useAnswers,
    	  'useTags': $scope.user.useTags
      };

	    API.put('/users/' + $scope.user.user_id + '/settings', params).success(function() {
        Auth.setUser($scope.user);
        $mdToast.show($mdToast.simple().content('Gespeichert!').position('top right').hideDelay(2000));
	    });
    };

    $scope.user = Auth.getUser();
  });
