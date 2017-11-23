var Rx = require('rxjs');

const source = Rx.Observable.interval(1000);

const example = source
  .do(() => console.log('do something'))
  .publish(); // do nothing until connect() is called

const subscribe_1 = example.subscribe(val => console.log(`subscribe_1 : ${val}`));
const subscribe_2 = example.subscribe(val => console.log(`subscribe_2 : ${val}`));

setTimeout(() => {
  example.connect();
}, 5000);