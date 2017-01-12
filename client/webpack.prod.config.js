const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

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
    vendorCommon: ['react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-helmet'],
    vendorApp: ['react-modal', 'hammerjs', 'react-helmet', 'redux-thunk', 'seamless-immutable', 'normalizr'],
    vendorAdmin: ['react-bootstrap', 'immutability-helper', 'redux-form'],
    app: ['./src/js/app.jsx'],
    admin: ['./src-admin/js/app-admin.jsx'],
  },

  output: {
    path: './build',
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
              query: {
                importLoaders: 3,
                minimize: true,
                // Even if disabled sourceMaps gets generated
                sourceMap: false,
              },
            },
            { loader: 'postcss-loader' },
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
              babelrc: false,
              compact: true,
              plugins: ['lodash'],
              presets: [
                [
                  'es2015', { modules: false },
                ],
                'stage-2',
                'react',
              ],
            },
          },
        ],
      },
      {
        test: /\.(svg|ttf|woff|woff2|eot)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
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
              limit: 5000,
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
    /* new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
    }),*/
    // new LodashModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Touhou | Comiket',
      template: './src/my-index.ejs',
      chunks: ['vendorCommon', 'app', 'vendorApp'],
      filename: 'index.html',
      inject: 'body',
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['vendorCommon', 'vendorApp', 'app'];
        return chunksSortModeExp(chunk1, chunk2, orders);
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Admin | Touhou-test',
      template: './src-admin/admin-index.ejs',
      chunks: ['vendorCommon', 'vendorAdmin', 'admin'],
      filename: 'admin.html',
      inject: 'body',
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['vendorCommon', 'vendorAdmin', 'admin'];
        return chunksSortModeExp(chunk1, chunk2, orders);
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendorAdmin', 'vendorApp', 'vendorCommon', 'manifest'],
      minChunks: Infinity,
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        /**
         * resolve-url-loader fix
         * @reference https://github.com/bholloway/resolve-url-loader/issues/33#issuecomment-249830601
         */
        context: 'src',
        output: {
          path: 'build',
        },
        /**
         * Legacy postCSS config
         * @reference https://github.com/azat-io/webpack2-css-modules-demo/blob/master/scripts/webpack.config.babel.js
         */
        postcss: [
          autoprefixer({
            browsers: ['last 2 versions', 'IE > 10'],
          }),
        ],
      },
    }),
    new ExtractTextPlugin({
      filename: '[hash].[name].css',
      allChunks: true,
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};
