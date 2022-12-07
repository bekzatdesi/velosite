const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require('browser-sync').create();

//Плагины
const del = require('del');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const group_media = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const imagemin = require("gulp-imagemin");


//Оброботка html
const html = () => {
    return src("src/*.html")
    .pipe(fileinclude())
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

//Оброботка scss
const styles = () => {
    return src("src/scss/style.scss")
    .pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError))
    .pipe(group_media())
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        })
    )
    .pipe(dest("dist/css"))
    .pipe(scss({ outputStyle: 'compressed' }).on('error', scss.logError))
    .pipe(rename({extname: ".min.css"}))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

//Оброботка js
const js = () => {
    return src("src/js/script.js")
    .pipe(fileinclude())
    .pipe(dest("dist/js/"))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(dest("dist/js/"))
    .pipe(browserSync.stream());
}

//Оброботка img
const imager = () => {
    return src("src/img/**/*")
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
    .pipe(dest("dist/img"))
    .pipe(browserSync.stream());
}


//Оброботка fonts
const fonter = () => {
    return src("src/fonts/**/*")
    .pipe(dest("dist/fonts"))
    .pipe(browserSync.stream());
}

//Удаления директори
const clear = () => {
    return del("dist/");
}

//Сервер
const server = () => {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
}


//Наблюдения
const watcher = () => {
    watch("src/**/*.html", html);
    watch("src/scss/*.scss", styles);
    watch("src/js/*.js", js);
    watch("src/img/**/*", imager);
    watch("src/fonts/**/*", fonter);
}

//Задачу
exports.html=html;
exports.watch=watcher;
exports.clear=clear;
exports.styles=styles;
exports.js=js;
exports.imager=imager;
exports.fonter=fonter;


exports.default = series(
    clear,
    parallel(html, styles, js, imager, fonter),
    parallel(watcher, server)
);