'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

gulp.task('copyVendorImages', function () {
  return gulp
    .src([
      path.join(conf.wiredep.directory, '**/ionrangeslider/img/**/*'),
      path.join(conf.wiredep.directory, '**/leaflet/dist/images/**/*')
    ])
    .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve', '/assets/img/theme/vendor')));
});

