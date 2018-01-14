
var request = require('request');
var cheerio = require('cheerio');
var linkUtil = require('../util/link-util');
var redis = require('../util/redis-db');
var ApplicationConstant = require('../constant/ApplicationConstant');

module.exports = class crawler {

    constructor(seedUrl, db, numberOfUrlToSeed) {
        this.db = db;
        this.seedUrl = seedUrl;
        this.numberOfUrlToSeed = numberOfUrlToSeed;
        this.addUrlToVisitedList(seedUrl);
    }

    startCrawling() {
        return this.crawler(this.seedUrl);
    }

    crawler(currentUrl) {
        console.log('crwling', currentUrl);
        let that = this;

        let resolvePromise;
        let listOfUrlPromise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
        });
        request(currentUrl, function (error, response, html) {

            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let links = $('a:not([href^="#"],[href^="mailto:"])');
                let linkArray = [];
                for (let index = 0; index < links.length; ++index) {

                    let completeLink = linkUtil.getCompleteLink($(links[index]).attr('href'), currentUrl);
                    if (completeLink != null) {
                        linkArray.push(completeLink);
                    }
                }

                that.isLinkAlreadyScrapped(linkArray).then(isScrapped => {
                    that.upsertStore(linkArray, isScrapped).then(upserted => {

                        that.popNextHishestAndCrawl(resolvePromise);
                    });
                });
            }
            else {
                that.popNextHishestAndCrawl(resolvePromise);
            }
        });
        return listOfUrlPromise;
    }

    popNextHishestAndCrawl(resolvePromise) {
        this.popHighestScoredUrl().then(url => {
            this.addUrlToVisitedList(url);
            let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + this.seedUrl;

            this.db.SCARD(vistedStoreName, (err, number) => {
                if (number < this.numberOfUrlToSeed) {
                    this.crawler(url);
                }
                else {
                    this.db.SMEMBERS(vistedStoreName, (err, list) => {
                        resolvePromise(list);
                    });
                }
            });
        })
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
        let scoreIncrArray = linkUtil.getScoreIncrArray(linkArray, isScrapped, this.seedUrl);
        let resolvePromise;
        let rejectPromise;
        let upsertStorePromise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
        this.db
            .multi(scoreIncrArray).exec((err, res) => {
                if (err) {
                    rejectPromise(false);
                }
                resolvePromise(true);
            });
        return upsertStorePromise;
    }

    addUrlToVisitedList(url) {
        let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + this.seedUrl;
        this.db.SADD(vistedStoreName, url);
    }

    popHighestScoredUrl() {
        let storeName = ApplicationConstant.TO_BE_VISITED_STORE_NAME + this.seedUrl;
        let resolvePromise;
        let highestScoredUrlPromise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
        });
        this.db.ZREVRANGEBYSCORE(storeName, "+inf", "-inf", "LIMIT", 0, 1, (err, highestScoredUrl) => {
            this.db.ZREM(storeName, highestScoredUrl[0]);
            resolvePromise(highestScoredUrl[0])
        });
        return highestScoredUrlPromise;
    }

}
