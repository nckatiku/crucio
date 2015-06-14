'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  gulp.task('copy-folder', function() {  
    gulp.src(options.src + '/api/**/*')
      .pipe(gulp.dest(options.dist + '/api'));
  });
  
  gulp.task('watch', ['inject'], function () {

    gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);
    
    gulp.watch([options.src + '/api/**/*'], ['copy-folder']);

    gulp.watch([
      options.src + '/app/**/*.css',
      options.src + '/app/**/*.scss'
    ], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch(options.src + '/**/*.js', function(event) {
      if(isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch(options.src + '/**/*.html', function(event) {
      browserSync.reload(event.path);
    });
  });
};
