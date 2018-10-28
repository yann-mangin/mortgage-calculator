"use strict";

var gulp = require("gulp");
var lesshint = require("gulp-lesshint");
var watch = require("gulp-watch");
var eslint = require("gulp-eslint");
var autoprefixer = require("gulp-autoprefixer");
var less = require("gulp-less");
var path = require("path");
var cssmin = require("gulp-cssmin");
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
var fail = require("gulp-fail");
var gutil = require("gutil");
var chalk = require("chalk");
var guppy = require("git-guppy");
var exec = require("child_process").exec;
var fs = require("fs");
var babel = require("gulp-babel");
var polyfill = path.relative(__dirname, path.join(require.resolve("babel-polyfill"), "../..", "dist/polyfill.min.js"));

/**
 * Getting all the required paths for the application
 */
var paths = require("./paths.config");

/**
 * Setting options passed in as command line arguments
 */
var options = {
  ignore: argv.ignore
};

/**
 * Setting the application environment.
 */
var __env;
if (argv.local) {
  __env = "local";
} else if (argv.dev) {
  __env = "dev";
} else if (argv.docker) {
  __env = "docker";
} else if (argv.test) {
  __env = "test";
} else {
  __env = "ci";
}

/**
 * Lint less function checks tests sources files for style guide errors/warnings
 */
function lintLess(type){
  return gulp.src(paths.src.less[type].sources.map(function mapLessPaths(src) {
    return paths.src.base + paths.src.less.base + src;
  }))
  .pipe(lesshint())
  .pipe(lesshint.reporter(""))
  .pipe(gulpif(function(file) {
    return !options.ignore && !file.lesshint.success;
  }, fail(chalk.red("Build failed due to LESS linting error(s)."), true)));
}

/**
 * lint less tasks calls
 */
gulp.task("lint:less:theme", function LintThemeLess() {
  return lintLess('theme');
});

gulp.task("lint:less:anatwine", function LintAnatwineLess() {
  return lintLess('anatwine');
});

gulp.task("lint:less:integration", function LintIntegrationLess() {
  return lintLess('integration');
});

gulp.task("lint:less:styles", function LintStylesLess() {
  return lintLess('styles');
});

/**
 * Lint Js function checks tests sources files for style guide errors/warnings
 */
function lintJs(type) {
  return gulp.src(paths.src.js[type].sources.map(function mapLintJsPaths(src) {
    return paths.src.base + paths.src.js.base + paths.src.js[type].base + src;
  }))
  .pipe(eslint({
    fix: true
  }))
  .pipe(eslint.format())
  .pipe(gulpif(!options.ignore, eslint.failAfterError()));
}

/**
 * lint js tasks calls
 */
gulp.task("lint:js:main", function lintJsMain() {
  lintJs("main");
});

gulp.task("lint:js:controllers", function lintJsControllers() {
  lintJs("controllers");
});

gulp.task("lint:js:services", function lintJsServices() {
  lintJs("services");
});

gulp.task("lint:js:filters", function lintJsFilters() {
  lintJs("filters");
});

gulp.task("lint:js:directives", function lintJsDirectives() {
  lintJs("directives");
});

/**
 * Ignore Lint js and less style guide tests.
 */
gulp.task('ignore:lint', function () {
  return;
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
      if (!options.ignore) {
        process.exit(error);
      }
    }
    done();
  });

  karma.start();
});

/**
 * Ignore Karma/Jasmine unit tests on the JavaScript.
 */
gulp.task('ignore:test', function () {
  return;
});

/**
 * HTML uglifing function from src to
 * - tmp folder if build started
 * - dist folder if watching changing html files
 */
function buildHtml(type,folder){
  return gulp.src(paths.src.html[type].sources.map(function mapHtmlPaths(src) {
    var file = paths.src.base + paths.src.html.base + paths.src.html[type].base + src;
    return paths.src.base + paths.src.html.base + paths.src.html[type].base + src;
  }))
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest(paths[folder].base + paths[folder].html.base + paths[folder].html[type].base));
}

