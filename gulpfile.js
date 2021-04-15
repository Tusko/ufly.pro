/*jslint browser: true, white: true, node: true*/
/*global $, jQuery, gulp, require*/

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed');

//SASS Compile
gulp.task('sasslang', function () {
    'use strict';
    return sass('style', { style: 'expanded' })
        .pipe(gulp.dest('style'))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('style'));
});

gulp.task('minify-css', ['sasslang'], function () {
    'use strict';
    return gulp.src(['style/*.css', '!style/app.css'])
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('style/'));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    'use strict';
    return gulp.src([
        'js/lib/!(init)*.js',
        'js/lib/init.js'
    ])
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('js/'));
});

//compress HTML
gulp.task('htmlpage', function () {
    'use strict';
    var htmlSrc = '*.html';
    gulp.src(htmlSrc)
        .pipe(changed(htmlSrc))
        .pipe(minifyHTML())
        .pipe(gulp.dest(''));
});

gulp.task('default', function () {
    'use strict';

    gulp.start('minify-css', 'scripts', 'htmlpage');

    gulp.watch('style/*.scss', function(){
        gulp.start('minify-css');
    });
    gulp.watch('js/lib/*.js', function(){
        gulp.start('scripts');
    });

});
