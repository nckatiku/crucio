'use strict';

angular.module('crucio')
  .directive('crCollectionCard', function() {
    return {
      restrict: 'E',
      scope: { collection: '=', collectionid: '=', exam: '=' },
      controller: function($scope, $location, $mdToast, Collection) {
        $scope.getUserDataLength = function(question_id_list, user_datas) {
          var result = 0;
          question_id_list.forEach(function (question_id) {
            if (user_datas[question_id]) {
              result += 1;
            }
          });
          return result;
        };

        $scope.learnCollection = function(collectionID, method) {
          var params = {};
          Collection.learnCollection(method, '/collection/' + collectionID, params);
        };

        $scope.collectionID = $scope.collectionid;
        $scope.method = 'question';

        if ($scope.exam) {
          $scope.collection = {};
          $scope.collection.info = $scope.exam;
          $scope.collection.info.type = 'exam';
          $scope.collection.question_id_list = [];
          for (var i = 0; i < $scope.exam.question_count; i++) {
            $scope.collection.question_id_list.push(0);
          }
        }
      },
      templateUrl: 'app/components/collection-card/collection-card.html',
      transclude: true
    };
  });
