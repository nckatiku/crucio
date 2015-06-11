'use strict';

angular.module('crucio')
  .controller('ReportDialogController', function($scope, $mdDialog, questionID, Analytics) {
    $scope.concerns = ['Allgemein', 'Rechtschreibfehler', 'Falsche Antwort', 'Erklärung schreiben'];
    $scope.questionID = questionID;

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.report = function(answer) {
      $mdDialog.hide(answer);
      Analytics.trackEvent('question', 'report');
    };
  });
