import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import rename from "gulp-rename";
import squoosh from "gulp-libsquoosh";
import svgo from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import del from "del";
import browser from "browser-sync";

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Html

const html = () => {
  return gulp.src("source/*.html").pipe(gulp.dest("build"));
};

// Scripts

const scripts = () => {
  return gulp
    .src('source/js/app.js')
    .pipe(gulp.dest("build/js"))
    .pipe(browser.stream());
};

// Images

const optimizeImg = () => {
  return gulp
    .src(["source/img/*.{png,jpg}"])
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"));
};

const optimizeBackground = () => {
  return gulp
    .src("source/img/background-house/*.{png,jpg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img/background-house"));
};

const optimizeGreyBackground = () => {
  return gulp
    .src("source/img/grey-background/*.{png,jpg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img/grey-background"));
};

const optimizeHand = () => {
  return gulp
    .src("source/img/hand-with-phone/*.{png,jpg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img/hand-with-phone"));
};

const optimizeIphone = () => {
  return gulp
    .src("source/img/iPhone-screen/*.{png,jpg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img/iPhone-screen"));
};

const optimizeGallery = () => {
  return gulp
    .src("source/img/photos-gallery/*.{png,jpg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img/photos-gallery"));
};

const optimizeAllImages = gulp.parallel(
    optimizeImg,
    optimizeBackground,
    optimizeGreyBackground,
    optimizeHand,
    optimizeIphone,
    optimizeGallery
  );

// Copy Images

const copyImg = () => {
  return gulp.src("source/img/*.{png,jpg}").pipe(gulp.dest("build/img"));
};

const copyBackground = () => {
  return gulp
    .src("source/img/background-house/*.{png,jpg}")
    .pipe(gulp.dest("build/img/background-house"));
};

const copyGreyBackground = () => {
  return gulp
    .src("source/img/grey-background/*.{png,jpg}")
    .pipe(gulp.dest("build/img/grey-background"));
};

const copyHand = () => {
  return gulp
    .src("source/img/hand-with-phone/*.{png,jpg}")
    .pipe(gulp.dest("build/img/hand-with-phone"));
};

const copyIphone = () => {
  return gulp
    .src("source/img/iPhone-screen/*.{png,jpg}")
    .pipe(gulp.dest("build/img/iPhone-screen"));
};

const copyGallery = () => {
  return gulp
    .src("source/img/photos-gallery/*.{png,jpg}")
    .pipe(gulp.dest("build/img/photos-gallery"));
};

const copyImages = gulp.parallel(
    copyImg,
    copyBackground,
    copyGreyBackground,
    copyHand,
    copyIphone,
    copyGallery
  );

// WebP

const createWebpImg = () => {
  return gulp
    .src(["source/img/*.{png,jpg}"])
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img"));
};

const createWebpHand = () => {
  return gulp
    .src("source/img/hand-with-phone/*.{png,jpg}")
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img/hand-with-phone"));
};

const createWebpIphone = () => {
  return gulp
    .src("source/img/iPhone-screen/*.{png,jpg}")
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img/iPhone-screen"));
};

const createWebpGallery = () => {
  return gulp
    .src("source/img/photos-gallery/*.{png,jpg}")
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img/photos-gallery"));
};

const createAllWebp = gulp.parallel(
    createWebpImg,
    createWebpHand,
    createWebpIphone,
    createWebpGallery
  );

// SVG

const svg = () =>
  gulp
    .src(["source/img/*.svg", "!source/img/sprite/*.svg"])
    .pipe(svgo())
    .pipe(gulp.dest("build/img"));

const sprite = () => {
  return gulp
    .src("source/img/sprite/*.svg")
    .pipe(svgo())
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

// Copy

const copyIco = (done) => {
  gulp
    .src(["source/*.ico"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
  done();
};

const copyFonts = (done) => {
  gulp
    .src("source/fonts/*.{woff2,woff}")
    .pipe(gulp.dest("build/fonts"));
  done();
};

const copyFavicons = (done) => {
  gulp
    .src("source/img/favicons/*.{png,svg}")
    .pipe(gulp.dest("build/img/favicons"));
  done();
};

const copy = gulp.parallel(copyIco, copyFonts, copyFavicons);


// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Reload

const reload = (done) => {
  browser.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", browser.reload);
  gulp.watch("source/*.html", gulp.series(html, reload));
};

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeAllImages,
  gulp.parallel(styles, html, scripts, svg, sprite, createAllWebp)
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(styles, html, scripts, svg, sprite, createAllWebp),
  gulp.series(server, watcher)
);
