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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);

var _express = __webpack_require__(4);

var _express2 = _interopRequireDefault(_express);

var _http = __webpack_require__(5);

var _http2 = _interopRequireDefault(_http);

var _socket = __webpack_require__(6);

var _socket2 = _interopRequireDefault(_socket);

var _chalk = __webpack_require__(7);

var _chalk2 = _interopRequireDefault(_chalk);

var _rxjs = __webpack_require__(0);

var _observableSocket = __webpack_require__(8);

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
  var webpackMiddleware = __webpack_require__(9),
      webpackHotMiddleware = __webpack_require__(10),
      webpack = __webpack_require__(1),
      clientConfig = __webpack_require__(11);

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

  var client = new _observableSocket.ObservableSocket(socket);

  client.onAction('login', function (creds) {
    // throw clientMessage('user not logged in');
    // return {user: creds.username};

    return _rxjs.Observable.of('user: ' + creds.username).delay(3000);
    // throw new Error('whoa');
  });
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
/* 3 */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableSocket = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.clientMessage = clientMessage;

var _rxjs = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function clientMessage(message) {
  var error = new Error(message);
  error.clientMessage = message;

  return error;
}

var ObservableSocket = exports.ObservableSocket = function () {
  _createClass(ObservableSocket, [{
    key: 'isConnected',
    get: function get() {
      return this._state.isConnected;
    }
  }, {
    key: 'isReconnecting',
    get: function get() {
      return this._state.isReconnecting;
    }
  }, {
    key: 'isTotallyDead',
    get: function get() {
      return !this.isConnected && !this.isReconnecting;
    }
  }]);

  function ObservableSocket(socket) {
    var _this = this;

    _classCallCheck(this, ObservableSocket);

    this._socket = socket;

    this._state = {};

    this._actionCallbacks = {};

    this._requests = {};

    this._nextRequestId = 0;

    this.status$ = _rxjs.Observable.merge(this.on$('connect').map(function () {
      return { isConnected: true };
    }), this.on$('disconnect').map(function () {
      return { isConnected: false };
    }), this.on$('reconnecting').map(function (attempt) {
      return { isConnected: false, isReconnecting: true, attempt: attempt };
    }), this.on$('reconnect_failed').map(function () {
      return { isConnected: false, isReconnecting: false };
    })).publishReplay(1).refCount();

    this.status$.subscribe(function (state) {
      return _this._state = state;
    });
  }

  // basic wrappers


  _createClass(ObservableSocket, [{
    key: 'on$',
    value: function on$(event) {
      return _rxjs.Observable.fromEvent(this._socket, event);
    }
  }, {
    key: 'on',
    value: function on(event, callback) {
      this._socket.on(event, callback);
    }
  }, {
    key: 'off',
    value: function off(event, callback) {
      this._socket.off(event, callback);
    }
  }, {
    key: 'emit',
    value: function emit(event, arg) {
      this._socket.emit(event, arg);
    }

    // emit (client side)

  }, {
    key: 'emitAction$',
    value: function emitAction$(action, arg) {
      var id = this._nextRequestId++;

      console.log('client side. action, arg :', action, arg);

      this._registerCallbacks(action);

      var subject = this._requests[id] = new _rxjs.ReplaySubject(1);

      this._socket.emit(action, arg, id);

      return subject;
    }
  }, {
    key: '_registerCallbacks',
    value: function _registerCallbacks(action) {
      var _this2 = this;

      // login(username) -> emit('login') -> server -> emit('login', {data}) -> client

      // client.emit('login', {args}, requestId);

      if (this._actionCallbacks.hasOwnProperty(action)) return;

      this._socket.on(action, function (arg, id) {
        var request = _this2._popRequest(id);
        if (!request) return;

        console.log('request :', request);

        request.next(arg);
        request.complete();
      });

      this._socket.on(action + ':fail', function (arg, id) {
        var request = _this2._popRequest(id);
        if (!request) return;

        request.error(arg);
      });

      this._actionCallbacks[action] = true;
    }
  }, {
    key: '_popRequest',
    value: function _popRequest(id) {
      if (!this._requests.hasOwnProperty(id)) {
        console.error('Event with id ' + id + ' was returned twice, or the server did not send back an id');
        return;
      }

      var request = this._requests[id];

      delete this._requests[id];

      return request;
    }

    // on (server side)

  }, {
    key: 'onAction',
    value: function onAction(action, callback) {
      var _this3 = this;

      this._socket.on(action, function (arg, requestId) {
        console.log('action :', action);
        console.log('arg :', arg);
        console.log('requestId :', requestId);

        try {
          var value = callback(arg);

          if (!value) {
            _this3._socket.emit(action, null, requestId);
            return;
          }

          if (typeof value.subscribe !== 'function') {
            console.log('value.subscribe :', value.subscribe);

            _this3._socket.emit(action, value, requestId);
            return;
          }

          var hasValue = false;
          value.subscribe({
            next: function next(item) {
              if (hasValue) {
                throw new Error('Action ' + action + ' produced more than one value.');
              }

              _this3._socket.emit(action, item, requestId);

              hasValue = true;
            },

            error: function error(_error) {
              _this3._emitError(action, requestId, _error);

              console.error(_error.stack || _error);
            },

            complete: function complete() {
              if (!hasValue) {
                _this3._socket.emit(action, null, requestId);
              }
            }
          });
        } catch (error) {
          if (typeof requestId !== 'undefined') {
            _this3._emitError(action, requestId, error);
          }

          console.error(error.stack || error);
        }
      });
    }
  }, {
    key: '_emitError',
    value: function _emitError(action, id, error) {
      var message = error & error.clientMessage || 'Fatal Error';
      this._socket.emit(action + ':fail', { message: message }, id);
    }
  }]);

  return ObservableSocket;
}();

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("webpack-hot-middleware");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var path = __webpack_require__(12),
    webpack = __webpack_require__(1),
    ExtractTextPlugin = __webpack_require__(13),
    dirname = path.resolve('./');

var vendorModules = ['jquery', 'lodash', 'socket.io-client', 'rxjs'];

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
/* 12 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("extract-text-webpack-plugin");

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map