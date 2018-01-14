var assert = require('assert');

var config = require('../constant/ApplicationConfig')
const crawler = require('../index');
var redis = require('../util/redis-db');
let db = redis.connect();

let crawl = new crawler("https://github.com/sharukworld/easy-web-crawler", db, 10);


// describe('Sanity check2', function() {
//     describe('#indexOf()', function() {
//       it('should return -1 when the value is not present', function(){
//         crawl.startCrawling().then(
//           list => {
//           }
//         )
//       });
//     });
//   });

  describe('Denying google.com domain', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function(){
       let  applicationConfig = new config();
            applicationConfig.denyDomain = ['www.youtube.com'];
        let crawl = new crawler("https://www.youtube.com", db, 30, applicationConfig).startCrawling();
      });
    });
  });
