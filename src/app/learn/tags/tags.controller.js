'use strict';

angular.module('crucio')
  .controller('LearnTagsCtrl', function ($scope, $mdDialog, $location, $window, API, Auth, Collection, Analytics) {
    $scope.reloadDistinctTags = function() {
      API.get('/tags/distinct', {user_id: $scope.user.user_id}).success(function(data) {
        $scope.distinct_tags = data.tags;
      });
    };

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

    $scope.deleteTag = function() {
      var deleteUserDialog = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title($scope.selectedTag + ' entfernen?')
        .content('Die Markierung wird von allen Fragen entfernt.')
        .ok('Entfernen!')
        .cancel('Abbrechen');

      $mdDialog.show(deleteUserDialog).then(function() {
        var params = {tag: $scope.selectedTag, user_id: $scope.user.user_id};
        API.delete('/tags', params).success(function() {
          $mdDialog.cancel();
          $scope.selectedTag = '';
          $scope.reloadDistinctTags();
          $scope.reload();
      	});
        Analytics.trackEvent('tag', 'delete');
      }, function() {

      });
    };

    $scope.user = Auth.getUser();
    $scope.limit = 400;
    $scope.method = 'question';


    $scope.reloadDistinctTags();
    $scope.reload();
  });
