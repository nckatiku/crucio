'use strict';

angular.module('crucio')
  .controller('AnalyzeCtrl', function ($scope, $location, API, Auth, Collection) {

    $scope.correct_answer = function(id) { return $scope.collection.questions[id].correct_answer; };
		$scope.given_result = function(id) { return $scope.collection.user_datas[id].given_result; };
		$scope.show_correct_answer = function(id) { return $scope.collection.user_datas[id].show_correct_answer; };

    $scope.backToAbstract = function() {
      $location.path('/learn/abstract');
    };


    $scope.user = Auth.getUser();

		$scope.collection = Collection.getCollection();
		$scope.answeredQuestionIDList = Collection.getAnsweredQuestionIDList();
		$scope.analysis = Collection.getAnalysis();
		$scope.analysisDescription = Collection.getAnalysisDescription($scope.analysis);


		// Post results
		var post_data_list = [];
		for (var question in $scope.workedList) {

			// Don't save results again, they were saved during the question page
			if (!question.mark_answer) {

				// Don't save free questions
				if (question.type > 1) {
					if (question.given_result > 0) {
						var correct = (question.correct_answer === question.given_result) ? 1 : 0;
						if (question.correct_answer === 0) { correct = -1; }

						var post_question_data = {
							correct: correct,
							question_id: question.question_id,
							given_answer: question.given_result
						};
						post_data_list.push(post_question_data);
					}
				}
			}
		}

		var postData = {data_list: post_data_list, user_id: $scope.user_id };
    // API.post('/results', postData);
  });
