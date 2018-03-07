/**
 * Created Date: 2018/3/1
 * Author: luojinghui
 */
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [
            require.resolve('babel-preset-es2015')
          ]
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {importLoaders: 1}},
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  watch: true
};