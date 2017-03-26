const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const processEnv = require('./webpack.env');

const BASE_URL = process.env.BASEURL || 'http://touhou-jsx.dev';

function chunksSortModeExp(chunk1, chunk2, orders) {
  const order1 = orders.indexOf(chunk1.names[0]);
  const order2 = orders.indexOf(chunk2.names[0]);
  if (order1 > order2) {
    return 1;
  } else if (order1 < order2) {
    return -1;
  }
  return 0;
}

module.exports = {

  entry: {
    common: [
      'normalizr',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-form',
      'redux-thunk',
      'seamless-immutable',
      'csstips',
      'csx',
      'typestyle',
    ],
    vendorApp: [
      'hammerjs', 'react-helmet', 'react-modal',
    ],
    vendorAdmin: [
      'flat', 'qs', 'react-bootstrap', 'react-progress-bar-plus', 'react-router-bootstrap', 'time-stamp',
    ],
    app: ['./src/js/app.jsx'],
    admin: ['./src/js/app-admin.jsx'],
  },

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },

  resolve: {
    extensions: ['.jsx', '.js'],
    modules: ['node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              compact: true,
              plugins: ['lodash'],
              presets: [
                [
                  'env', {
                    targets: {
                      browsers: ['last 2 versions'],
                    },
                    loose: true, // ?
                    modules: false,
                    debug: true,
                  },
                ],
                'stage-2',
                'react',
              ],
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              name: 'img/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },

  recordsPath: path.join(__dirname, 'records.json'),

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Touhou Test - Do you know Touhou characters well? Check your skills!',
      baseurl: BASE_URL,
      template: './src/index.ejs',
      chunks: ['common', 'vendorApp', 'app'],
      filename: 'index.html',
      inject: 'body',
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['common', 'vendorApp', 'app'];
        return chunksSortModeExp(chunk1, chunk2, orders);
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Admin | Touhou-test',
      template: './src/index-admin.ejs',
      chunks: ['common', 'vendorAdmin', 'admin'],
      filename: 'admin.html',
      inject: 'body',
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['common', 'vendorAdmin', 'admin'];
        return chunksSortModeExp(chunk1, chunk2, orders);
      },
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest',
    }),
    new webpack.DefinePlugin(processEnv(BASE_URL)),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendorAdmin', 'vendorApp', 'common', 'manifest'],
      minChunks: Infinity,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};
