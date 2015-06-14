'use strict';

angular.module('crucio')
  .controller('LearnSubjectsCtrl', function ($scope, $location, API, Auth, Collection) {

    $scope.recalculateSelectedQuestionCount = function() {
      var defaultQuestionCount = 50;
      if ($scope.selectedQuestionCount === 0) {
        $scope.selectedQuestionCount = Math.min($scope.questionCountInCategories, defaultQuestionCount);
      }
      if ($scope.questionCountInCategories === 0) {
        $scope.selectedQuestionCount = 0;
      }

      var max = $scope.questionCountInCategories;
      var maxQuestionCount = 400;
      if (max > maxQuestionCount) {
        max = maxQuestionCount;
      }
      $scope.maxSliderQuestionCount = max;
    };

    $scope.reloadQuestionCountInCondition = function() {
      var params = {
        condition: $scope.condition,
        selected_categories: $scope.selectedCategories,
        user_id: $scope.user.user_id,
      };
      API.get('/questions/prepare/count', params).success(function(data) {
        $scope.questionCountInCondition = data.question_count;
        $scope.recalculateSelectedQuestionCount();
      });
    };

    $scope.reloadQuestionCountInCategories = function() {
      var params = {
				condition: 'default',
        selected_categories: $scope.selectedCategories,
				user_id: $scope.user.user_id,
			};
			API.get('/questions/prepare/count', params).success(function(data) {
				$scope.questionCountInCategories = data.question_count;
        $scope.recalculateSelectedQuestionCount();
			});
    };

    $scope.getSelectedCategoriesCount = function() {
      return Object.keys($scope.selectedCategories).length;
    };

    $scope.toggleSelectedSubject = function(subject) {
			if (angular.isUndefined($scope.selectedCategories[subject])) {
				$scope.selectedCategories[subject] = [];

      } else {
				delete $scope.selectedCategories[subject];
			}
      $scope.reloadQuestionCountInCategories();
      $scope.reloadQuestionCountInCondition();
    };

    $scope.toggleSelectedCategory = function(subject, category) {
      if (angular.isUndefined($scope.selectedCategories[subject])) {
        $scope.selectedCategories[subject] = [category];
      }

      var index = $scope.selection_subject_list[subject].indexOf(category);
      if (index > -1) {
        $scope.selectedCategories[subject].push(category);

      } else {
        $scope.selectedCategories[subject].splice(index, 1);

				// Is last category is selection subject list
				if ( $scope.selectedCategories[subject].length === 0 ) {
					delete $scope.selectedCategories[subject];
				}
      }
      $scope.reloadQuestionCountInCategories();
      $scope.reloadQuestionCountInCondition();
    };

    $scope.learnSubjects = function(method) {
      var params = {
				condition: $scope.condition,
        selected_categories: angular.toJson($scope.selectedCategories),
        selected_question_count: $scope.selectedQuestionCount,
				user_id: $scope.user.user_id,
        random: 1
			};

      Collection.learnCollection(method, '/categories', params);
    };


    $scope.user = Auth.getUser();
    $scope.method = 'question';
    $scope.condition = 'default';

    $scope.selectedCategories = {};
    $scope.maxSliderQuestionCount = 0;
    $scope.selectedQuestionCount = 0;
    $scope.questionCountInCategories = 0;
    $scope.questionCountInCondition = 0;

    API.get('/subjects/categories').success(function(data) {
			$scope.categories = data.subjects;
		});
  });
