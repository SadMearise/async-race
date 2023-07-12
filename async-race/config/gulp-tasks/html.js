const versionNumber = require("gulp-version-number");
const webpHtmlNosvg = require("gulp-webp-html-nosvg");

module.exports = function html() {
  return app.gulp.src(`${app.path.build.html}*.html`)
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "HTML",
        message: "Error: <%= error.message %>"
      }))
    )
    .pipe(app.plugins.replace(/@img\//g, 'img/'))
    .pipe(app.plugins.if(
      app.isProd, webpHtmlNosvg()
    )
    )
    .pipe(app.gulp.dest(app.path.build.html));
}
