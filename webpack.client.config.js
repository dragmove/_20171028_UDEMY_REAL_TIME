var path = require('path'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  dirname = path.resolve('./');

const vendorModules = ['jquery', 'lodash', 'socket.io-client', 'rxjs'];

function createConfig(isDebug) {
  const devTool = (isDebug) ? 'eval-source-map' : 'source-map';

  const plugins = [new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js'
  })];

  let cssLoader = {
    test: /\.css$/,
    use: [
      {loader: "style-loader"},
      {loader: "css-loader"},
    ]
  };

  let sassLoader = {
    test: /\.scss$/,
    use: [
      {loader: "style-loader"},
      {loader: "css-loader"},
      {loader: "sass-loader"},
    ]
  };

  const appEntry = ['./src/client/application.js'];

  if(!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }));

    plugins.push(new ExtractTextPlugin('[name].css'));

    // cssLoader.loader = ExtractTextPlugin.extract('style', 'css');
    cssLoader = {
      test: /\.css$/,

      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader']
      })
    };

    // sassLoader.loader = ExtractTextPlugin.extract('style', 'css!sass');
    sassLoader = {
      test: /\.scss$/,

      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    };

  } else {
    plugins.push(new webpack.HotModuleReplacementPlugin());

    appEntry.splice(0, 0, 'webpack-hot-middleware/client');
  }

  return {
    devtool: devTool,
    entry: {
      application: appEntry,
      vendor: vendorModules
    },
    output: {
      filename: '[name].js',
      path: path.join(dirname, 'public', 'build'),
      publicPath: '/build/'
    },
    resolve: {
      alias: {
        shared: path.join(dirname, 'src', 'shared')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },

        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },

        {
          test: /\.(gif|png|jpg|jpeg)$/,
          use: [{
            loader: 'file-loader'
          }]
        },

        {
          test: /\.(woff|woff2|ttf|eot|svg)$/,
          use: [{
            loader: 'url-loader'
          }]
        },

        cssLoader,

        sassLoader
      ]
    },
    plugins: plugins
  };
}

module.exports = createConfig;