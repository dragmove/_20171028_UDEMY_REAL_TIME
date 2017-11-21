import {Observable, ReplaySubject} from 'rxjs';

export function clientMessage(message) {
  const error = new Error(message);
  error.clientMessage = message;

  return error;
}

export class ObservableSocket {
  get isConnected() {
    return this._state.isConnected;
  }

  get isReconnecting() {
    return this._state.isReconnecting;
  }

  get isTotallyDead() {
    return !this.isConnected && !this.isReconnecting;
  }

  constructor(socket) {
    this._socket = socket;

    this._state = {};

    this._actionCallbacks = {};

    this._requests = {};

    this._nextRequestId = 0;

    this.status$ = Observable.merge(
      this.on$('connect').map(() => ({isConnected: true})),
      this.on$('disconnect').map(() => ({isConnected: false})),
      this.on$('reconnecting').map(attempt => ({isConnected: false, isReconnecting: true, attempt})),
      this.on$('reconnect_failed').map(() => ({isConnected: false, isReconnecting: false})))
      .publishReplay(1)
      .refCount();

    this.status$.subscribe(state => this._state = state);
  }

  // basic wrappers
  on$(event) {
    return Observable.fromEvent(this._socket, event);
  }

  on(event, callback) {
    this._socket.on(event, callback);
  }

  off(event, callback) {
    this._socket.off(event, callback);
  }

  emit(event, arg) {
    this._socket.emit(event, arg);
  }

  // emit (client side)
  emitAction$(action, arg) {
    const id = this._nextRequestId++;

    console.log('client side. action, arg :', action, arg);

    this._registerCallbacks(action);

    const subject = this._requests[id] = new ReplaySubject(1);

    // emit event to server side
    this._socket.emit(action, arg, id);

    return subject;
  }

  _registerCallbacks(action) {
    // login(username) -> emit('login') -> server -> emit('login', {data}) -> client

    // client.emit('login', {args}, requestId);

    if (this._actionCallbacks.hasOwnProperty(action)) return;

    // get event from server side
    this._socket.on(action, (arg, id) => {
      const request = this._popRequest(id);
      if (!request) return;

      console.log('request :', request);

      request.next(arg);
      request.complete();
    });

    this._socket.on(`${action}:fail`, (arg, id) => {
      const request = this._popRequest(id);
      if (!request) return;

      request.error(arg);
    });

    this._actionCallbacks[action] = true;
  }

  _popRequest(id) {
    if (!this._requests.hasOwnProperty(id)) {
      console.error(`Event with id ${id} was returned twice, or the server did not send back an id`);
      return;
    }

    const request = this._requests[id];

    delete this._requests[id];

    return request;
  }

  // on (server side)
  onAction(action, callback) {

    // get event from client side
    this._socket.on(action, (arg, requestId) => {
      console.log('action :', action);
      console.log('arg :', arg);
      console.log('requestId :', requestId);

      try {
        const value = callback(arg);

        if(!value) {
          this._socket.emit(action, null, requestId);
          return;
        }

        if(typeof(value.subscribe) !== 'function') {
          console.log('value.subscribe from server side :', value.subscribe);
          
          this._socket.emit(action, value, requestId);
          return;
        }

        let hasValue = false;
        value.subscribe({
          next: (item) => {
            console.log('next item :', item);

            if(hasValue) {
              throw new Error(`Action ${action} produced more than one value.`);
            }

            this._socket.emit(action, item, requestId);

            hasValue = true;
          },

          error: (error) => {
            this._emitError(action, requestId, error);

            console.error(error.stack || error);
          },

          complete: () => {
            console.log('complete from server side');

            if(!hasValue) {
              this._socket.emit(action, null, requestId);
            }
          }
        });

      } catch (error) {
        if (typeof(requestId) !== 'undefined') {
          this._emitError(action, requestId, error);
        }

        console.error(error.stack || error);
      }
    });
  }

  onActions(actions) {
    for (let action in actions) {
      if(!actions.hasOwnProperty(action)) continue;

      this.onAction(action, actions[action]);
    }
  }

  _emitError(action, id, error) {
    const message = (error & error.clientMessage) || 'Fatal Error';
    this._socket.emit(`${action}:fail`, {message}, id);
  }
}