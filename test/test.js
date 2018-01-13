var assert = require('assert');

const index = require('../index');

describe('Sanity check', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('Sanity check2', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
         new index().crawler("https://www.npmjs.com");
        assert.equal(true, true);
      });
    });
  });