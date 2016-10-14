var gulp = require('gulp');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');

gulp.task('install-deps', function () {
    var pdfsign_deps = [ './pdfsign.js/build/lib/pdfjs.parser.js'
                       , './pdfsign.js/build/lib/forge-patched.js'
                       ];
    return gulp.src(pdfsign_deps)
            .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['install-deps'], function () {
    return gulp.src('./pdfsign.js/build/pdfsign.js')
            .pipe(wrap({src: 'src/index.js.template'}))
            .pipe(rename('index.js'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build']);
