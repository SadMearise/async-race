const del = require("del");

module.exports = function reset() {
  return del(app.path.clean);
};
