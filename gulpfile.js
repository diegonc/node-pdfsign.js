var gulp = require('gulp');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var clean  = require('gulp-clean');
var run = require('gulp-run');
var replace = require('gulp-replace');

gulp.task('clean-dist', function () {
	return gulp.src(['./dist', './tmp'], {read: false})
		.pipe(clean());
});

gulp.task('install-pdfjs', ['clean-dist'], function () {
	return gulp.src('./pdfsign.js/src/lib/pdfjs/**/*.js')
		.pipe(gulp.dest('./dist/pdfjs'));
});

gulp.task('install-pristine-forge', ['clean-dist'], function () {
	return gulp.src('./node_modules/node-forge/**/*')
		.pipe(gulp.dest('./tmp/forge'));
});

gulp.task('patch-forge', ['install-pristine-forge'], function () {
	return gulp.src('./pdfsign.js/src/lib/pkcs7-detached.js')
		.pipe(rename('pkcs7.js'))
		.pipe(gulp.dest('./tmp/forge/js'));
});

gulp.task('bundle-forge', ['patch-forge'], function () {
	return run("cd tmp/forge && npm install && npm run bundle")
		.exec();
});

gulp.task('install-forge', ['bundle-forge'], function () {
	return gulp.src('./tmp/forge/js/forge.bundle.js')
			.pipe(replace(/return require/g, "return require_internal"))
			.pipe(replace(/(.*, )require(,.*)/g, "$1require_internal$2"))
			.pipe(replace(/(.* )require( =.*)/g, "$1require_internal$2"))
			.pipe(replace(/(.*factory\()require(,.*)/g,"$1require_internal$2"))
			.pipe(replace(/(.*function\()require(,.*)/g,"$1require_internal$2"))
			.pipe(replace(/(.*)require(\('crypto.*)/g, "$1require_internal$2"))
			.pipe(rename('forge.js'))
			.pipe(gulp.dest('./dist'));
});

gulp.task('install-deps', ['install-pdfjs', 'install-forge'], function () {
	return gulp.src('./tmp', {read: false})
		.pipe(clean());
});

gulp.task('build', ['install-deps'], function () {
    return gulp.src('./pdfsign.js/build/pdfsign.js')
            .pipe(wrap({src: 'src/index.js.template'}))
            .pipe(rename('index.js'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build']);