/**
 * HTML uglifing tasks calls
 */
gulp.task("build:tmp:html:main", function buildTmpHtmlMain() {
  return buildHtml('main','tmp');
});

gulp.task("build:tmp:html:app", function buildTmpHtmlCommon() {
  return buildHtml('app','tmp');
});

gulp.task("build:tmp:html:common", function buildTmpHtmlCommon() {
  return buildHtml('common','tmp');
});

gulp.task("build:tmp:html:integration", function buildTmpHtmlIntegration() {
  return buildHtml('integration','tmp');
});

gulp.task("build:tmp:html:retailer", function buildTmpHtmlRetailer() {
  return buildHtml('retailer','tmp');
});

gulp.task("build:tmp:html:vendor", function buildTmpHtmlVendor() {
  return buildHtml('vendor','tmp');
});

gulp.task("build:dist:html:main", function buildDistHtmlMain() {
  return buildHtml('main','dist');
});

gulp.task("build:dist:html:app", function buildDistHtmlCommon() {
  return buildHtml('app','dist');
});

gulp.task("build:dist:html:common", function buildDistHtmlCommon() {
  return buildHtml('common','dist');
});

gulp.task("build:dist:html:integration", function buildDistHtmlIntegration() {
  return buildHtml('integration','dist');
});

gulp.task("build:dist:html:retailer", function buildDistHtmlRetailer() {
  return buildHtml('retailer','dist');
});

gulp.task("build:dist:html:vendor", function buildDistHtmlVendor() {
  return buildHtml('vendor','dist');
});

/**
 * Less compiling function from src to
 * - tmp folder if build started
 * - dist folder if watching changing less files
 */
function buildLess(type, folder) {
  return gulp.src(paths.src.base + paths.src.less.base + type + '.less')
  .pipe(less())
  .pipe(gulpif(__env === "local" || __env === "dev" || __env === "docker" || __env === "test", sourcemaps.init()))
  .pipe(autoprefixer({
    browsers: ["last 2 versions"],
    cascade: false
  }))
  .pipe(cssmin())
  .pipe(gulpif(__env === "local" || __env === "dev" || __env === "docker" || __env === "test", sourcemaps.write()))
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest(paths[folder].base + paths[folder].css.base));
}

/**
 * less compiling tasks calls
 */
gulp.task("build:tmp:less:theme", function buildThemeLess() {
  return buildLess('theme','tmp');
});

gulp.task("build:tmp:less:anatwine", function buildAnatwineLess() {
  return buildLess('anatwine','tmp');
});

gulp.task("build:tmp:less:integration", function buildIntegrationLess() {
  return buildLess('integration','tmp');
});

gulp.task("build:tmp:less:styles", function buildIntegrationLess() {
  return buildLess('styles','tmp');
});

gulp.task("build:dist:less:theme", function buildThemeLess() {
  return buildLess('theme','dist');
});

gulp.task("build:dist:less:anatwine", function buildAnatwineLess() {
  return buildLess('anatwine','dist');
});

gulp.task("build:dist:less:integration", function buildIntegrationLess() {
  return buildLess('integration','dist');
});

gulp.task("build:dist:less:styles", function buildStylesLess() {
  return buildLess('styles','dist');
});

/**
 * build Js destination files by annotating, concatenating, then uglifying to
 * - tmp folder if build started
 * - dist folder if watching changing js files
 * If running anything else than production build, then creates sourcemaps.
 */

function buildJS(type,folder){
  return gulp.src(paths.src.js[type].sources.map(function mapBuildJsPaths(src) {
    return paths.src.base + paths.src.js.base + paths.src.js[type].base + src;
  }).concat())
  .pipe(gulpif(__env === "local" || __env === "dev" || __env === "docker" || __env === "test", sourcemaps.init()))
  .pipe(babel())
  .pipe(concat(type + '.js'))
  .pipe(uglify())
  .pipe(gulpif(__env === "local" || __env === "dev" || __env === "docker" || __env === "test", sourcemaps.write()))
  .pipe(gulp.dest(paths[folder].base + paths[folder].js.base));
}

