const os = require('os');
const webpack = require('webpack');
const HappyPack = require('happypack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackProgressBar = require('progress-bar-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

var happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.css', '.scss'],
    alias: {
      page: '../demo/pages/',
      vue: 'vue/dist/vue.esm.js',
      'vc-keep-alive': '../src/install.js'
    }
  },
  plugins: [
    // common plugin
    new VueLoaderPlugin(),
    // new HardSourceWebpackPlugin(),
    WebpackProgressBar({
      format: '[:bar] :percent',
      clear: false,
      width: 50
    }),
    new HappyPack({
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: true
    }),

    // prod plugin
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:6].css',
      chunkFilename: '[id].[hash:6].css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [
          {
            // loader: 'babel-loader',
            loader: 'happypack/loader',
            options: {
              cacheDirectory: true
            }
          },
          'eslint-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformToRequire: {
            video: 'src'
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'fast-sass-loader'
        ]
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader',
        options: {
          // 放CDN有必要的
          name: '[name].[hash:6].[ext]',
          limit: 1024
        }
      }
    ]
  }
};
