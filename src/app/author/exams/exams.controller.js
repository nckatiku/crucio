'use strict';

angular.module('crucio')
  .controller('AuthorExamsCtrl', function ($scope, $location, API, Auth) {

    $scope.reload = function() {
      var data = {
        limit: $scope.limit,
        semester: $scope.semester,
        subject_id: $scope.subject_id,
        author_id: $scope.author_id
      };
      API.get('/exams', data).success(function(data) {
        $scope.exams = data.exams;
      });
    };

    $scope.editExam = function(examId) {
      $location.path('/edit-exam').search('id', examId);
    };

    $scope.newExam = function() {
      var post_data = {
				subject: '',
				professor: '',
				semester: '',
				date: '',
				type: '',
				user_id_added: $scope.user.user_id,
				duration: '',
				notes: ''
			};

			API.post('/exams', post_data, function(data) {
		  	$location.path('/edit-exam').search('id', data.exam_id);
		  });
    };


    $scope.user = Auth.getUser();
    $scope.author_id = $scope.user.user_id;
    $scope.limit = 200;

    $scope.reload();

    API.get('/users', {group_id: 3}).success(function(data) {
      $scope.authors = data.users;
	  });
    API.get('/exams/distinct/semester').success(function(data) {
      $scope.semesters = data.semester;
    });

    API.get('/exams/distinct/subject').success(function(data) {
      $scope.subjects = data.subject;
    });
  });
