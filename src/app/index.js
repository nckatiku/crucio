'use strict';

angular.module('crucio', ['ngSanitize', 'ui.router', 'ngMaterial', 'ngMessages', 'ngScrollSpy', 'angular-google-analytics'])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $locationProvider, AnalyticsProvider) {
    $stateProvider
      .state('learn', {url: '/learn', templateUrl: 'app/learn/learn.html', controller: 'LearnCtrl'})
      .state('learn.abstract', {url: '/abstract', templateUrl: 'app/learn/abstract/abstract.html', controller: 'LearnAbstractCtrl'})
      .state('learn.subjects', {url: '/subjects', templateUrl: 'app/learn/subjects/subjects.html', controller: 'LearnSubjectsCtrl'})
      .state('learn.exams', {url: '/exams', templateUrl: 'app/learn/exams/exams.html', controller: 'LearnExamsCtrl'})
      .state('learn.search', {url: '/search', templateUrl: 'app/learn/search/search.html', controller: 'LearnSearchCtrl'})
      .state('learn.comments', {url: '/comments', templateUrl: 'app/learn/comments/comments.html', controller: 'LearnCommentsCtrl'})
      .state('learn.tags', {url: '/tags', templateUrl: 'app/learn/tags/tags.html', controller: 'LearnTagsCtrl'})

      .state('user', {url: '/user', templateUrl: 'app/user/user.html', controller: 'UserCtrl'})
      .state('user.settings', {url: '/settings', templateUrl: 'app/user/settings/settings.html', controller: 'UserSettingsCtrl'})
      .state('user.account', {url: '/account', templateUrl: 'app/user/account/account.html', controller: 'UserAccountCtrl'})

      .state('author', {url: '/author', templateUrl: 'app/author/author.html', controller: 'AuthorCtrl'})
      .state('author.exams', {url: '/exams', templateUrl: 'app/author/exams/exams.html', controller: 'AuthorExamsCtrl'})
      .state('author.comments', {url: '/comments', templateUrl: 'app/author/comments/comments.html', controller: 'AuthorCommentsCtrl'})
      .state('author.subjects', {url: '/subjects', templateUrl: 'app/author/subjects/subjects.html', controller: 'AuthorSubjectsCtrl'})
      .state('author.advice', {url: '/advice', templateUrl: 'app/author/advice/advice.html', controller: 'AuthorAdviceCtrl'})

      .state('admin', {url: '/admin', templateUrl: 'app/admin/admin.html', controller: 'AdminCtrl'})
      .state('admin.users', {url: '/users', templateUrl: 'app/admin/users/users.html', controller: 'AdminUsersCtrl'})
      .state('admin.whitelist', {url: '/whitelist', templateUrl: 'app/admin/whitelist/whitelist.html', controller: 'AdminWhitelistCtrl'})
      .state('admin.tools', {url: '/tools', templateUrl: 'app/admin/tools/tools.html', controller: 'AdminToolsCtrl'})
      .state('admin.statistic', {url: '/statistic', templateUrl: 'app/admin/statistic/statistic.html', controller: 'AdminStatisticCtrl'})

      .state('question', {url: '/question?id', templateUrl: 'app/question/question.html', controller: 'QuestionCtrl'})
      .state('exam', {url: '/exam', templateUrl: 'app/exam/exam.html', controller: 'ExamCtrl'})
      .state('analyze', {url: '/analyze', templateUrl: 'app/analyze/analyze.html', controller: 'AnalyzeCtrl'})
      .state('edit-exam', {url: '/edit-exam?id', templateUrl: 'app/edit-exam/edit-exam.html', controller: 'EditExamCtrl'});

    $urlRouterProvider.otherwise('/learn/abstract');

    $locationProvider.html5Mode(true);

    // In production
    // $compileProvider.debugInfoEnabled(false);

    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('indigo');

    AnalyticsProvider.setAccount('UA-47836301-1');
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.trackUrlParams(true);
    AnalyticsProvider.useAnalytics(true);
  })

  .run(function ($location, $window, Auth, Analytics) {
    Array.prototype.unique = function(key) {
      var flags = [], output = [];
      for ( var i = 0; i < this.length; i++) {
          if ( flags[this[i][key]]) { continue; }
          flags[this[i][key]] = true;
          output.push(this[i][key]);
      }
      return output;
    };

    // Check user and user permissions
    var user = Auth.getUser();

    if (!user) {
      $window.location.replace('http://dev.crucio-leipzig.de/login');
    }

    // Routes that need specific authentication
    var route = $location.url();
  	var routesForAuthor = ['/author', '/edit-exam']; // Also for admins...
  	var routesForAdmin = ['/admin'];

  	var routeInArray = function (route, array) {
  		var route_c = route;
  		if (route.indexOf('?') > -1) {
  			route_c = route.substr(0, route.indexOf('?'));
  		}
      var result = false;
      for (var i = 0; i < array.length; i++) {
        if (route_c.indexOf(array[i]) == 0) {
          result = true;
        }
      }
  		return result;
  	};

    // Groups: Admin 2, Standard 1, Autor 3
  	if (routeInArray(route, routesForAuthor) && !(user.group_id==2 || user.group_id==3)) {
  	  $location.path('/learn/abstract');
  	}
  	if (routeInArray(route, routesForAdmin) && user.group_id!=2) {
      $location.path('/learn/abstract');
  	}
  });
