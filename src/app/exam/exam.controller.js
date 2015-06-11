'use strict';

angular.module('crucio')
  .controller('ExamCtrl', function ($scope, $rootScope, $mdDialog, $window, $location, API, Auth, Collection) {
    // Answer gets checked
		$scope.saveAnswer = function(id, checkedAnswer) {
      if ($scope.collection.user_datas[id]) {
        $scope.collection.user_datas[id].given_result = checkedAnswer;

      } else {
        $scope.collection.user_datas[id] = {given_result: checkedAnswer};
      }
			Collection.setCollection($scope.collection);
		};

		$scope.openImage = function(file_name) {
			/* var modalInstance = $modal.open({
		    templateUrl: 'imageModalContent.html',
		    controller: function ($scope, image_url) {
					$scope.image_url = image_url;
				},
				resolve: {
					image_url: function() { return file_name; }
				}
			}); */
		};

    $rootScope.$on('spied', function(event, arg) {
      if (arg.spies === undefined) {
        $scope.current_index = 0;
      } else {
        $scope.current_index = parseInt(arg.spies);
      }

      $scope.current_question_id = $scope.collection.question_id_list[$scope.current_index];
    });

    $scope.user = Auth.getUser();
    $scope.collection = Collection.getCollection();
    $scope.current_index = 0;
    $scope.current_question_id = $scope.collection.question_id_list[$scope.current_index];
  });
