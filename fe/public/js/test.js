var jadeify = require('jadeify');

var msg = jadeify('msg.jade', {
      title : 'foo',
          body : 'bar baz quux'
});
console.log('hello');
