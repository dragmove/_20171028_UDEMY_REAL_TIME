import {Validator} from '../validator';

export let USERNAME_REGEX = /^[\w\d_-]+$/;

export function validateLogin(username) {
  const validator = new Validator();

  if (username.length >= 20) {
    validator.error('Username must be fewer than 20 characters');
  }

  if (!USERNAME_REGEX.test(username)) {
    validator.error('username can only contain numbers, digits, underscore and dashes');
  }

  return validator;
}