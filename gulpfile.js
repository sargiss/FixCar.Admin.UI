var fs = require('fs');
var path = require('path');
var merge = require('gulp-merge');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var debug = require('gulp-debug');
var merge = require('merge-stream');

var scriptsPath = 'Scripts/app';
var destScriptPath = 'Scripts/include';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function (file) {
          return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

function getTasks(path, fileName) {
    return gulp.src(path)
          .pipe(concat(fileName + '.js'))
          .pipe(gulp.dest(destScriptPath));
}

function mergeTask() {
    var folders = getFolders(scriptsPath);

    var tasks = folders.map(function (folder) {
        return getTasks(path.join(scriptsPath, folder, '/*.js'), folder);
    });

    return merge(tasks, getTasks(scriptsPath + '/*.js', "app"));
}

gulp.task('scripts', function () {
    var merged = mergeTask();
    return gulp.src('Views/Shared/_Layout.cshtml').pipe(inject(merged)).pipe(gulp.dest("Views/Shared"));
});

gulp.task("scriptsMerge", function () {
    return mergeTask();
});

gulp.task("default", ["scripts"], function () {
    gulp.watch(scriptsPath + "/**/*.js", ["scriptsMerge"]);
});
