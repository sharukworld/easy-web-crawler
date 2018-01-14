var assert = require('assert');

const index = require('../index');
var redis = require('../util/redis-db');
let db = redis.connect();

let crawl = new index("https://stackoverflow.com", db);


describe('Sanity check2', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
        crawl.startCrawling();
        assert.equal(true, true);
      });
    });
  });

  // describe('check upserting of link', function() {
  //   describe('#indexOf()', function() {
  //     it('should add a link', function(){
  //       crawl.startCrawling2();
  //       assert.equal(true, true);
  //     });
  //   });
  // });

  //   describe('check upserting of link', function() {
  //   describe('#indexOf()', function() {
  //     it('should add a link', function(){
  //       crawl.redisTest();
  //     });
  //   });
  // });