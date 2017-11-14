import './application.scss';
import * as services from './services';

// playground
services.server.on$('test')
  .map(d => d + ' whoa')
  .subscribe(item => {
    console.log(`Got ${item} from server!`);
  });

services.server.status$.subscribe(status => console.log(status));


// auth


// components


// bootstrap
services.socket.connect();