/**
 * build js tasks calls
 */
gulp.task("build:tmp:js:main", function buildTmpJsMain() {
  return buildJS('main','tmp');
});

gulp.task("build:tmp:js:controllers", function buildTmpJsControllers() {
  return buildJS('controllers','tmp');
});

gulp.task("build:tmp:js:services", function buildTmpJsServices() {
  return buildJS('services','tmp');
});

gulp.task("build:tmp:js:filters", function buildTmpJsFilters() {
  return buildJS('filters','tmp');
});

gulp.task("build:tmp:js:directives", function buildTmpJsDirectives() {
  return buildJS('directives','tmp');
});

gulp.task("build:dist:js:main", function buildDistJsMain() {
  return buildJS('main','dist');
});

gulp.task("build:dist:js:controllers", function buildDistJsControllers() {
  return buildJS('controllers','dist');
});

gulp.task("build:dist:js:services", function buildDistJsServices() {
  return buildJS('services','dist');
});

gulp.task("build:dist:js:filters", function buildDistJsFilters() {
  return buildJS('filters','dist');
});

gulp.task("build:dist:js:directives", function buildDistJsDirectives() {
  return buildJS('directives','dist');
});

/**
 * Piping env config to `tmp`
 */
gulp.task("build:env", function() {
  if (__env === "local" || __env === "dev" || __env === "docker" || __env === "test" || __env === "ci") {
    return gulp.src("env." + __env + ".config.js")
      .pipe(rename("env.js"))
      .pipe(gulp.dest(paths.tmp.base));
  } else {
    chalk.yellow('This is a production build. You must place your own env.js config file in the public web directory.');
    return;
  }
});

/**
 * Building the rest of the distribution files and piping to `tmp`.
 */
gulp.task("build:tmp", function buildTmp() {
  return gulp.src(paths.tmp.build.directories)
    .pipe(gulp.dest(paths.tmp.base));
});

/**
 * Piping all the application files from `tmp` to `dist`.
 */
gulp.task("build:dist", function buildDist() {
  return gulp.src([
    paths.tmp.base + "*",
    paths.tmp.base + "**/*"
  ])
  .pipe(gulp.dest(paths.dist.base));
});

/**
 * Create the `dist` directory, if it doesn't already exist.
 * Call the `done` callback function if necessary to let Gulp know it's complete.
 */
gulp.task("create:dist", function createDist(done) {
  if (!fs.existsSync(paths.dist.base)) {
    fs.mkdirSync(paths.dist.base);
  }
  done();
});

/**
 * Create the `tmp` directory, if it doesn't already exist.
 * Call the `done` callback function if necessary to let Gulp know it's complete.
 */
// Create the `./tmp` directory, if it doesn't exist
gulp.task("create:tmp", function createTmp(done) {
  if (!fs.existsSync(paths.tmp.base)) {
    fs.mkdirSync(paths.tmp.base);
  }
  done();
});

/**
 * Delete the `dist` directory, if it exists.
 * Call the `done` callback function if necessary to let Gulp know it's complete.
 */
gulp.task("clean:dist", function cleanDist(done) {
  if (fs.existsSync(paths.dist.base)) {
    return del([paths.dist.base]);
  }
  done();
});

/**
 * Delete the `tmp` directory, if it exists.
 * Call the `done` callback function if necessary to let Gulp know it's complete.
 */
gulp.task("clean:tmp", function cleanTmp(done) {
  if (fs.existsSync(paths.tmp.base)) {
    return del([paths.tmp.base]);
  }
  done();
});

/**
 * Serve static assets and REST API for dev builds
 */
