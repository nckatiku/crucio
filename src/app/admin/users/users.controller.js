'use strict';

angular.module('crucio')
  .controller('AdminUsersCtrl', function ($scope, $mdDialog, API, Auth) {
    $scope.reload = function() {
      var data = {
        limit: $scope.limit,
        query: $scope.query,
        semester: $scope.semester,
        group_id: $scope.group_id
      };
      API.get('/users', data).success(function(data) {
        $scope.users = data.users;
      });
    };

    $scope.showUser = function(userID) {
      $mdDialog.show({
        controller: 'UserDialogController',
        templateUrl: 'app/components/user-dialog/user-dialog.html',
        locals: {userID: userID}
      }).finally(function() {
        $scope.reload();
      });
    };

    $scope.user = Auth.getUser();
    $scope.limit = 50;

    $scope.reload();

    API.get('/users/distinct/groups').success(function(data) {
      $scope.groups = data.groups;
    });
    API.get('/users/distinct/semesters').success(function(data) {
      $scope.semesters = data.semesters;
    });
  });
