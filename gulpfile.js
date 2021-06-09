'use strict'

const gulp = require('gulp')
const browserify = require('browserify')
const vueify = require('vueify')
const babelify = require('babelify')
const uglify = require('gulp-uglify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

gulp.task('bundle', async () => {
  browserify('src/index.js')
    .transform(babelify, { presets: ["@babel/preset-env"] })
    .transform(vueify)
    .bundle()
    .pipe(source('elements.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('build', gulp.series([
  'bundle',
]))