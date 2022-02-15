const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const processEnv = require('./webpack.env');

const NODE_ENV = process.env.NODE_ENV || 'development';
const BASE_URL = process.env.BASEURL || 'http://localhost';

module.exports = {
  entry: {
    dev: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8081',
      'webpack/hot/only-dev-server',
    ],
    app: [
      './src/js/app.jsx',
    ],
    admin: [
      './src/js/app-admin.jsx',
    ],
  },

  output: {
    path: '/build',
    publicPath: '/',
    filename: '[hash].[name].js',
  },

  resolve: {
    extensions: ['.jsx', '.js'],
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
              cacheDirectory: true,
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
              limit: 40000,
              name: 'img/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Touhou Test - Do you know Touhou characters well? Check your skills!',
      baseurl: BASE_URL,
      template: './src/index.ejs',
      chunks: ['dev', 'app'],
      filename: 'index.html',
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      title: 'Admin | Touhou-test',
      template: './src/index-admin.ejs',
      chunks: ['dev', 'admin'],
      filename: 'admin.html',
      inject: 'body',
    }),
    new webpack.DefinePlugin(processEnv(NODE_ENV, BASE_URL)),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([
      { from: 'public/**/*' },
    ]),
  ],

  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',

  performance: { hints: false },

  devServer: {
    hot: true,
    contentBase: '/build',
    publicPath: '/',
    historyApiFallback: {
      index: '/',
      rewrites: [
        { from: /\/admin/, to: '/admin.html' },
      ],
    },
    stats: 'minimal',
    port: 8081,
  },
};
