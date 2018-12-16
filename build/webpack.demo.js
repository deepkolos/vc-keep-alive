const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base');
const pkgs = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(env = {}) {
  const IS_PROD = !!env.prod;
  base.entry = './demo/main.js';
  base.devtool = IS_PROD ? false : 'source-map';
  base.mode = IS_PROD ? 'production' : 'development';

  base.optimization = {
    minimize: IS_PROD,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: !IS_PROD
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  };

  base.devServer = {
    contentBase: path.resolve(__dirname, '../dist'),
    compress: false,
    host: '0.0.0.0',
    quiet: true,
    port: 1107,
    hot: true
  };

  base.output = {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/vc-keep-alive/',
    filename: '[name].[hash:6].js',
    chunkFilename: '[name].bundle.[hash:6].js'
  };

  base.plugins = [
    ...base.plugins,
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../demo/index.html'),
      inject: true,
      cache: false,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      }
    }),
    new webpack.DefinePlugin({
      'process.VERSION': JSON.stringify(pkgs.version),
      'process.env.NODE_ENV': JSON.stringify(
        IS_PROD ? 'production' : 'development'
      )
    }),
    new webpack.HotModuleReplacementPlugin()
  ];

  return base;
};
