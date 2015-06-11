'use strict';

angular.module('crucio.contact', ['ngMaterial', 'ngMessages', 'angular-google-analytics'])
  .config(function ($mdThemingProvider, AnalyticsProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('indigo');

    AnalyticsProvider.setAccount('UA-47836301-1');
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.useAnalytics(true);
  })

  .run(function (Analytics) { })

  .controller('ctrl', function($scope, $http, $mdDialog) {
    $scope.send = function() {
      if ($scope.contactForm.$valid) {
        var params = {
          name: $scope.username,
          mail: $scope.mail.replace('@','(@)'),
          text: $scope.text
        };

        $http.post('http://dev.crucio-leipzig.de/api/v1/contact/send-mail', params).success(function() {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Nachricht auf dem Weg...')
              .content('Danke für deine Nachricht. Wir kümmern uns so schnell es geht.')
              .ariaLabel('Alert Dialog Demo')
              .ok('Zurück')
          );
        });
      }
    };

    // Check if user is in local storage
    if (angular.isDefined(localStorage.user)) {
      $scope.user = angular.fromJson(localStorage.user);

      $scope.username = $scope.user.username;
      $scope.mail = $scope.user.email;
    }
  });
