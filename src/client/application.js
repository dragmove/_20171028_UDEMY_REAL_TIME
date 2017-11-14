import './application.scss';
import * as services from './services';

// playground
services.server
  .emitAction$('login', {username: 'foo', password: 'bar'}) // get ReplaySubject(1)
  .subscribe(result => {
    console.log('result :', result);

    if (result.error) {
      console.error(result.error);

    } else {
      console.log(`We're logged in.`);
    }
  });


// auth


// components


// bootstrap
services.socket.connect();