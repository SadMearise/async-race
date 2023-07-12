const del = require("del");
const zipPlugin = require("gulp-zip");

module.exports = zip = () => {
  del(`./${app.path.rootFolder}.zip`);
  return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "ZIP",
        message: "Error: <%= error.message %>"
      }))
    )
    .pipe(zipPlugin(`${app.path.rootFolder}.zip`))
    .pipe(app.gulp.dest("./"));
}
