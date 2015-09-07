// set up gulp and packages
var gulp				= require('gulp');
    sass				= require('gulp-sass');
    min					= require('gulp-minify-css');
    concat				= require('gulp-concat');
    concatCSS 			= require('gulp-concat-css');
    jshint              = require('gulp-jshint');
    uglify 				= require('gulp-uglify');
    html_replace		= require('gulp-html-replace');
    del                 = require('del');
    notify              = require('gulp-notify');

// location constants
var DIST_HTML			= './../dist';
    DIST_JS				= './../dist/assets/js/';
    DIST_CSS			= './../dist/assets/css/';
    DIST_FONTS			= './../dist/assets/fonts/';
    DIST_IMG			= './../dist/assets/img/';

var ALL_HTML 			= './**/*.html';
var ALL_SCSS 			= './assets/styles/sass/*.scss'; 
var ALL_CSS 			= './assets/styles/css/*.css';
var DEST_CSS 			= './assets/styles/css/';

var ALL_JS_LIB			= './assets/js/lib/*.js';
var ALL_JS_CORE			= './assets/js/*.js';
var DEST_JS_LIB			= './assets/js/lib/';
var DEST_JS_CORE		= './assets/js/';

var ALL_FONTS			= './static/assets/fonts/**/*.{eot,ttf,woff,eof,svg}';
var ALL_IMG				= './assets/img/**/*'

// convert sass to css
gulp.task('sass', function(){
	gulp.src(ALL_SCSS)
        .pipe(sass())
        .pipe(gulp.dest(DEST_CSS))
        .pipe(notify({ message: 'sass complete' }));
});

// concat & min css, pipe to dist/css
gulp.task('css', ['sass'],  function(){
	gulp.src(ALL_CSS)
        .pipe(concatCSS('bundle.min.css'))
        .pipe(min())
        .pipe(gulp.dest(DIST_CSS))
        //.pipe(min({keepBreaks:true}))
        .pipe(notify({ message: 'dist/css complete' }));
});

// jshint js
gulp.task('jshint', function(){
    gulp.src(ALL_JS_CORE)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: 'jshint complete' }));
});

// concat & uglify js, pipe to dist/js
gulp.task('js', ['jshint',], function(){
	gulp.src([ALL_JS_LIB, ALL_JS_CORE])
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_JS))
        .pipe(notify({ message: 'dist/js complete' }));
});

gulp.task('clean', function(cb) {
    del([DIST_CSS, DIST_JS], cb);
});

// pipe fonts to dist/fonts
gulp.task('fonts', function(){
	gulp.src([ALL_FONTS])
        .pipe(gulp.dest(DIST_FONTS));
});

// pipe images to dist/img
gulp.task('img', function(){
	gulp.src(ALL_IMG)
        .pipe(gulp.dest(DIST_IMG));
});

// corrects imports
gulp.task('html-imports', function(){
	gulp.src([ALL_HTML])
    	.pipe(html_replace({
	        'dev_css_index': 'assets/css/bundle.min.css',
	        'dev_js_index': 'assets/js/bundle.min.js',
	        'dev_css_subpage': '../assets/css/bundle.min.css',
	        'dev_js_subpage': '../assets/js/bundle.min.js' 
	    }))
    	.pipe(gulp.dest(DIST_HTML));
});

// PROD task broken
//gulp.task('prod', ['css','js','html-imports','img','fonts']);
gulp.task('dev', ['sass','jshint']);

gulp.task('default', function(){});