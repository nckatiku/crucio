'use strict';

angular.module('crucio')
  .controller('EditExamCtrl', function ($scope, $stateParams, $location, $mdDialog, $mdSidenav, API, Auth) {
    $scope.showInfo = function() {
      $scope.active = 'tab';
    }

    $scope.showQuestion = function(index) {
      $scope.active = index;
    }


    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    }


    $scope.addQuestion = function(show) {
			var question = {
				question: '',
				type: 5,
				correct_answer: 0,
				topic: 'Sonstiges',
				answers: ['', '', '', '', '', '']
			};

			$scope.exam.questions.push(question);
			$scope.open_question_id = 0;
		};

		$scope.deleteQuestion = function(index) {
			var question_id = $scope.exam.questions[index].question_id;

			if (question_id) {
				API.delete('/questions/' + question_id);
			}
			$scope.exam.questions.splice(index, 1);

			if ($scope.exam.questions.length === 0) {
				$scope.add_question(true);
			}
		};

	  $scope.leaveEditExam = function() {
			$location.path( $scope.next_route );
		};

		$scope.saveExam = function() {
      if ($scope.examInfoForm.$valid) {
        $scope.is_saving = 1;

				var params = $scope.exam;
				API.put('/exams/' + $scope.exam_id, params);

				$scope.exam.questions.forEach(function(question) {
					var validate_question = true;
					if (!question.question.length) { validate_question = false; }
					if (question.question_id) { validate_question = true; }

	    		if (validate_question) {
	    			var question_params = {
		    			question: question.question,
		    			topic: question.topic,
		    			type: question.type,
		    			answers: question.answers,
							correct_answer: question.correct_answer,
							exam_id: $scope.exam.exam_id,
							user_id_added: $scope.user.user_id,
							explanation: question.explanation,
							question_image_url: question.question_image_url
						};

	    			// Save new question
	    			if (!question.question_id) {
		    			API.post('/questions', question_params).success(function(data) {
			    			question.question_id = data.question_id;
		    			});

						// Update question
		    		} else {
			    		API.put('/questions/' + question.question_id, question_params);
		    		}
	    		}
				});
				$scope.has_changed = 0;
				$scope.is_saving = 0;
      }
		};

		$scope.openDeleteExamDialog = function() {
      var deleteExamDialog = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Klausur löschen?')
        .content('Die Fragen gehen dann auch verloren...')
        .ok('Löschen!')
        .cancel('Abbrechen');

      $mdDialog.show(deleteExamDialog).then(function() {
        API.delete('/exams/' + $scope.exam.exam_id).success(function() {
          $location.url('/author');
        });
      }, function() {

      });
		};



    $scope.user = Auth.getUser();
    $scope.exam_id = $stateParams.id;

    $scope.has_changed = 0;
    $scope.number_changed = 0;
  	$scope.is_saving = 0;

    $scope.active = 'tab';


    API.get('/exams/' + $scope.exam_id).success(function(data) {
			$scope.exam = data;
      $scope.exam.semester = parseInt($scope.exam.semester);

			for (var i = 0; i < $scope.exam.questions.length; i++) {
				if ($scope.exam.questions[i].topic.length === 0) {
					$scope.exam.questions[i].topic = 'Sonstiges';
				}
			}

			if ($scope.exam.questions.length === 0) {
				$scope.add_question(false, false);
			}
		});

    API.get('/exams/distinct/subject', {visbility: 1}).success(function(data) {
      $scope.subjects = data.subject;
    });
  });
