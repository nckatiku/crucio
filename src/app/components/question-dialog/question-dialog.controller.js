'use strict';

angular.module('crucio')
  .controller('QuestionDialogController', function($scope, $mdDialog, questionID, checkedAnswer, API, Auth, Analytics) {
    // Colors the given answers and shows the correct solution
		$scope.markAnswer = function() {
      $scope.markAnswerBool = true;
		};

    $scope.showSolutionButtonClicked = function() {
      var correct = ($scope.question.correct_answer === $scope.given_result) ? true : false;

    	if ($scope.question.correct_answer === 0) { correct = -1; }
    	if ($scope.question.type === 1) { correct = -1; }

    	var postData = {
	    	data_list: [{
					question_id: $scope.question.questionId,
					correct: correct,
					given_result: $scope.given_result
				}],
	    	user_id: $scope.user.user_id,
	    };
	    API.post('/results', postData);

      $scope.markAnswer();
      Analytics.trackEvent('question', 'solution', 'show');
    };

    $scope.reportQuestion = function() {
      $mdDialog.show({
        controller: 'ReportDialogController',
        templateUrl: 'app/components/report-dialog/report-dialog.html',
        locals: {questionID: questionID, examID: $scope.question.info.exam_id}
      });
    };

    $scope.editExam = function() {
      $mdDialog.cancel();
    };

    $scope.showExplanation = function() {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Erklärung')
          .content($scope.question.explanation)
          .ariaLabel('Erklärung zur Frage')
          .ok('Verstanden!')
      );
      Analytics.trackEvent('question', 'explanation', 'show');
    };

    $scope.addComment = function() {
      if (!$scope.commentText) {
        return;
      }

      var postData = {
				comment: $scope.commentText,
				question_id: questionID,
				reply_to: 0,
				username: $scope.user.username,
				date: new Date() / 1000
			};

			API.post('/comments/' + $scope.user.user_id, postData).success(function(data) {
        postData.voting = 0;
        postData.user_voting = 0;
        postData.comment_id = data.comment_id;
    		$scope.question.comments.push(postData);
    		$scope.commentText = '';
			});
      Analytics.trackEvent('comment', 'add');
    };

    $scope.deleteComment = function(index) {
			var comment_id = $scope.question.comments[index].comment_id;
			API.delete('/comments/' + comment_id);
			$scope.question.comments.splice(index, 1);
      Analytics.trackEvent('comment', 'delete');
		};

    $scope.saveTags = function() {
      var tags_string = '';
      if ($scope.question.tags) {
        tags_string = $scope.question.tags.join(',');
      }
      var params = {tags: tags_string, question_id: $scope.question.question_id, user_id: $scope.user.user_id};
      API.post('/tags', params);
      Analytics.trackEvent('tag', 'change');
    };

    // Temporary fix, should use a function on ng-change!
    $scope.$watch('question.tags', function(val) {
      $scope.saveTags();
    }, true);

    $scope.querySearch = function(query) {
      // var results = query ? self.vegetables.filter(createFilterFor(query)) : [];
      var results = [];
      for (var index in $scope.distinct_tags) {
        var tag = $scope.distinct_tags[index];
        if (tag.substring(0, query.length) === query) {
          results.unshift(tag);
        }
      }
      return results;
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.user = Auth.getUser();
    if (checkedAnswer != -1) {
      $scope.checkedAnswer = checkedAnswer;
      $scope.markAnswerBool = true;
    }
    
    $scope.showComments = $scope.user.show_comments;

    API.get('/questions/' + questionID, {user_id: $scope.user.user_id}).success(function(data) {
      $scope.question = data.question;
		});
    API.get('/tags/distinct', {user_id: $scope.user.user_id}).success(function(data) {
      $scope.distinct_tags = data.tags;
    });
  });
