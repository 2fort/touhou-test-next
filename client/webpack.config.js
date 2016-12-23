const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

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
      './src-admin/js/app-admin.jsx',
    ],
  },

  output: {
    path: '/build',
    publicPath: '/',
    filename: '[hash].[name].js',
    // path: '/',
    // filename: 'apps/[name]/build/bundle.js',
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
        loader: ExtractTextPlugin.extract({
          loader: [
            {
              loader: 'css-loader',
              // current extract-text-plugin supports query not never options format
              query: {
                importLoaders: 3,
                minimize: true,
                // Even if disabled sourceMaps gets generated
                sourceMap: false,
              },
            },
            { loader: 'resolve-url-loader' },
            {
              loader: 'sass-loader',
              query: {
                // Enable sourcemaps for resolve-url-loader to work properly
                sourceMap: true,
              },
            },
          ],
        }),
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
        test: /\.(svg|ttf|woff|woff2|eot)$/,
        // exclude: /node_modules(?!\/bootstrap)/, // exclude node_modules except bootstrap
        exclude: /node_modules/,
        // exclude: /node_modules(?!\/font-awesome)/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
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
    new LodashModuleReplacementPlugin,
    new HtmlWebpackPlugin({
      title: 'Touhou | Comiket',
      template: './src/my-index.ejs',
      chunks: ['dev', 'app'],
      filename: 'index.html',
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      title: 'Admin | Touhou-test',
      template: './src-admin/admin-index.ejs',
      chunks: ['dev', 'admin'],
      filename: 'admin/index.html',
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin({
      filename: '[contenthash].[name].css',
    }),
  ],

  devtool: 'cheap-module-eval-source-map',

  // devtool: 'source-map',
  performance: { hints: false },

  devServer: {
    hot: true,
    contentBase: '/build',
    publicPath: '/',
    historyApiFallback: true,
    stats: 'minimal',
    port: 8081,
    /* proxy: {
      '/admin': {
        target: {
          host: 'localhost',
          protocol: 'http:',
          port: 8081,
        },
        // ignorePath: true,
        // changeOrigin: true,
        secure: false,
        bypass: (req, res, proxyOptions) => {
          return '/admin';
        },
      },
    },*/
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
