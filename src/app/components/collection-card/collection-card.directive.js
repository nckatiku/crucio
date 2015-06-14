'use strict';

angular.module('crucio')
  .directive('crCollectionCard', function() {
    return {
      restrict: 'E',
      scope: { collection: '=', collectionid: '=', exam: '=', index: '=' },
      controller: function($scope, $location, $window, $mdToast, Collection) {
        $scope.getUserDataLength = function(question_id_list, user_datas) {
          if (!user_datas) {
            return 0;
          }

          var result = 0;
          question_id_list.forEach(function (question_id) {
            if (user_datas[question_id]) {
              result += 1;
            }
          });
          return result;
        };

        $scope.learnCollection = function(id, method) {
          if ($scope.exam) {
            if (method === 'original') {
              $window.location.replace('http://www.crucio-leipzig.de/public/files/' + $scope.exam.file_name);
            }

            var params = {random: 1};
            Collection.learnCollection(method, '/exam/' + id, params);


          } else {
            Collection.learnCollection(method, '/collection/' + id, {});
          }
        };

        $scope.deleteCollection = function(index) {
          $scope.$emit('removeCollection', index);
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
          $scope.collectionID = $scope.exam.exam_id;
        }
      },
      templateUrl: 'app/components/collection-card/collection-card.html',
      transclude: true
    };
  });
