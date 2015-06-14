'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var modRewrite = require('connect-modrewrite');

var util = require('util');

var middleware = require('./proxy');

module.exports = function(options) {

  function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components'
      };
    }

    var server = {
      baseDir: baseDir,
      middleware: [
        modRewrite([
          '^/$ /index.html [L]',
          '^/login$ /index.html [L]',
          '^/about$ /about.html [L]',
          '^/contact$ /contact.html [L]',
          '^/register$ /register.html [L]',
          '^/forgot-password$ /forgot-password.html [L]',
          '^/activate-account$ /activate-account.html [L]',
          '!/api|/assets|\\.html|\\.js|\\.css|\\.eot|\\.woff|\\.ttf|\\.swf$ /template.html'
        ])
      ],
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      startPath: '/',
      server: server,
      browser: browser,
      notify: false
    });
  }

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));

  gulp.task('serve', ['watch'], function () {
    browserSyncInit([options.tmp + '/serve', options.src]);
  });

  gulp.task('serve:dist', ['build'], function () {
    browserSyncInit(options.dist);
  });

  gulp.task('serve:e2e', ['inject'], function () {
    browserSyncInit([options.tmp + '/serve', options.src], []);
  });

  gulp.task('serve:e2e-dist', ['build'], function () {
    browserSyncInit(options.dist, []);
  });
};
