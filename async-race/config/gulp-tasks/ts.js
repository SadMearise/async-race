const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("../webpack.config.js");

module.exports = function ts() {
  return app.gulp
    .src(app.path.src.ts)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "TS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(app.gulp.dest(app.path.build.js));
};
