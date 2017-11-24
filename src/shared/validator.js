import {Observable} from 'rxjs';

export class Validator {
  get isValid() {
    return !this._errors.length;
  }

  get errors() {
    return this._errors;
  }

  get message() {
    return this._errors.join(', ');
  }

  get hasErrors() {
    return this._errors.length > 0;
  }

  constructor() {
    this._errors = [];
  }

  error(message) {
    this._errors.push(message);
  }

  toObject() {
    if (this.isValid) return {};

    return {
      errors: this._errors,
      message: this.message
    };
  }

  throw$() {
    console.log('validator.js throw$: this.message :', this.message);
    return Observable.throw({clientMessage: this.message});
  }
}