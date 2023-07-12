const nodePath = require("path");
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;
const srcFolder = `./src`;

module.exports = path = {
  build: {
    html: `${buildFolder}/`,
    js: `${buildFolder}`,
    assets: `${buildFolder}/assets/`,
    fonts: `${buildFolder}/fonts/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/img/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    ts: `${srcFolder}/ts/*.ts`,
    assets: `${srcFolder}/assets/**/*.*`,
    fonts: `${srcFolder}/fonts/*.*`,
    scss: `${srcFolder}/scss/main.scss`,
    images: `${srcFolder}/img/**/*.{jpg,png,svg,jpeg,gif,webp}`,
    svg: `${srcFolder}/img/**/*.svg`,
    svgicons: `${srcFolder}/svgicons/*.svg`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  rootFolder: rootFolder,
  srcFolder: srcFolder,
};
