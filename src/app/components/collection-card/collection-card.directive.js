'use strict';

angular.module('crucio')
  .directive('crCollectionCard', function() {
    return {
      restrict: 'E',
      scope: { collection: '=', collectionid: '=' },
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
      },
      templateUrl: 'app/components/collection-card/collection-card.html',
      transclude: true
    };
  });
