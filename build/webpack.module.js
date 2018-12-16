const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base');
const pkgs = require('../package.json');

module.exports = function() {
  base.entry = './src/install.js';

  base.devtool = 'source-map';
  base.mode = 'development';

  base.output = {
    path: path.resolve(__dirname, '../lib'),
    filename: 'vc-keep-alive.js',
    libraryExport: 'default',
    libraryTarget: 'umd'
  };

  base.plugins = [
    ...base.plugins,
    new webpack.DefinePlugin({
      'process.VERSION': JSON.stringify(pkgs.version),
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ];

  return base;
};
