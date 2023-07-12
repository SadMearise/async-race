const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const ifPlugin = require("gulp-if");
const rename = require("gulp-rename");
const newer = require("gulp-newer");
const replace = require("gulp-replace");

module.exports = plugins = {
  notify,
  if: ifPlugin,
  replace: replace,
  plumber,
  rename,
  newer,
};
