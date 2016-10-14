var gulp = require('gulp');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var clean  = require('gulp-clean');

gulp.task('clean-dist', function () {
	return gulp.src('./dist', {read: false})
		.pipe(clean());
});

gulp.task('install-pdfjs', ['clean-dist'], function () {
	return gulp.src('./pdfsign.js/src/lib/pdfjs/**/*.js')
		.pipe(gulp.dest('./dist/pdfjs'));
});

gulp.task('install-forge', ['clean-dist'], function () {
	return gulp.src('./node_modules/node-forge/js/*.js')
		.pipe(gulp.dest('./dist/forge'));
});

gulp.task('patch-forge', ['install-forge'], function () {
	return gulp.src('./pdfsign.js/src/lib/pkcs7-detached.js')
		.pipe(rename('pkcs7.js'))
		.pipe(gulp.dest('./dist/forge'));
});

gulp.task('install-deps', ['install-pdfjs', 'patch-forge']);

gulp.task('build', ['install-deps'], function () {
    return gulp.src('./pdfsign.js/build/pdfsign.js')
            .pipe(wrap({src: 'src/index.js.template'}))
            .pipe(rename('index.js'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build']);
