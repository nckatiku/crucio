'use strict';

angular.module('crucio')
  .controller('LearnSearchCtrl', function ($scope, $mdDialog, $location, $window, API, Auth, Collection, Analytics) {
    $scope.search = function() {
			if ($scope.query.length > 2) {
        var params = {
          query: encodeURIComponent($scope.query),
          limit: $scope.limit,
          visibility: 1,
          user_id: $scope.user.user_id,
          semester: $scope.semester,
          subject_id: $scope.subject_id
        };
				API.get('/questions', params).success(function(data) {
    	    $scope.results = data.result;
				});
        Analytics.trackEvent('search', encodeURIComponent($scope.query));

		  } else {
        $scope.results = [];
      }
		};

    $scope.learnSearch = function(method) {
      var question_id_list = [];
      angular.forEach($scope.results, function(question) {
        this.push(question.question_id);
      }, question_id_list);

      var params = {
        random: 1,
        query: encodeURIComponent($scope.query),
        semester: $scope.semester,
        subject_id: $scope.subject_id,
        question_id_list: question_id_list.join(',')
      };

      Collection.learnCollection(method, '/search', params);
    };

    $scope.showQuestion = function(questionID) {
      $mdDialog.show({
        controller: 'QuestionDialogController',
        templateUrl: 'app/components/question-dialog/question-dialog.html',
        locals: {questionID: questionID, checkedAnswer: -1}
      });
    };

    $scope.user = Auth.getUser();
    $scope.limit = 100;
    $scope.method = 'question';

    API.get('/exams/distinct/subject', {visibility: 1}).success(function(data) {
      $scope.subjects = data.subject;
    });
    API.get('/exams/distinct/semester', {visibility: 1}).success(function(data) {
      $scope.semesters = data.semester;
    });
  });
