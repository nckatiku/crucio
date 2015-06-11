'use strict';

angular.module('crucio')
  .controller('AdminToolsCtrl', function ($scope, $mdToast, API) {
    $scope.changeSemester = function(number) {
      var postData = {number: number};
  		API.post('/admin/change-semester', postData).success(function() {
        $mdToast.show($mdToast.simple().content('Semester geändert!').position('top right').hideDelay(2000));
  		});
    };

    $scope.deleteTestAccount = function() {
      API.delete('/users/test-account').success(function() {
        $mdToast.show($mdToast.simple().content('Test Account gelöscht!').position('top right').hideDelay(2000));
			});
    };
  });
