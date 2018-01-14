var assert = require('assert');
var linkUtil = require('../util/link-util');
var config = require('../constant/ApplicationConfig')


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

  describe('link filter', function() {
    describe('denying domain', function() {
      it('should return null', function(){
        let  applicationConfig = new config();
        applicationConfig.denyDomain = ['google.com'];
        assert.equal(null,linkUtil.filterLink("http://google.com/",applicationConfig));
      });
    });
  });