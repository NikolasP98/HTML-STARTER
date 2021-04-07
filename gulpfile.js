const gulp = require('gulp');

const uglify = require('gulp-uglify');
const tsComp = require('gulp-typescript');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

const browserSync = require('browser-sync').create();

// prettier-ignore
const paths = {
	// SRC
	src: {
		main: './src',
		get pages () {return this.main + '/**/*.html'},
		get js_scripts () {return this.main + '/script/**/*.js'},
		get styles () {return this.main + '/style/**/*.scss'},
		get ts () {return this.main + 'scripts/ts/**/*.ts'},
		get images () {return this.main + '/img/*'}
	},

	// DIST
	dist: {
		main: './dist',
		get scripts () {return this.main + '/js'},
		get styles () {return this.main + '/css'},
		get images () {return this.main + '/images'}
	},
},
src = paths.src,
dist = paths.dist;

// Compile TS files to vanilla JS
gulp.task('tsCompile', async () => {
	gulp.src(paths.src.ts).pipe(tsComp()).pipe(gulp.dest(paths.src.js_scripts));
});

// Optimize images for dist
gulp.task('imgMin', async () => {
	gulp.src(paths.src.images)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.dist.images))
		.pipe(browserSync.stream());
});

// Copy html from dev to final build as-is
gulp.task('htmlCopy', async () => {
	gulp.src(paths.src.pages).pipe(gulp.dest(paths.dist.main));
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
