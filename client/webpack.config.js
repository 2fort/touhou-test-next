const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString();

const BASE_URL = 'http://localhost';

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
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'resolve-url-loader',
            options: {
              silent: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'resolve-url-loader',
            options: {
              silent: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
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
        test: /\.(ttf|woff|woff2|eot)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
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
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'json-loader',
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Touhou Test - Do you know Touhou characters well? Test your skills!',
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
      'process.commitHash': {
        COMMIT_HASH: JSON.stringify(commitHash),
      },
      'process.config': {
        BASE_URL: JSON.stringify(BASE_URL),
        IMG_ORIG: JSON.stringify('/images/l/'),
        IMG_COMPRESSED: JSON.stringify('/images/m/'),
        IMG_THUMBNAIL: JSON.stringify('/images/s/'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
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
    proxy: {
      '/images': {
        target: {
          host: 'localhost',
          protocol: 'http:',
          port: 8082,
        },
      },
      '/api': {
        target: {
          host: 'localhost',
          protocol: 'http:',
          port: 8082,
        },
      },
    },
  },
};
