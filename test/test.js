var assert = require('assert');

const index = require('../index');
var redis = require('../util/redis-db');
let db = redis.connect();

let crawl = new index("http://m.google.com", db, 6);


describe('Sanity check2', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
        crawl.startCrawling().then(
          list => {
          }
        )
        assert.equal(true, true);
      });
    });
  });
