const gulp = require('gulp');

const uglify = require('gulp-uglify');
const tsComp = require('gulp-typescript');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

const browserSync = require('browser-sync').create();

// sass.compiler = require('node-sass');

// Compile TS files to vanilla JS
gulp.task('tsCompile', async () => {
	gulp.src('./src/script/ts/**/*.ts')
		.pipe(tsComp())
		.pipe(gulp.dest('./src/script'));
});

// Optimize images for dist
gulp.task('imgMin', async () => {
	gulp.src('./src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/images'))
		.pipe(browserSync.stream());
});

// Copy html from dev to final build as-is
gulp.task('htmlCopy', async () => {
	gulp.src('./src/**/*.html').pipe(gulp.dest('./dist'));
});

// Compile Sass to minified CSS
gulp.task('sass', async () => {
	gulp.src('./src/style/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

// Join all JS files into single JS file, then compress it
gulp.task('comp_js', async () => {
	gulp.src('./src/script/**/*.js')
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream());
});

// Watch and execute all commands
gulp.task('watch', async () => {
	console.log('Starting Watch...');
	gulp.watch('./src/style/**/*.scss', gulp.series('sass'));
	gulp.watch('./src/**/*.html', gulp.series('htmlCopy'));
	gulp.watch('./src/script/ts/**/*.ts', gulp.series('tsCompile'));
	gulp.watch('./src/script/**/*.js', gulp.series('comp_js'));
});

gulp.task('serve', async () => {
	browserSync.init({
		server: {
			baseDir: './dist',
		},
	});
	gulp.watch('./src/**/*.html', gulp.series('htmlCopy')).on(
		'change',
		browserSync.reload
	);
	gulp.watch('./src/style/**/*.scss', gulp.series('sass'));
	gulp.watch('./src/script/ts/**/*.ts', gulp.series('tsCompile'));
	gulp.watch('./src/script/**/*.js', gulp.series('comp_js'));
	gulp.watch('./src/img/*', gulp.series('imgMin'));
});

gulp.task('default', gulp.series('serve'));
