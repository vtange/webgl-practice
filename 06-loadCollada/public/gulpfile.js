'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
//var nodemon = require('gulp-nodemon');


gulp.task('default', function () {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	gulp.watch("assets/heightMap.png", ['sync']);
});

gulp.task('sync', function() {
    browserSync.reload();
});