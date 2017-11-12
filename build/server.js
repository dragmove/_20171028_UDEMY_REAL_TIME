/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);

var _express = __webpack_require__(3);

var _express2 = _interopRequireDefault(_express);

var _http = __webpack_require__(4);

var _http2 = _interopRequireDefault(_http);

var _socket = __webpack_require__(5);

var _socket2 = _interopRequireDefault(_socket);

var _chalk = __webpack_require__(6);

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDevelopment = process.env.NODE_ENV !== 'production';

/*
 * socket
 */
var app = (0, _express2.default)();
var server = new _http2.default.Server(app);
var io = (0, _socket2.default)(server);

/*
 * client webpack
 */
if (process.env.USE_WEBPACK === 'true') {
  var webpackMiddleware = __webpack_require__(7),
      webpackHotMiddleware = __webpack_require__(11),
      webpack = __webpack_require__(0),
      clientConfig = __webpack_require__(8);

  var compiler = webpack(clientConfig(true));

  app.use(webpackMiddleware(compiler, {
    publicPath: '/build/',
    stats: {
      colors: true,
      chunks: false,
      assets: false,
      timings: false,
      modules: false,
      hash: false,
      version: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));

  console.log(_chalk2.default.bgRed('Using Webpack Dev MiddleWare. this is for dev only.'));
}

/*
 * configure Express
 */
app.set('view engine', 'pug');
app.use(_express2.default.static('public'));

var useExternalStyles = !isDevelopment;

app.get('/', function (req, res) {
  res.render('index', {
    useExternalStyles: useExternalStyles
  });
});

/*
 * modules
 */

/*
 * socket
 */
io.on('connection', function (socket) {
  console.log('Got connection from ' + socket.request.connection.remoteAddress);
});

/*
 * start up
 */
var port = process.env.port || 3000;

function startServer() {
  server.listen(port, function () {
    console.log('Started http server on ' + port);
  });
}

startServer();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var path = __webpack_require__(9),
    webpack = __webpack_require__(0),
    ExtractTextPlugin = __webpack_require__(10),
    dirname = path.resolve('./');

var vendorModules = ['jquery', 'lodash'];

function createConfig(isDebug) {
  var devTool = isDebug ? 'eval-source-map' : 'source-map';

  var plugins = [new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js'
  })];

  var cssLoader = {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }]
  };

  var sassLoader = {
    test: /\.scss$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
  };

  var appEntry = ['./src/client/application.js'];

  if (!isDebug) {
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
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }, {
        test: /\.(gif|png|jpg|jpeg)$/,
        use: [{
          loader: 'file-loader'
        }]
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        use: [{
          loader: 'url-loader'
        }]
      }, cssLoader, sassLoader]
    },
    plugins: plugins
  };
}

module.exports = createConfig;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("extract-text-webpack-plugin");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("webpack-hot-middleware");

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map