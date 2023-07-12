const requireDir = require("require-dir");
const tasks = requireDir("./config/gulp-tasks");

const gulp = require("gulp");
const plugins = require("./config/gulp-plugins.js");
const path = require("./config/gulp-settings.js");


global.app = {
  gulp: gulp,
  path: path,
  plugins: plugins,
  isProd: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
};

exports.ts = tasks.ts;
exports.html = tasks.html;
exports.css = tasks.css;
exports.images = tasks.images;
exports.reset = tasks.reset;
exports.sprite = tasks.sprite;
exports.zip = tasks.zip;

const fonts = gulp.series(tasks.fonts.otfToTtf, tasks.fonts.ttfToWoff, tasks.fonts.fonstStyle);
const devTasks = gulp.series(tasks.reset, fonts, tasks.html);
const buildTasks = gulp.series(tasks.reset, fonts, tasks.css, tasks.ts, gulp.parallel(tasks.html, tasks.images));

const development = gulp.series(devTasks);
const build = gulp.series(buildTasks);
const deployZIP = gulp.series(buildTasks, tasks.zip);

exports.development = development;
exports.build = build;
exports.deployZIP = deployZIP;

gulp.task('default', development);
