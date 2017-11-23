import _ from 'lodash';
import {Observable} from 'rxjs';

import {ModuleBase} from '../lib/module';
import {validateLogin} from 'shared/validation/users';
import {fail} from 'shared/observable-socket';

const AuthContext = Symbol('AuthContext');

export class UsersModule extends ModuleBase {
  constructor(io) {
    super();

    this._io = io;

    this._userList = [];

    this._users = {};

    /*
     this._userList = [
     {name: 'Foo', color: this.getColorForUsername('Foo')},
     {name: 'Bar', color: this.getColorForUsername('Bar')},
     {name: 'Baz', color: this.getColorForUsername('Baz')}
     ];
     */
  }

  getColorForUsername(username) {
    let hash = _.reduce(username, (hash, ch) => ch.charCodeAt(0) + (hash << 6) + (hash << 16) - hash, 0);

    hash = Math.abs(hash);

    // these values are arbitrary.
    const hue = hash % 360,
      saturation = hash % 25 + 70,
      lightness = 100 - (hash % 15 + 35);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getUserForClient(client) {
    const auth = client[AuthContext];
    return (auth) ? auth : null;
  }

  loginClient$(client, username) {
    username = username.trim();

    const validator = validateLogin(username);

    if (!validator.isValid) return validator.throw$(); // Observable.throw({clientMessage: validator.message});

    if (this._users.hasOwnProperty(username)) {
      // return Observable.throw({clientMessage: '12345'});
      return fail(`Username ${username} is already taken`);
    }

    const auth = client[AuthContext] || (client[AuthContext] = {});
    if (auth.isLoggedIn) {
      return fail('You are already logged in');
    }

    auth.name = username;
    auth.color = this.getColorForUsername(username);
    auth.isLoggedIn = true;

    this._users[username] = client;
    this._userList.push(auth);

    this._io.emit('users:added', auth);
    console.log(`User ${username}`);

    return Observable.of(auth);
  }

  registerClient(client) {
    // client is an instance of ObservableSocket

    /*
     // test code
     let index = 0;
     setInterval(() => {
     const username = `New user ${index}`;
     const user = {name: username, color: this.getColorForUsername(username)};

     client.emit('users:added', user);

     index++;
     }, 5000);
     */

    client.onActions({
      'users:list': () => {
        return this._userList;
      },

      'auth:login': ({name}) => {
        return this.loginClient$(client, name);
      },

      'auth:logout': () => {
        //
      }
    });
  }
}