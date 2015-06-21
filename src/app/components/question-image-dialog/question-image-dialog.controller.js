'use strict';

angular.module('crucio')
  .controller('QuestionDialogController', function($scope, $mdDialog, question, Analytics) {
    $scope.question = question;

    Analytics.trackEvent('question', 'image', 'show');
  });
