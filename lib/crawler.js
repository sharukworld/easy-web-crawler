var request = require('request');
var cheerio = require('cheerio');

module.exports = class crawler {
    test() {
        console.log('this is test inside module');
    }

    crawler() {
        request('https://stackoverflow.com', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                var links = $('a:not([href^="#"],[href^="mailto:"])'); //jquery get all hyperlinks
                $(links).each(function (i, link) {
                   // console.log($(link).attr('href'));
                });
            }
        });
    }
}
