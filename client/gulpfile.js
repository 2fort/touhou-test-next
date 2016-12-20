const gulp = require('gulp');
const del = require('del');
const imageResize = require('gulp-image-resize');
const imagemin = require('gulp-imagemin');

/* for 'm' folder */

gulp.task('clean-m-folder', () => (
    del([
        './src/images/m/*.*',
        '!./src/images/m/.gitkeep',
    ])
));

gulp.task('m-jpg', ['clean-m-folder'], () => (
    gulp.src(['./src/images/l/*.jpg', './src/images/l/*.jpeg'])
        .pipe(imageResize({
            height: 768,
            crop: false,
            upscale: false,
            quality: 0.95,
        }))
        .pipe(gulp.dest('./src/images/m'))
));

gulp.task('m-png', ['clean-m-folder'], () => (
    gulp.src(['./src/images/l/*.png'])
        .pipe(imageResize({
            height: 768,
            crop: false,
            upscale: false,
        }))
        .pipe(gulp.dest('./src/images/temp'))
));

gulp.task('imagemin-m-png', ['clean-m-folder', 'm-png'], () => (
    gulp.src(['./src/images/temp/*.png'])
        .pipe(imagemin())
        .pipe(gulp.dest('./src/images/m'))
));

gulp.task('clean-temp-folder-m', ['clean-m-folder', 'm-png', 'imagemin-m-png'], () => (
    del([
        './src/images/temp/*.*',
        '!./src/images/temp/.gitkeep',
    ])
));

/* for 's' folder */

gulp.task('clean-s-folder', () => (
    del([
        './src/images/s/*.*',
        '!./src/images/s/.gitkeep',
    ])
));

gulp.task('s-jpg', ['clean-s-folder'], () => (
    gulp.src(['./src/images/l/*.jpg', './src/images/l/*.jpeg'])
        .pipe(imageResize({
            height: 150,
            crop: false,
            upscale: false,
            quality: 0.95,
        }))
        .pipe(gulp.dest('./src/images/s'))
));

gulp.task('s-png', ['clean-s-folder'], () => (
    gulp.src(['./src/images/l/*.png'])
        .pipe(imageResize({
            height: 150,
            crop: false,
            upscale: false,
        }))
        .pipe(gulp.dest('./src/images/temp'))
));

gulp.task('imagemin-s-png', ['clean-s-folder', 's-png'], () => (
    gulp.src(['./src/images/temp/*.png'])
        .pipe(imagemin())
        .pipe(gulp.dest('./src/images/s'))
));

gulp.task('clean-temp-folder-s', ['clean-s-folder', 's-png', 'imagemin-s-png'], () => (
    del([
        './src/images/temp/*.*',
        '!./src/images/temp/.gitkeep',
    ])
));

gulp.task('images-m', ['clean-m-folder', 'm-jpg', 'm-png', 'imagemin-m-png', 'clean-temp-folder-m']);
gulp.task('images-s', ['clean-s-folder', 's-jpg', 's-png', 'imagemin-s-png', 'clean-temp-folder-s']);
