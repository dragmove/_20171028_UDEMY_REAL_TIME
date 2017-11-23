import {Observable} from 'rxjs';

Observable.prototype.safeSubscribe = function (next, error, complete) {
  const subscription = this.subscribe((item) => {
    try {
      next(item);

    } catch (e) {
      console.log(e.stack || e);
      subscription.unsubscribe();
    }
  }, error, complete);

  return subscription;
};