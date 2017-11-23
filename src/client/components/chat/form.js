import $ from 'jquery';
import {Observable} from 'rxjs';

import {ElementComponent} from '../../lib/component';

export class ChatFormComponent extends ElementComponent {
  constructor(usersStore) {
    super('div');

    this._users = usersStore;

    this.$element.addClass('chat-form');
  }

  _onAttach() {
    this._$input = $(`<input type="text" class="chat-input" />`).appendTo(this.$element);

    this._users.currentUser$.compSubscribe(this, user => {
      this._$input.attr('placeholder', user.isLoggedIn ? '' : 'Enter a username');
    });

    Observable.fromEvent(this._$input, 'keydown')
      //get value
      .filter(e => e.keyCode === 13) // enter key
      .do(e => e.preventDefault())
      .map(e => e.target.value.trim())
      .filter(e => e.length)

      // login or send message
      .withLatestFrom(this._users.currentUser$)
      .flatMap(([value, user]) => {
        return (user.isLoggedIn) ? this._sendMessage$(value) : this._login$(value);
      })

      // display message
      .compSubscribe(this, response => {



      });
  }
}