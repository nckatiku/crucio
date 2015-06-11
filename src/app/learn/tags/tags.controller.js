'use strict';

angular.module('crucio')
  .controller('LearnTagsCtrl', function ($scope, $mdDialog, $location, $window, API, Auth, Collection) {
    $scope.reload = function() {
      var params = {
        user_id: $scope.user.user_id,
        limit: $scope.limit,
        tag: $scope.selectedTag
      };
      API.get('/tags', params).success(function(data) {
  			$scope.questions = data.questions;
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

    $scope.learnTag = function(method) {
      var question_id_list = [];
      angular.forEach($scope.questions, function(question) {
        this.push(question.question_id);
      }, question_id_list);

      var params = {
        random: 1,
        tag: $scope.selectedTag,
        question_id_list: question_id_list.join(',')
      };

      Collection.learnCollection(method, '/tag', params);
    };

    $scope.user = Auth.getUser();
    $scope.limit = 400;
    $scope.method = 'question';

    API.get('/tags/distinct', {user_id: $scope.user.user_id}).success(function(data) {
      $scope.distinct_tags = data.tags;
    });

    $scope.reload();
  });
