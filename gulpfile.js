const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const tsComp = require('gulp-typescript');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');

// sass.compiler = require('node-sass');

// Compile TS files to vanilla JS
gulp.task('tsCompile', async () => {
	gulp.src('/src/js/ts/**/*.ts').pipe(tsComp()).pipe(gulp.dest('/src/js'));
});

// Optimize images for dist
gulp.task('imgMin', async () => {
	gulp.src('/src/img/*').pipe(imagemin()).pipe(gulp.dest('/dist/images'));
});

// Copy html from dev to final build as-is
gulp.task('htmlCopy', async () => {
	console.log('copying HTML...');
	gulp.src('src/**/*.html').pipe(gulp.dest('dist'));
	console.log('HTML copied');
});

// Compile Sass to minified Css
gulp.task('style', async () => {
	console.log('starting scss compilation...');
	gulp.src('/style_test/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest('/dist/css'));
	console.log('ended scss compile');
});

// Join all JS files into single JS file, then compress it
gulp.task('comp_js', async () => {
	gulp.src('/src/js/**/*.js')
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('/dist/js'));
});

// Watch and execute all commands
gulp.task('default', async () => {
	console.log('Starting Watch...');
	gulp.watch('./src/**/*.html', gulp.series('htmlCopy'));
	// gulp.watch('/src/js/ts/**/*.ts', gulp.series('tsCompile'));
	gulp.watch('/src/styles/**/*.scss', gulp.series('style'));
	// gulp.watch('/src/js/**/*.js', gulp.series('comp_js'));
});

gulp.task('sass:watch', async () => {
	gulp.watch('/style_test/style.scss', gulp.series('style'));
});
