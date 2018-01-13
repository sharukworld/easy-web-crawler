var request = require('request');
var cheerio = require('cheerio');
var linkUtil = require('../util/link-util');
var redis = require('../util/redis-db')

module.exports = class crawler {
    
    constructor() {
    this.db = redis.connect();
    }
    
    crawler(seedUrl) {
        request(seedUrl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                var links = $('a:not([href^="#"],[href^="mailto:"])'); //jquery get all hyperlinks
                $(links).each(function (i, link) {
                    // console.log(linkUtil.getCompleteLink($(link).attr('href'), seedUrl ));
                    // console.log($(link).attr('href'));
                });
            }
        });
    }

    testRedis(){
        this.db.set('foo', 'bar');
    }
}
