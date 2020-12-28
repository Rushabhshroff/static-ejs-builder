const { parallel, watch, src, dest, series } = require('gulp')
const EjsBuilder = require('./builder/ejs-transpiler')
const sass = require('gulp-sass');
const connect = require('gulp-connect');
function TranspileEjs(cb) {
  src('src/pages/**/*.ejs').pipe(EjsBuilder()).pipe(dest('public')).pipe(connect.reload())
  cb();
}

function TranspileSass(cb) {
  src('src/scss/style.scss').pipe(sass().on('error', console.log)).pipe(dest('public/css')).pipe(connect.reload())
  cb()
}

function Watcher(cb) {
  watch('src/**/*.ejs', TranspileEjs);
  watch('src/pages/**/*.json', TranspileEjs);
  watch('src/scss/**/*.scss', TranspileSass);
  cb()
}

function Server(cb) {
  connect.server({
    root: 'public',
    port: 8000,
    livereload: true
  })
  cb()
}

exports.default = series(TranspileEjs, TranspileSass, parallel(Watcher, Server))