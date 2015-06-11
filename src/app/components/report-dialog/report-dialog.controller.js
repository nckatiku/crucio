'use strict';

angular.module('crucio')
  .controller('ReportDialogController', function($scope, $mdDialog, questionID, examID, Auth, API, Analytics) {
    $scope.send = function() {
      if ($scope.reportForm.$valid) {
        var params = {
          name: $scope.user.username,
          mail: $scope.user.email.replace('@','(@)'),
          text: $scope.comment,
          question_id: questionID,
          exam_id: $scope.exam.exam_id,
          subject: $scope.exam.subject,
          author: $scope.exam.username,
          author_mail: $scope.exam.email,
          mail_subject: $scope.concern
        };

        API.post('/contact/send-mail-question', params).success(function() {
          $mdDialog.hide();
        });
        Analytics.trackEvent('question', 'report');
      }
    };

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.user = Auth.getUser();
    $scope.concerns = ['Allgemein', 'Rechtschreibfehler', 'Falsche Antwort', 'Erklärung schreiben'];
    $scope.questionID = questionID;
    $scope.examID = examID;

    API.get('/exams/' + examID).success(function(data) {
      $scope.exam = data.exam;
    });
  });
