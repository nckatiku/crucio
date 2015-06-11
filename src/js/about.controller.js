'use strict';

angular.module('crucio.about', ['ngMaterial', 'angular-google-analytics'])
  .config(function ($mdThemingProvider, AnalyticsProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('indigo');

    AnalyticsProvider.setAccount('UA-47836301-1');
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.useAnalytics(true);
  })

  .run(function (Analytics) { })

  .controller('ctrl', function($scope) {
    // Check if user is in session storage
    if (angular.isDefined(sessionStorage.user)) {
      $scope.user = angular.fromJson(sessionStorage.user);
    }
  });
