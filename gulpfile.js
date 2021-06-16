'use strict'

const gulp = require('gulp')
const browserify = require('browserify')
const vueify = require('vueify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')

gulp.task('compile', async () => {
  await new Promise((resolve, reject) => {
    browserify('src/index.js')
      .transform(babelify, { presets: ["@babel/preset-env"] })
      .transform(vueify)
      .bundle()
      .pipe(source('components.js'))
      // .pipe(buffer())
      // .pipe(uglify())
      .pipe(gulp.dest('dist'))
      .on('end', resolve)
  })
})

gulp.task('bundle', async () => {
  await new Promise((resolve, reject) => {
    gulp.src([
      './node_modules/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      './node_modules/blueimp-file-upload/js/jquery.iframe-transport.js',
      './node_modules/blueimp-file-upload/js/jquery.fileupload.js',
      './dist/components.js',
    ])
      .pipe(concat('elements.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
      .on('end', resolve)
  })
})

gulp.task('css', async () => {
  await new Promise((resolve, reject) => {
    gulp.src([
      './node_modules/bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
      './src/css/common.css',
    ])
      .pipe(concat('elements.min.css'))
      // .pipe(uglify())
      .pipe(gulp.dest('dist'))
      .on('end', resolve)
  })
})

gulp.task('build', gulp.series([
  'compile',
  'bundle',
  'css',
]))