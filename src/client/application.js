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


// bootstrap
services.socket.connect();