const svgSprite = require("gulp-svg-sprite");

module.exports = function sprite() {
  return app.gulp.src(app.path.src.svgicons)
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "SVG",
        message: "Error: <%= error.message %>"
      }))
    )
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../img/icons/icons.svg',
        }
      },
      shape: {
        id: {
          separator: '',
          generator: 'svg-'
        },
        transform: [
          {
            svgo: {
              plugins: [
                {
                  removeXMLNS: true
                },
                {
                  convertPathData: false
                },
                {
                  removeViewBox: false
                },
                {
                  removeAttrs: {
                    attrs: '(fill|stroke|style)'
                  }
                }
              ]
            }
          }
        ]
      },
      svg: {
        rootAttributes: {
          style: 'display: none;',
          'aria-hidden': true
        },
        xmlDeclaration: false
      }
    }))
    .pipe(app.gulp.dest(app.path.srcFolder));
}
