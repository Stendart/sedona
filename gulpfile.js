const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");

const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;

const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");

const del = require("del")
const sync = require("browser-sync").create();


// Styles

const styles = () => {
  return gulp.src("source/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;


//JS
/*.pipe(rename("js.min.js"))*/
const js = () => {
  return gulp.src("source/js/*.js")
    .pipe(sourcemap.init())
    .pipe(uglify())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
}
// Images

const images = () => {
 return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}

exports.images = images;


// Copy to

const copy = () => {
 return gulp.src([
 "source/fonts/**/*.{woff,woff2}",
 "source/css/styles.min.css",
 "source/*.ico"
 ], {
 base: "source"
 })
.pipe(gulp.dest("build"));
};

exports.copy = copy;


// Clean
const clean = () => {
 return del("build");
};

exports.clean = clean;


//html
const html = () => {
  return gulp.src("source/*.html")
  .pipe(gulp.dest("build"));
}

exports.html = html;

// Build
const build = gulp.series(
 clean,
 images,
 styles,
 copy,
 js,
 html
);
exports.build = build;


// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    browser: 'chrome',
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/scss/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
