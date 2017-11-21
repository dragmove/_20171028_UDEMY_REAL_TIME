import './application.scss';
import * as services from './services';

// playground
services.server
  .emitAction$('login', {username: 'foo', password: 'bar'})
  .subscribe(user => {
    console.log(`We're logged in : ${user}`);

  }, error => {
    console.error(error);
  });


// auth


// components
require('./components/player/player');
require('./components/users/users');
require('./components/chat/chat');
require('./components/playlist/playlist');


// bootstrap
services.socket.connect();

services.server
  .emitAction$('users:list')
  .subscribe(users => console.log(users));