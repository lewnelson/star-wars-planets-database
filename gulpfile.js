"use strict";

const gulp = require("gulp");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const browserify = require("browserify");

/**
 *  Compile javascript from source
 *
 *  @param {boolean} dev If true then sourcemaps will be written
 *  @param {boolean} watch If true then watch for changes
 *  @return {Stream}
 */
function compileJs(dev, watch) {
  let bundler = browserify(
    "./src/js/app.js",
    {
      debug: true
    }
  )
  .transform("babelify", {
    presets: ["es2015", "react"]
  });

  let stream = bundler.bundle()
    .on("error", (err) => console.error(err))
    .pipe(source("app.js"))
    .pipe(buffer());

  if(dev === true) {
    stream = stream.pipe(sourcemaps.init({loadMaps: true}));
  }

  stream = stream.pipe(uglify());
  if(dev === true) {
    stream = stream.pipe(sourcemaps.write());
  }

  return stream.pipe(gulp.dest("public/js"));
}

/**
 *  Compile sass from source
 *
 *  @param {boolean} dev If true then sourcemaps will be written
 *  @return {Stream}
 */
function compileSass(dev) {
  let stream = gulp.src("src/sass/app.scss");
  if(dev === true) {
    stream = stream.pipe(sourcemaps.init());
  }
  
  stream = stream.pipe(sass({
      outputStyle: "compressed"
    }))
    .on("error", sass.logError);

  if(dev === true) {
    stream = stream.pipe(sourcemaps.write());
  }

  return stream.pipe(gulp.dest("public/css"));
}

// Build js for development environment
gulp.task("jsDev", () => {
  compileJs(true, false);
});

// Build css from sass for development environment
gulp.task("sassDev", () => {
  compileSass(true);
});

// Watch for changes to js and then build for development
gulp.task("jsWatch", () => {
  gulp.watch("src/js/**/*.js", ["jsDev"]);
});

// Watch for changes to scss and then build for development
gulp.task("sassWatch", () => {
  gulp.watch("src/sass/**/*.scss", ["sassDev"]);
});

// Build js for production environment
gulp.task("jsProd", () => {
  compileJs(false, false);
});

// Build css from sass for production environment
gulp.task("sassProd", () => {
  compileSass(false);
});

gulp.task("default", ["jsDev", "sassDev"]);
gulp.task("watch", ["jsWatch", "sassWatch"]);
gulp.task("prod", ["jsProd", "sassProd"]);