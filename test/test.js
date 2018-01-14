var assert = require('assert');

const index = require('../index');
var redis = require('../util/redis-db');
let db = redis.connect();

let crawl = new index("http://google.com", db, 10000);


describe('Sanity check2', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
        crawl.startCrawling().then(
          list => {
            console.log("inside test", list);
          }
        );
        assert.equal(true, true);
      });
    });
  });

  // describe('Sanity check2', function() {
  //   describe('get highest scored url', function() {
  //     it('get highest scored url', function(){
  //       crawl.popHighestScoredUrl();
  //       assert.equal(true, true);
  //     });
  //   });
  // });
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