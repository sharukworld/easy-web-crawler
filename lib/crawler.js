var request = require('request');
var cheerio = require('cheerio');
var linkUtil = require('../util/link-util');

module.exports = class crawler {
    crawler(seedUrl) {
        request(seedUrl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                var links = $('a:not([href^="#"],[href^="mailto:"])'); //jquery get all hyperlinks
                $(links).each(function (i, link) {
                    console.log(linkUtil.getCompleteLink($(link).attr('href'), seedUrl ));
                    // console.log($(link).attr('href'));
                });
            }
        });
    }
}
