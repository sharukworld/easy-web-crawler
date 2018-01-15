var assert = require('assert');

var config = require('../constant/ApplicationConfig')
const crawler = require('../index');
var redis = require('../util/redis-db');
let db = redis.connect();

let applicationConfig = new config();
// add more domain to be ignored here.
applicationConfig.denyDomain = ['www.youtube.com'];

// update the url here to parse other website.
let crawl = new crawler("https://code.visualstudio.com/docs/getstarted/keybindings", db, 20, applicationConfig);

describe('Use this to test the program', function () {
  describe('parse url', function () {
    it('should parse and store the url into redis', function () {
      crawl.startCrawling().then((list) => {
        console.log(list);
      });
    });
  });
});
