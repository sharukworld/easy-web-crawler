
var request = require('request');
var cheerio = require('cheerio');
var linkUtil = require('../util/link-util');
var redis = require('../util/redis-db');
var ApplicationConstant = require('../constant/ApplicationConstant');

module.exports = class crawler {

    constructor(seedUrl, db) {
        this.db = db;
        this.seedUrl = seedUrl;
    }

    startCrawling() {
        this.crawler(this.seedUrl);
    }

    startCrawling2() {
        this.upsertStore("taatt", "ttttaaattt");
    }

    crawler(currentUrl) {

        let that = this;
        request(currentUrl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let links = $('a:not([href^="#"],[href^="mailto:"])');
                let linkArray = [];
                for (let index = 0; index < links.length; ++index) {
                    let completeLink = linkUtil.getCompleteLink($(links[index]).attr('href'), currentUrl);
                    if (completeLink != null) {
                        // linkArray.push([ApplicationConstant.CHECK_IF_URL_SEEDED, vistedStoreName, completeLink]);
                        linkArray.push(completeLink);
                    }
                }
                that.isLinkAlreadyScrapped(linkArray).then(isScrapped => {
                    that.upsertStore2(linkArray, isScrapped);
                });
            }
        });
    }

    isLinkAlreadyScrapped(linkArray) {
        let linkSeededTransactionArray = linkUtil.getIsLinkSeededTransactionArray(linkArray, this.seedUrl);
        let resolvePromise;
        let linkArrayPromise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
        });
        this.db
            .multi(linkSeededTransactionArray).exec((err, res) => {
                resolvePromise(res);
            });
        return linkArrayPromise;
    }

    upsertStore(linkArray, isScrapped) {
       let scoreIncrArray =  linkUtil.getScoreIncrArray(linkArray, isScrapped, this.seedUrl);
       this.db
       .multi(scoreIncrArray).exec((err, res) => {
       });
    }

}
