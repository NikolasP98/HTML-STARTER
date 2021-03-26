let xd = 0;

gulp.task('comp_js', async () => {
	console.log('feedback worked');
	gulp.src('/src/js/**/*.js')
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('/dist/js'));
});
