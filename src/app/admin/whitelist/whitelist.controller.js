'use strict';

angular.module('crucio')
  .controller('AdminWhitelistCtrl', function ($scope, API, Analytics) {

    $scope.addMail = function() {
			if ($scope.mail.length) {
				$scope.whitelist.push({username: '', mail_address: $scope.mail});
				var postData = {mail_address: $scope.mail.replace('@','(@)')};
				API.post('/whitelist', postData);
        Analytics.trackEvent('whitelist', 'add');
        $scope.mail = null;
			}
		};

		$scope.deleteMail = function(index) {
			var mail = $scope.whitelist[index].mail_address;
			if (mail.length) {
				$scope.whitelist.splice(index, 1);
				API.delete('/whitelist/' + mail);
        Analytics.trackEvent('whitelist', 'delete');
			}
		};

    API.get('/whitelist').success(function(data) {
      $scope.whitelist = data.whitelist;
    });
  });
