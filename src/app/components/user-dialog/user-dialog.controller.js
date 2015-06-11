'use strict';

angular.module('crucio')
  .controller('UserDialogController', function($scope, $mdDialog, userID, API, Analytics) {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.saveGroup = function() {
      API.put('/users/' + userID + '/group', {group_id: $scope.user.group_id}).success(function() {
        $mdDialog.cancel();
      });
      Analytics.trackEvent('users', 'group', 'change');
    };

    $scope.deleteUser = function() {
      var deleteUserDialog = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title($scope.user.username + ' löschen?')
        .content('Er wird uns allen sehr fehlen!')
        .ok('Löschen!')
        .cancel('Abbrechen');

      $mdDialog.show(deleteUserDialog).then(function() {
        API.delete('/users/' + userID).success(function() {
          $mdDialog.cancel();
      	});
        Analytics.trackEvent('users', 'delete');
      }, function() {

      });
    };

    $scope.userID = userID;
    $scope.groups = [{group_id: 1, name: 'Standard'}, {group_id: 3, name: 'Autor'}, {group_id: 2, name: 'Admin'}];

    API.get('/users/' + userID).success(function(data) {
      $scope.user = data.user;
		});
  });
