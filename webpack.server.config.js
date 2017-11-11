var path = require('path'),
  fs = require('fs'),
  webpack = require('webpack');

const nodeModules = fs.readdirSync("./node_modules").filter(d => d != ".bin");
function ignoreNodeModules(context, request, callback) {
  if (request[0] == ".")
    return callback();

  const module = request.split("/")[0];
  if (nodeModules.indexOf(module) !== -1) {
    return callback(null, "commonjs " + request);
  }

  return callback();
}

function createConfig(isDebug) {
  let plugins = [
    new webpack.LoaderOptionsPlugin({
      options: {
        create: createConfig
      }
    })
  ];

  if(!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }));
  }

  return {
    context: __dirname,

    target: 'node',

    entry: './src/server/server.js',

    output: {
      filename: 'server.js',
      path: path.join(__dirname, 'build')
    },

    resolve: {
      alias: {
        shared: path.join(__dirname, 'src', 'shared')
      }
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              ["env", {
                "modules": false
              }]
            ]
          }
        },

        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        }
      ]

      /*
      loaders: [
        {test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/},
        {test: /\.jsx?$/, loaders: ['eslint-loader'], exclude: /node_modules/}
      ]
      */
    },

    // https://webpack.js.org/configuration/devtool/
    devtool: 'source-map',

    externals: [ignoreNodeModules],

    plugins: plugins
  };
}

module.exports = createConfig;
