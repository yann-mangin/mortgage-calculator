"use strict";

var gulp = require("gulp");
var watch = require("gulp-watch");
var eslint = require("gulp-eslint");
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var sassLint = require('gulp-sass-lint');
var path = require("path");
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var gulpif = require("gulp-if");
var concat = require("gulp-concat");
var Karma = require("karma").Server;
var jasmine = require("gulp-jasmine");
var htmlmin = require("gulp-htmlmin");
var argv = require("yargs").argv;
var del = require("del");
var runSequence = require("run-sequence");
var gutil = require("gutil");
var chalk = require("chalk");
//var guppy = require("git-guppy");
var fs = require("fs");
var babel = require("gulp-babel");
const stripCssComments = require('gulp-strip-css-comments');
var polyfill = path.relative(__dirname, path.join(require.resolve("babel-polyfill"), "../..", "dist/polyfill.min.js"));
var server = require('gulp-server-livereload');
var htmlLint = require('gulp-html-linter');

// Getting all the required paths for the application
var paths = require("./paths.config");

// Setting the application environment.
var __env;
if (argv.local) {
  __env = "local";
} else {
  __env = "ci";
}

// Setting the default port to serve the application
var __port = 8181;

/************************************************************************************
 * Utility functions
 */

/**
 * Creates the 'folder' directory, if it exists.
 * Call the 'done' callback function if necessary to let Gulp know it's complete.
 * @param done
 * @param folder
 */
function createFolder(done, folder) {
  if (fs.existsSync(folder))
    fs.mkdirSync(folder);
  
  done();
}

/***********************************************************************
 * Deletes the 'folder' directory, if it exists.
 * Call the done' callback function if necessary to let Gulp know it's complete.
 * @param done
 * @param folder
 * @returns {*}
 */
function deleteFolder(done, folder) {
  if (fs.existsSync(folder))
    return del([folder]);
  
  done();
}

/**
 * Build the html files to the requested destination
 * @param sources
 * @param dest
 */
function buildHtmlFn(sources, dest){
  return gulp.src(sources)
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(dest));
}

/**
 * * Watch file
 * @param sources
 * @param tasks
 * @param unignoredTasks
 */
function watchFiles(sources,tasks,unignoredTasks){
  if (!argv.ignore) tasks.unshift(unignoredTasks);
  
  var watcher = gulp.watch(sources, tasks);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  });
}

/**
 * linter for JS files
 * @param sources
 */
function lintJs(sources) {
  return gulp.src(sources)
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(gulpif(!argv.ignore, eslint.failAfterError()));
}

/*********************************************************
 * Create Folder destination
 */
gulp.task("create:tmp", function createTmpFolder(done) {
  return createFolder(done, './tmp/');
});

/*********************************************************
 * Delete Folder destination
 */
gulp.task("clean:tmp", function cleanTmpFolder(done){
  return deleteFolder(done, './tmp/');
});

/************************************************************************************
 * Assets
 */
gulp.task("build:assets", function buildAssets() {
  return gulp.src(['./src/assets/*','./src/assets/**/*'])
    .pipe(gulp.dest('./tmp/assets/'));
});

gulp.task('build:fonts:libraries', function() {
  return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('./tmp/assets/fonts/fontawesome/'))
});

/************************************************************************************
 * HTML
 */

// BUILD ----------
gulp.task("build:html:index", function buildHtmlIndex() {
  const sources = ['./src/index.html'];
  const dest = './tmp';
  return buildHtmlFn(sources, dest);
});

gulp.task("build:html:views", function buildHtmlViews() {
  const sources = ['./src/views/*.html','./src/views/**/*.html'];
  const dest = './tmp/views';
  return buildHtmlFn(sources, dest);
});

// LINT ----------
gulp.task("lint:html", function() {
  return gulp.src('./src/**/*.html')
    .pipe(htmlLint())
    .pipe(htmlLint.format())
    .pipe(htmlLint.failOnError())
});

// WATCH ----------
gulp.task('watch:html', function() {
  const sources = ['./src/index.html', './src/views/*.html', './src/views/**/*.html'];
  const tasks = ['build:html:index', 'build:html:views'];
  const unignoredTasks = [];
  
  watchFiles(sources, tasks, unignoredTasks);
});

/************************************************************************************
 * CSS/SCSS
 */

// BUILD ----------
gulp.task('build:css:libraries', function() {
  const sources = [
    './node_modules/@cgross/angular-notify/dist/angular-notify.min.css',
    './node_modules/animate.css/animate.min.css'
  ];
  gulp.src( sources )
    .pipe(stripCssComments())
    .pipe(gulp.dest('./tmp/css/'));
});

gulp.task('build:scss', function () {
  return gulp.src('./src/scss/styles.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest('./tmp/css'));
});

// LINT ----------
gulp.task('lint:scss', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

// WATCH ----------
gulp.task('watch:scss', function () {
  const sources = ['./src/scss/**/*.scss'];
  const tasks = ['build:scss'];
  const unignoredTasks = ['lint:scss'];
  
  watchFiles(sources, tasks, unignoredTasks);
});

/************************************************************************************
 * JS
 */

// BUILD ----------
gulp.task("build:js:app", function buildJsApp() {
  const sources = ['./src/js/app/*.js'];
  return gulp.src(sources.concat())
    .pipe(gulpif(__env === "local", sourcemaps.init()))
    .pipe(babel())
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulpif(__env === "local", sourcemaps.write()))
    .pipe(gulp.dest('./tmp/js'));
});

gulp.task("build:js:resources", function buildJsResources() {
  const sources = [
    './src/js/app/**/*.js',
    '!./src/js/app/*.js'
  ];
  return gulp.src(sources)
    .pipe(gulpif(__env === "local", sourcemaps.init()))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulpif(__env === "local", sourcemaps.write()))
    .pipe(gulp.dest('./tmp/js/app'));
});

