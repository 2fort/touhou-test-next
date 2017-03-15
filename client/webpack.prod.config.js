const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString();

const BASE_URL = 'http://touhou-jsx.dev';

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
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { autoprefixer: false, sourceMap: true, importLoaders: 1 },
            },
            'postcss-loader', 'resolve-url-loader', 'sass-loader'],
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

  recordsPath: 'records.json',

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Touhou Test - Do you know Touhou characters well? Test your skills!',
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
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
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendorAdmin', 'vendorApp', 'common', 'manifest'],
      minChunks: Infinity,
    }),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin({
      filename: '[hash].[name].css',
      allChunks: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};
