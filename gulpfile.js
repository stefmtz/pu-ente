"use strict";

// Gulp packages
var gulp  = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify')
;

// Default task
gulp.task('default', ['scripts', 'sass', 'watch']);

// Watchers
gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['scripts']);
  gulp.watch('source/sass/**/*.scss', ['sass']);
});

// Concatenate & Minify SASS files
gulp.task('sass', function () {
    return gulp.src('source/sass/default.scss')
        .pipe(sass())
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('./public/css/'))
    ;
});

// Concatenate & Minify JS files
gulp.task('scripts', function() {
    var config = {
      insertGlobals : false,
      debug : true
    };

    return gulp.src('source/javascript/main.js')
      .pipe(plumber())
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(browserify(config))
      .pipe(uglify())
      .pipe(gulp.dest('./public/js/'))
    ;
});