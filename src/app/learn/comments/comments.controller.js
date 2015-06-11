'use strict';

angular.module('crucio')
  .controller('LearnCommentsCtrl', function ($scope, $mdDialog, API, Auth) {
    $scope.reload = function() {
      var params = {limit: $scope.limit, user_id: $scope.user.user_id};
      API.get('/comments', params).success(function(data) {
        $scope.comments = data.comments;
      });
    };

    $scope.showQuestion = function(questionID) {
      $mdDialog.show({
        controller: 'QuestionDialogController',
        templateUrl: 'app/components/question-dialog/question-dialog.html',
        locals: {questionID: questionID, checkedAnswer: -1}
      }).finally(function() {
        $scope.reload();
      });
    };

    $scope.user = Auth.getUser();
    $scope.limit = 50;

    $scope.reload();
  });
