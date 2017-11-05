var path = require('path'),
  dirname = path.resolve('./');

function createConfig(isDebug) {
  const devTool = (isDebug) ? 'eval-source-map' : 'source-map';

  const plugins = [];

  const cssLoader = {
    test: /\.css$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
    ]
  };

  const sassLoader = {
    test: /\.scss$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      { loader: "sass-loader" },
    ]
  };

  const appEntry = ['./src/client/application.js'];

  return {
    devtool: devTool,
    entry: {
      application: appEntry
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
          test: '/\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot|svg)/',
          loader: 'url-loader?limit=512'
        },

        cssLoader,
        sassLoader
      ]

      /*
       loaders: [
       {test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/},
       {test: /\.jsx?$/, loaders: ['eslint-loader'], exclude: /node_modules/}
       ]
       */
    },
  };
}

module.exports = createConfig;