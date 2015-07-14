'use strict';

angular.module('crucio')
  .controller('LearnAbstractCtrl', function ($scope, $location, $window, API, Auth) {
    var udpateFreshLogin = function() {
      if (!$scope.ready) {
        $scope.readyCount += 1;
        if ($scope.readyCount === 2) {
          $scope.ready = true;
        }
      }
    };

    $scope.$on('removeCollection', function(event, index) {
      var collectionID = $scope.collections[index].collection_id;
      API.delete('/collections/' + collectionID);
      $scope.collections.splice(index, 1);
    });



    $scope.user = Auth.getUser();
    $scope.ready = true;

    if (sessionStorage.fresh_login) {
      $scope.ready = false;
      $scope.readyCount = 0;
      sessionStorage.removeItem('fresh_login');

      var body = document.getElementsByTagName('body')[0];
      body.className = body.className + ' body-animated';
    }


    API.get('/exams/recommended', {user_id: $scope.user.user_id, limit: 6}).success(function(data) {
      $scope.recommendedExams = data.exams;
      udpateFreshLogin();
    });

    API.get('/collections', {user_id: $scope.user.user_id, limit: 18}).success(function(data) {
	  $scope.collections = data.collections;
      udpateFreshLogin();
	});
  });
