var assert = require('assert');
var linkUtil = require('../util/link-util');


describe('Sanity check util', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
        assert.equal(-1, [1,2,3].indexOf(4));
      });
    });
  });

  describe('get internal link', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
        assert.equal('http://google.com/test',linkUtil.getCompleteLink("/test","http://google.com/"));
      });
    });
  });

  describe('get external link', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
        assert.equal('http://external.com/test',linkUtil.getCompleteLink("http://external.com/test","http://google.com/"));
      });
    });
  });