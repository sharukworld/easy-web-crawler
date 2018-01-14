
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
                that.isLinkAlreadyScrapped(linkArray).then(res => {
                    console.log(res);
                });
            }
        });
    }

    isLinkAlreadyScrapped(linkArray) {
        let linkSeededTransactionArray = linkUtil.getIsLinkSeededTransactionArray(linkArray, this.seedUrl);
        console.log(linkSeededTransactionArray);
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

    upsertStore2(){

    }
    upsertStore(link, seedUrl) {

        let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + seedUrl;
        this.db.sismember(vistedStoreName, link).then(member => {
            console.log('visited name', member)
            if (member === 1) {
                return;
            }
            else {
                let storeName = ApplicationConstant.TO_BE_VISITED_STORE_NAME + seedUrl;
                this.db.zincrby(storeName, ApplicationConstant.SCORE_INCREMENT_VALUE, link)
            }
        }, err => {
            console.error('errr', err)
        });

    }

    redisTest() {
        this.db.set("some key", "some val");
    }
}
