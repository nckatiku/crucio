'use strict';

angular.module('crucio')
  .controller('AuthorCommentsCtrl', function ($scope, $mdDialog, API) {

    $scope.reload = function() {
      var data = {
        limit: $scope.limit,
        query: $scope.query,
        author_id: $scope.author_id
      };
      API.get('/comments', data).success(function(data) {
        $scope.comments = data.comments;
      });
    };


    $scope.showQuestion = function(questionID) {
      $mdDialog.show({
        controller: 'QuestionDialogController',
        templateUrl: 'app/components/question-dialog/question-dialog.html',
        locals: {questionID: questionID, checkedAnswer: -1}
      });
    };

    $scope.limit = 50;
    $scope.reload();

    API.get('/users', {group_id: 3}).success(function(data) {
      $scope.authors = data.users;
	  });
  });
