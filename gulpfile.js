var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    revReplace = require("gulp-rev-replace"),
    RevAll = require('gulp-rev-all'),
    dest = require('gulp-dest'),
    useref = require('gulp-useref'),
    rename = require('gulp-rename'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rev = require('gulp-rev'),
    less = require('gulp-less'),
    flatten = require('gulp-flatten'),
    lessPluginCleanCSS = require("less-plugin-clean-css"),
    cleancss = new lessPluginCleanCSS({
        advanced: true,
        aggressiveMerging: false
    });


gulp.task('default', ['replaceJs', 'replaceHtml', 'copy','less'], function () {

});

gulp.task('usemin', function () {
    return gulp.src('app/index.html')
        .pipe(usemin({
            css1: [minifyCss(), 'concat', rev()],
            js1: [uglify(), rev()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('less', function () {
    return gulp.src('app/less/styles.less')
        .pipe(less({
            plugins: [cleancss],
            relativeUrls: false,
            optimization: 2,
            cleancss: true,
            compress: true
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('app/css'));
});

gulp.task('templates', ['usemin'], function () {
    return gulp.src('app/**/*.html')
        .pipe(rev())
        .pipe(minifyHtml({empty: true}))
        .pipe(gulp.dest('build/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(''))
});

gulp.task('replaceHtml', ['templates'], function () {
    gulp
        .src(['build/index.html'])
        .pipe(revReplace({
            manifest: gulp.src('./rev-manifest.json')
        }))
        .pipe(gulp.dest('build/'));

    return gulp
        .src(['build/js/**/*.html'])
        .pipe(revReplace({
            manifest: gulp.src('./rev-manifest.json')
        }))
        .pipe(gulp.dest('build/js'))
});

gulp.task('replaceJs', ['templates'], function () {
    return gulp
        .src(['build/js/*.js'])
        .pipe(revReplace({
            manifest: gulp.src('./rev-manifest.json')
        }))
        .pipe(gulp.dest('build/js/'))

});

gulp.task('copy', function () {
    gulp
        .src(['app/images/**/*.*'])
        .pipe(gulp.dest('build/images/'))
});