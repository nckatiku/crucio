'use strict';

angular.module('crucio')
  .controller('LearnExamsCtrl', function ($scope, $location, $window, API, Auth, Collection) {

    $scope.reload = function() {
      var params = {
        limit: $scope.limit,
        user_id: $scope.user.user_id,
        semester: $scope.semester,
        visbility: 1,
        subject_id: $scope.subject_id
      };
      API.get('/exams', params).success(function(data) {
        $scope.exams = data.exams;
      });
    };

    $scope.learnExam = function(examId, method) {
      if (method === 'original') {
        $window.location.assign('http://www.crucio-leipzig.de/public/files/' + $scope.exam.file_name);
      }

      var params = {random: 1};
      Collection.learnCollection(method, '/exam/' + examId, params);
    };

    $scope.user = Auth.getUser();
    $scope.limit = 200;
    $scope.method = 'question';
    $scope.semester = parseInt($scope.user.semester);

    $scope.reload();

    API.get('/exams/distinct/semester', {visbility: 1}).success(function(data) {
      $scope.semesters = data.semester;
    });

    API.get('/exams/distinct/subject', {visbility: 1}).success(function(data) {
      $scope.subjects = data.subject;
    });
  });
