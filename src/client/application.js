import $ from 'jquery';

import 'shared/operators';

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
const $html = $('html');
services.usersStore.currentUser$
  .subscribe(user => {
    if(user.isLoggedIn) {
      $html.removeClass('not-logged-in');
      $html.addClass('logged-in');

    } else {
      $html.addClass('not-logged-in');
      $html.removeClass('logged-in');
    }
  });


// components
require('./components/player/player');
require('./components/users/users');
require('./components/chat/chat');
require('./components/playlist/playlist');


// bootstrap
services.socket.connect();

services.usersStore.currentUser$
  .subscribe(user => {
    console.log('user :', user);
  });

/*
// test login, logout
services.usersStore.login$('whoa')
  .subscribe((user) => {
    console.log('user :', user);
  });

window.setTimeout(() => {
  services.usersStore.logout$();
}, 3000);
*/

/*
 services.usersStore.state$.subscribe(state => {
 console.log('state :', state);
 });
 */

/*
 services.server
 .emitAction$('users:list')
 .subscribe(users => console.log(users));
 */