gulp.task("serve", function(done) {
  if (__env === "local" || __env === "dev" || __env === "docker") {
    exec('serve dist/ -p 8181', function (error, stdout, stderr) {
      gutil.log(chalk.white(stdout));
      gutil.log(chalk.red(stderr));
      done(error);
    });
    gutil.log(chalk.green("Web server started at http://localhost:8181"));
  }
});

/**
 * Watch Html functions that update the appropriate html minified destination file depending on the html source changes
 */
function watchHtml(type){
  var task = ['build:dist:html:' + type];
  var watcher = gulp.watch(paths.src.html[type].sources.map(function mapLessPaths(src) {
    return paths.src.base + paths.src.html.base + paths.src.html[type].base + src;
  }), task);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  });
}

/**
 * Watch Less functions that update the appropriate css minified destination file depending on the less source changes
 * Runs lint Less if no ignore arg
 */
function watchLess(type){
  var task = ['build:dist:less:' + type];
  if (!options.ignore) task.unshift('lint:less:' + type);
  var watcher = gulp.watch(paths.src.less[type].sources.map(function mapLessPaths(src) {
    return paths.src.base + paths.src.less.base + src;
  }), task);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  });
}

/**
 * Watch JS functions that update the appropriate js minified destination file depending on the js source changes
 * Runs lint JS if no ignore arg
 */
function watchJs(type) {
  var task = ['build:dist:js:' + type];
  if (!options.ignore) task.unshift('lint:js:' + type);
  var watcher = gulp.watch(paths.src.js[type].sources.map(function mapJsPaths(src) {
    return paths.src.base + paths.src.js.base + paths.src.js[type].base + src;
  }), task);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  });
}

/**
 * Watch task for all html, less and js files.
 */
gulp.task('watch', function () {
  watchHtml('main');
  watchHtml('app');
  watchHtml('common');
  watchHtml('integration');
  watchHtml('retailer');
  watchHtml('vendor');

  //watchLess('theme');
  watchLess('anatwine');
  watchLess('styles');
  watchLess('integration');

  watchJs('main');
  watchJs('controllers');
  watchJs('services');
  watchJs('filters');
  watchJs('directives');
});

/**
 * Running the build tasks sequentially
 */
gulp.task("build", function build(done) {
  function callback() {
    return done();
  }

  var lintTasks = ["ignore:lint"];
  var testTasks = ["ignore:test"];
  var serveTasks = ["serve"];
  if (!options.ignore){
    lintTasks = [
      "lint:js:main",
      "lint:js:controllers",
      "lint:js:services",
      "lint:js:filters",
      "lint:js:directives",
      //"lint:less:theme",
      "lint:less:anatwine",
      "lint:less:integration"
    ];
    //testTasks = ["test:js"];
  }

  if (__env === "local" || __env === "dev" || __env === "docker" || __env === "test"){
    serveTasks.push("watch");
  }

  runSequence(
    "clean:tmp",
    lintTasks,
    //testTasks,
    "create:tmp",
    [
      "build:tmp:js:main",
      "build:tmp:js:controllers",
      "build:tmp:js:services",
      "build:tmp:js:filters",
      "build:tmp:js:directives",
      //"build:tmp:less:theme",
      "build:tmp:less:anatwine",
      "build:tmp:less:integration",
      "build:tmp:less:styles",
      "build:tmp:html:main",
      "build:tmp:html:app",
      "build:tmp:html:common",
      "build:tmp:html:integration",
      "build:tmp:html:retailer",
      "build:tmp:html:vendor",
      "build:env",
      "build:tmp"
    ],
    "clean:dist",
    "create:dist",
    "build:dist",
    "clean:tmp",
    serveTasks,

    callback
  );
});

gulp.task("default", function gulpDefault() {
  gutil.log(chalk.red("\n\n Please check the documentation at" +
                      " https://anatwine.atlassian.net/wiki/display/TR/Development+Workflow \n\n"));
});
