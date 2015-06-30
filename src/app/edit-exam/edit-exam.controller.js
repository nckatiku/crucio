'use strict';

angular.module('crucio')
  .controller('EditExamCtrl', function ($scope,	$rootScope, $stateParams, $location, $timeout, $mdToast, $mdDialog, $mdSidenav, API, Auth, Analytics, FileUploader) {
    $scope.showInfo = function() {
      $scope.active = 'exam';
      $scope.q = null;

      document.getElementById('edit-exam').scrollIntoView();
    };

    $scope.showQuestion = function(index) {
      $scope.active = index;
      $scope.q = $scope.exam.questions[index];

      document.getElementById('edit-question').scrollIntoView();
    };


    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    };


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

      if (show) {
        $scope.showQuestion($scope.exam.questions.length - 1);
      }
		};

		$scope.deleteQuestion = function(index) {
			var question_id = $scope.exam.questions[index].question_id;

			if (question_id) {
				API.delete('/questions/' + question_id);
			}
			$scope.exam.questions.splice(index, 1);

			if ($scope.exam.questions.length === 0) {
				$scope.addQuestion(true);
			}
		};

	  $scope.leaveEditExam = function() {
			$location.path( $scope.next_route );
		};

		$scope.saveExam = function() {
      var valid = true;
      if (!$scope.exam.semester) { valid = false; }
      if ($scope.exam.semester <= 0) { valid = false; }
      if ($scope.exam.semester > 20) { valid = false; }
      if (!$scope.exam.subject_id) { valid = false; }
      if ($scope.exam.subject_id === '0') { valid = false; }
      if (!$scope.exam.date) { valid = false; }

      if (valid) {
        $scope.is_saving = 1;

				API.put('/exams/' + $scope.exam_id, $scope.exam).success(function() {
          $mdToast.show($mdToast.simple().content('Gespeichert!').position('top right').hideDelay(2000));
        });

				$scope.exam.questions.forEach(function(question) {
					var validQuestion = true;
					if (!question.question.length) { validQuestion = false; }
					if (question.question_id) { validQuestion = true; }

	    		if (validQuestion) {
            if (!question.question_image_url) {
              question.question_image_url = '';
            }
            if (!question.explanation) {
              question.explanation = '';
            }
            if (!question.correct_answer) {
              question.correct_answer = 0;
            }

	    			var params = {
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
		    			API.post('/questions', params).success(function(data) {
			    			question.question_id = data.question_id;
		    			});

						// Update question
		    		} else {
			    		API.put('/questions/' + question.question_id, params);
		    		}
	    		}
				});

        $scope.has_changed = 0;
				$scope.is_saving = 0;

      } else {
        $mdToast.show($mdToast.simple().content('Nicht gespeichert! Infos fehlen...').position('top right').hideDelay(2000));
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
          $location.url('/author/exams');
        });
      }, function() {

      });
		};

    $scope.getNameOfSubjectID = function(subjectID) {
      for(var key in $scope.subjects) {
        if ($scope.subjects[key].subject_id === subjectID) {
          return $scope.subjects[key].name;
        }
      }
    };

    $scope.getCategoriesOfSubjectID = function(subjectID) {
      for(var key in $scope.subjects) {
        if ($scope.subjects[key].subject_id === subjectID) {
          return $scope.subjects[key].categories;
        }
      }
    };

    // Watch changes in exam, to know if the current state is saved
    $scope.$watch('exam', function(newValue, oldValue) {
			if ($scope.number_changed > 1) {
        $scope.has_changed = 1;
      }
			$scope.number_changed += 1;
		}, true);

		$scope.$on('$stateChangeStart', function(event) {
      if ($scope.has_changed === 1) {
				var confirmClose = confirm('Die Änderungen an deiner Klausur bleiben dann ungespeichert. Wirklich verlassen?');
				if (!confirmClose) {
          event.preventDefault();
        }
			}
		});



    $scope.user = Auth.getUser();
    $scope.exam_id = $stateParams.exam;

    // For alert on exit if there are unsaved changes
    $scope.has_changed = 0;
    $scope.number_changed = 0;
  	$scope.is_saving = 0;

    // Show general exam info on startup
    $scope.active = 'exam';

    // Uploader for exam and question documents/images
    $scope.uploaderPDF = new FileUploader({
      url: 'http://dev.crucio-leipzig.de/api/v1/upload',
      formData: 2,
      autoUpload: true,
      removeAfterUpload: true
    });

    $scope.uploaderImage = new FileUploader({
      url: 'http://dev.crucio-leipzig.de/api/v1/upload',
      formData: 2,
      autoUpload: true,
      removeAfterUpload: true
    });

    $scope.uploaderPDF.onSuccessItem = function(fileItem, response) {
      $scope.exam.file_name = response.filename;
      $mdToast.show($mdToast.simple().content('Dokument hochgeladen!').position('top right').hideDelay(2000));
		};
    $scope.uploaderPDF.onErrorItem = function() {
      $mdToast.show($mdToast.simple().content('Fehler beim Hochladen!').position('top right').hideDelay(2000));
		};

    $scope.uploaderImage.onSuccessItem = function(fileItem, response) {
      $scope.q.question_image_url = response.filename;
      $mdToast.show($mdToast.simple().content('Bild hochgeladen!').position('top right').hideDelay(2000));
		};
    $scope.uploaderImage.onErrorItem = function() {
      $mdToast.show($mdToast.simple().content('Fehler beim Hochladen!').position('top right').hideDelay(2000));
		};


    API.get('/exams/' + $scope.exam_id).success(function(data) {
			$scope.exam = data.exam;
      $scope.exam.semester = parseInt($scope.exam.semester);

      if ($scope.exam.duration === 0) {
        $scope.exam.duration = null;
      }

			for (var i = 0; i < $scope.exam.questions.length; i++) {
				if ($scope.exam.questions[i].topic.length === 0) {
					$scope.exam.questions[i].topic = 'Sonstiges';
				}
			}

			if (!$scope.exam.questions.length) {
				$scope.addQuestion(false, false);
			}

      // Show question, if URL parameter is given
      if ($stateParams.question) {
        var question_index = 0;

        // Search index of specific questionID
        for (var i = 0; i < $scope.exam.questions.length; i++) {
  				if ($scope.exam.questions[i].question_id === $stateParams.question) {
  					question_index = i;
            break;
  				}
  			}

        $scope.showQuestion(question_index);
      }
		});

    API.get('/subjects/categories').success(function(data) {
      $scope.subjects = data.subjects;
    });
  });
