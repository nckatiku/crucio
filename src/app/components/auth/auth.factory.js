'use strict';

angular.module('crucio')
  .factory('Auth', function($window, Analytics) {
    var user; // Current user object

    return {
      getUser: function() { // Get current user
        // Check if user is in already in user object
        if (angular.isDefined(user)) {
          // Pass...

        // Check if user is in session storage
        } else if (angular.isDefined(sessionStorage.user)) {
          user = angular.fromJson(sessionStorage.user);

        // Check if user is in local storage
        } else if (angular.isDefined(localStorage.user)) {
          sessionStorage.user = localStorage.user;
          user = angular.fromJson(localStorage.user);

        // If there is no user data, return to login page
        } else {
          $window.location.replace('/');
        }

        user.semester = parseInt(user.semester);
        return user;
      },
      logout: function() { // Log current user out
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        Analytics.trackEvent('user', 'logout');
        $window.location.assign($window.location.origin);
      },
      setUser: function(newUser) { // Sets new user
        user.semester = parseInt(user.semester);

        if (angular.isDefined(sessionStorage.user)) {
          sessionStorage.user = angular.toJson(newUser);
        }
        if (angular.isDefined(localStorage.user)) {
          localStorage.user = angular.toJson(newUser);
        }
      }
    };
  });
