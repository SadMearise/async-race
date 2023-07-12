const CopyPlugin = require('copy-webpack-plugin');
const FileIncludeWebpackPlugin = require('file-include-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const ESLintPlugin = require('eslint-webpack-plugin');

const path = require('path');

const srcFolder = 'src';
const buildFolder = 'dist';

const isProd = process.argv.includes('--build');
const isDev = !isProd;

const paths = {
  src: path.resolve(srcFolder),
  build: path.resolve(buildFolder),
};

const optimization = () => {
  if (isProd) {
    const options = {
      splitChunks: {
        chunks: 'all',
      },
    };
    options.minimizer = [
      new TerserWebpackPlugin({
        extractComments: false,
      }),
      new CssMinimizerWebpackPlugin(),
    ];
    return options;
  }
};

const cache = () => {
  if (isProd) {
    const options = {
      type: 'filesystem',
    };
    return options;
  }
};

const copyPluginPatterns = () => {
  const base = {
    patterns: [
      {
        from: `${paths.src}/assets`,
        to: 'assets',
        noErrorOnMissing: true,
        force: true,
      },
      {
        from: `./favicon.ico`,
        to: './',
        noErrorOnMissing: true,
      },
    ],
  };

  if (isDev) {
    base.patterns.push({
      from: `${paths.src}/img`,
      to: 'img',
      noErrorOnMissing: true,
    });
  }

  return base;
};

module.exports = {
  mode: isDev ? 'development' : 'production',
  cache: cache(),
  devtool: isDev ? 'inline-source-map' : false,
  entry: {
    index: `${paths.src}/ts/index.ts`,
  },
  output: {
    path: `${paths.build}`,
    filename: 'js/[name].min.js',
    publicPath: '/',
  },
  optimization: optimization(),
  devServer: {
    static: paths.build,
    open: {
      app: {
        name: 'chrome',
      },
    },
    watchFiles: [`${paths.src}/**/*.html`, `${paths.src}/**/*.htm`],
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'string-replace-loader',
            options: {
              search: '@img',
              replace: '../img',
              flags: 'g',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 0,
              sourceMap: false,
              modules: false,
              url: {
                filter: (url) => {
                  if (url.includes('img') || url.includes('fonts')) {
                    return false;
                  }
                  return true;
                },
              },
            },
          },
          {
            loader: 'group-css-media-queries-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        include: [path.resolve(__dirname, '../src/ts/')],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new FileIncludeWebpackPlugin({
      source: srcFolder,
      replace: [
        { regex: '../img', to: 'img' },
        { regex: '@img', to: 'img' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: './css/[name].min.css',
    }),
    new CopyPlugin(copyPluginPatterns()),
    new RemoveEmptyScriptsPlugin(),
    new ESLintPlugin(),
  ],
  resolve: {
    alias: {
      '@scss': `${paths.src}/scss`,
      '@ts': `${paths.src}/ts`,
      '@img': `${paths.src}/img`,
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
};
