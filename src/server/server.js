import 'source-map-support/register';

import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import chalk from 'chalk';
import {Observable} from 'rxjs';

import 'shared/operators';
import {ObservableSocket, clientMessage} from 'shared/observable-socket';

import {UsersModule} from './modules/users';
import {PlaylistModule} from './modules/playlist';
import {ChatModule} from './modules/chat';

const isDevelopment = process.env.NODE_ENV !== 'production';

/*
 * socket
 */
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

/*
 * client webpack
 */
if (process.env.USE_WEBPACK === 'true') {
  var webpackMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpack = require('webpack'),
    clientConfig = require('../../webpack.client.config');

  const compiler = webpack(clientConfig(true));

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

  console.log(chalk.bgRed('Using Webpack Dev MiddleWare. this is for dev only.'));
}

/*
 * configure Express
 */
app.set('view engine', 'pug');

app.use(express.static('public'));

const useExternalStyles = !isDevelopment;

app.get('/', (req, res) => {
  res.render('index', {
    useExternalStyles
  });
});

/*
 * services
 */
const videoServices = [];
const playlistRepository = {};


/*
 * modules
 */
const users = new UsersModule(io);
const chat = new ChatModule(io, users);
const playlist = new PlaylistModule(io, users, playlistRepository, videoServices);

const modules = [users, chat, playlist];


/*
 * socket
 */
io.on('connection', socket => {
  console.log(`Got connection from ${socket.request.connection.remoteAddress}`);

  const client = new ObservableSocket(socket);

  for (let mod of modules) {
    mod.registerClient(client);
  }

  for (let mod of modules) {
    mod.clientRegistered(client);
  }

  /*
   client.onAction('login', creds => {
   // throw clientMessage('user not logged in');
   // return {user: creds.username};
   // return Observable.of(`user: ${creds.username}`).delay(3000);
   throw new Error('whoa');
   });
   */
});

/*
 * start up
 */
const port = process.env.port || 3000;

function startServer() {
  server.listen(port, () => {
    console.log(`Started http server on ${port}`);
  });
}

Observable.merge(...modules.map(m => m.init$()))
  .subscribe({
    complete() {
      startServer();
    },

    error(err) {
      console.error(`Could not init module: ${err.stack || err}`);
    }
  });

// startServer();