// LINT ----------
gulp.task("lint:js:app", function lintJsResources() {
  const sources = ['./src/js/app/*.js'];
  lintJs(sources);
});

gulp.task("lint:js:resources", function lintJsResources() {
  const sources = ['./src/js/app/**/*.js', '!./src/js/app/*.js'];
  lintJs(sources);
});

// WATCH ----------
gulp.task("watch:js:app", function watchJsApp() {
  const sources = ['./src/js/app/*.js'];
  const tasks = ['build:js:app'];
  const unignoredTasks = ['lint:js:app'];

  watchFiles(sources,tasks,unignoredTasks);
});

gulp.task("watch:js:resources", function watchJsResources() {
  const sources = ['./src/js/app/**/*.js', '!./src/js/app/*.js'];
  const tasks = ['build:js:resources'];
  const unignoredTasks = ['lint:js:resources'];

  watchFiles(sources,tasks,unignoredTasks);
});

gulp.task('build:js:libraries', function buildJsLibraries () {
  const sources = [
    './node_modules/angular/angular.min.js',
    './node_modules/angular-chart.js/dist/angular-chart.min.js',
    './node_modules/@cgross/angular-notify/dist/angular-notify.min.js',
    './node_modules/angular-storage/dist/angular-storage.min.js',
    './node_modules/angular-translate/dist/angular-translate.min.js',
    './node_modules/angular-ui-router/release/angular-ui-router.min.js',
    './node_modules/chart.js/dist/Chart.min.js',
    './node_modules/oclazyload/dist/ocLazyLoad.min.js',
    './node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls-3.0.5.min.js'
  ];
  gulp.src( sources ).pipe(gulp.dest('./tmp/js/modules/'));
});

/********************************************************
 * Piping all the application files from 'tmp' to 'dist'.
 */
gulp.task("build:dist", function buildDist() {
  return gulp.src(['./tmp/**/*'])
    .pipe(gulp.dest(paths.dist.base));
});

/**
 * Serve static assets and REST API for dev builds
 */
gulp.task("serve", function() {
  if (__env === "local") {
    gulp.src('tmp').pipe(server(
      {
        livereload: true,
        open: true,
        port: __port
      }
    ));
    
    gutil.log(chalk.green("Web server started at http://localhost:" + __port));
  }
});

/**
 * Running Karma/Jasmine unit tests on the JavaScript.
 */
gulp.task("test:js", function testJs(done) {
  var karma = new Karma({
                          configFile: __dirname + "/test/karma.conf.js",
                          singleRun: (__env !== "local" || __env !== "dev" || __env !== "docker" || __env !== "test")
                        }, function(error) {
    if (error !== 0) {
      gutil.log(chalk.red("Karma failed with code " + String(error)));
      if (!argv.ignore) {
        process.exit(error);
      }
    }
    done();
  });
  
  karma.start();
});

/************************************************************************
 * Ignore Lint js and less style guide tests.
 * Ignore Karma/Jasmine unit tests on the JavaScript.
 */

gulp.task('ignore:lint', function () {
  return;
});

gulp.task('ignore:test', function () {
  return;
});

/*********************************************************************
 * Running the build tasks sequentially
 */
gulp.task("build", function build(done) {
  function callback() {
    return done();
  }
  
  // Tests if the argument given for protocol is valid
  if (argv.p) {
    if (Number.isInteger(argv.p)) {
      if (argv.p < 8000 || argv.p > 9000 ){
        gutil.log(chalk.red("Port provided a port between 8000 and 9000."));
        return done();
      } else {
        __port = argv.p;
      }
    } else {
      gutil.log(chalk.red("Port provided invalid: " + argv.p));
      return done();
    }
  }
  
  var lintTasks = ["ignore:lint"];
  var testTasks = ["ignore:test"];
  var serveTasks = ["serve"];
  if (!argv.ignore){
    lintTasks = [
      "lint:html",
      "lint:scss",
      "lint:js:app",
      "lint:js:resources"
    ];
    //testTasks = ["test:js"];
  }

  if (__env === "local"){
    serveTasks.push("watch:html");
    serveTasks.push("watch:scss");
    serveTasks.push("watch:js:app");
    serveTasks.push("watch:js:resources");
  }

  runSequence(
    "clean:tmp",
    lintTasks,
    //testTasks,
    "create:tmp",
    [
      "build:assets",
      "build:fonts:libraries"
    ],
    [
      "build:html:index",
      "build:html:views"
    ],
    [
      "build:css:libraries",
      "build:scss"
    ],
    [
      "build:js:app",
      "build:js:resources",
      "build:js:libraries"
    ],
    //"clean:dist",
    //"build:dist",
    //"clean:tmp",
    serveTasks,

    callback
  );
});

gulp.task("default", function gulpDefault() {
  gutil.log(chalk.red("\n\n Please check the documentation at" +
                      "  \n\n"));
});
