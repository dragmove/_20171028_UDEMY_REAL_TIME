var Rx = require('rxjs');

// set this prototype method. for avoid app crash.
Rx.Observable.prototype.safeSubscribe = function (next, error, complete) {
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

const hot = Rx.Observable.interval(1000).publish();
hot.connect();

hot.subscribe(i => console.log(`one: ${i}`));
hot.subscribe(i => console.log(`two: ${i}`));

setTimeout(() => {
  hot.subscribe(i => console.log(`three: ${i}`));
}, 3000);

setTimeout(() => {
  /*
   hot.subscribe(() => {
   throw new Error('what now?'); // => all of subscriptions will be terminated. and, app will be stop.
   });
   */

  // so. create safeSubscribe, and use.
  hot.safeSubscribe(() => {
    throw new Error('what now?');
  });

}, 5000);

