'use strict';

angular.module('crucio')
  .directive('crCommentVote', function() {
    return {
      restrict: 'E',
      scope: { user: '=', comment: '=' },
      controller: function($scope, API) {
        $scope.increase_user_voting = function() {
          $scope.comment.user_voting = $scope.comment.user_voting == 1 ? 1 : $scope.comment.user_voting + 1;
          var params = {user_voting: $scope.comment.user_voting};
          API.post('/comments/' + $scope.comment.comment_id + '/user/' + $scope.user.user_id, params);
        };

        $scope.decrease_user_voting = function() {
          $scope.comment.user_voting = $scope.comment.user_voting == -1 ? -1 : $scope.comment.user_voting - 1;
          var params = {user_voting: $scope.comment.user_voting};
          API.post('/comments/' + $scope.comment.comment_id + '/user/' + $scope.user.user_id, params);
        };


        if ($scope.comment.voting) {
          $scope.comment.voting = parseInt($scope.comment.voting);
        } else {
          $scope.comment.voting = 0;
        }

        if ($scope.comment.user_voting) {
          $scope.comment.user_voting = parseInt($scope.comment.user_voting);
        } else {
          $scope.comment.user_voting = 0;
        }
      },
      templateUrl: 'app/components/comment-vote/comment-vote.html',
      transclude: true
    };
  });
