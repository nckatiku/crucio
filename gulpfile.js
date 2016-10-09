var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  copy = require('gulp-copy'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  streamqueue = require('streamqueue');


var node = 'node_modules/';

gulp.task('sass', function() {
  return streamqueue({ objectMode: true },
      gulp.src([
        node + 'bootstrap/dist/css/bootstrap.min.css',
        node + 'font-awesome/css/font-awesome.min.css',
        node + 'owl.carousel/dist/assets/owl.carousel.min.css',
      ]),
      gulp.src(['src/**/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    )
    .pipe(concat('crucio.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js-vendor', function () {
  gulp.src([
    node + 'jquery/dist/jquery.min.js',
    node + 'smooth-scroll/dist/js/smooth-scroll.min.js',
    node + 'owl.carousel/dist/owl.carousel.min.js',
  ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('fonts', function () {
  gulp.src([
    node + 'font-awesome/fonts/*.*'
  ])
    .pipe(copy('public/fonts', { prefix: 3 }));
});

gulp.task('watch', function() {
	gulp.watch('src/sass/*.scss', ['sass']);
});

gulp.task('default', ['watch']);
