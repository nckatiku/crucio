'use strict';

angular.module('crucio')
  .controller('QuestionCtrl', function ($scope, $stateParams, $mdDialog, $window, $location, API, Auth, Collection, Analytics) {

    // Saves the answer when a radio button is clicked
		$scope.saveAnswer = function() {
			$scope.collection.user_datas[$scope.questionId].given_result = $scope.checkedAnswer;
			Collection.setCollection($scope.collection);
	  };

		// Colors the given answers and shows the correct solution
		$scope.markAnswer = function() {
      $scope.markAnswerBool = true;
      $scope.collection.user_datas[$scope.questionId].mark_answer = true;
      Collection.setCollection($scope.collection);
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

    $scope.prevQuestion = function() {
      $location.path('/question').search('id', $scope.prevQuestionID);
    };

    $scope.nextQuestion = function() {
      $location.path('/question').search('id', $scope.nextQuestionID);
    };

    $scope.reportQuestion = function() {
      $mdDialog.show({
        controller: 'ReportDialogController',
        templateUrl: 'app/components/report-dialog/report-dialog.html',
        locals: {questionID: $scope.questionId}
      });
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
    };

    $scope.addComment = function() {
      if (!$scope.commentText) {
        return;
      }

      var params = {
				comment: $scope.commentText,
				question_id: $scope.questionId,
				reply_to: 0,
				username: $scope.user.username,
				date: new Date() / 1000
			};

			API.post('/comments/' + $scope.user.user_id, params).success(function(data) {
        params.voting = 0;
        params.user_voting = 0;
        params.comment_id = data.comment_id;
    		$scope.question.comments.push(params);
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

    // Is called when the question is loaded
    $scope.initQuestion = function() {
      $scope.nextQuestionID = Collection.getNextQuestionID($scope.current_index);
      $scope.prevQuestionID = Collection.getPrevQuestionID($scope.current_index);
      if (!$scope.collection.user_datas[$scope.questionId]) {
        $scope.collection.user_datas[$scope.questionId] = Collection.getNewUserData();
      }

      Collection.loadQuestion($scope.nextQuestionID, $scope.user.user_id);

      $scope.checkedAnswer = $scope.collection.user_datas[$scope.questionId].given_result;
      if ($scope.collection.user_datas[$scope.questionId].mark_answer) {
        $scope.markAnswer();
      }

      if ($scope.collection.is_exam) {
        $scope.question.info = $scope.collection.info;
      }
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


    $scope.user = Auth.getUser();
    $scope.questionId = $stateParams.id;
    $scope.collection = Collection.getCollection();

    // Redirect if no question or no collection is loaded
    if (!$scope.questionId || !$scope.collection) { $window.location.replace('/learn/abstract'); }

    $scope.current_index = Collection.getIndexOfQuestionID($scope.questionId);
    $scope.question = Collection.getQuestion($scope.questionId);

    if ($scope.question) {
      $scope.initQuestion();

    } else {
      Collection.loadQuestion($scope.questionId, $scope.user.user_id).success(function(data) {
        $scope.question = data.question;
        $scope.initQuestion();
      });
    }

    API.get('/questions/' + $scope.questionId, {user_id: $scope.user.user_id}).success(function(data) {
      $scope.question = data.question;
    });
    API.get('/tags/distinct', {user_id: $scope.user.user_id}).success(function(data) {
      $scope.distinct_tags = data.tags;
    });
  });
