const webpcss = require('gulp-webpcss');
const autoprefixer = require('gulp-autoprefixer');

module.exports = function css() {
  return app.gulp.src(`${app.path.build.css}*.css`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "CSS",
        message: "Error: <%= error.message %>"
      })))
    .pipe(
      app.plugins.if(
        app.isProd,
        autoprefixer({
          grid: true,
          cascade: true
        })
      )
    )
    .pipe(
      app.plugins.if(
        app.isProd,
        webpcss(
          {
            webpClass: ".webp",
            noWebpClass: ".no-webp"
          }
        )
      )
    )
    .pipe(app.gulp.dest(app.path.build.css));
}
