'use strict';

angular.module('crucio')
  .directive('crCollectionInfo', function() {
    return {
      restrict: 'E',
      scope: { questionInfo: '=', group: '=', index: '=', length: '=', isCollection: '=' },
      controller: function($scope, $location, $mdToast, Collection) {
        $scope.saveCollection = function() {
          $scope.collection = Collection.getCollection();
          Collection.saveCollection();
        };

        $scope.handIn = function() {
          $location.path('/analyze');
        };

        if ($scope.isCollection) {
          $scope.collection = Collection.getCollection();
        }
      },
      templateUrl: 'app/components/collection-info/collection-info.html',
      transclude: true
    };
  });
