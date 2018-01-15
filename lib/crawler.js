
var request = require('request');
var cheerio = require('cheerio');
var linkUtil = require('../util/link-util');
var redis = require('../util/redis-db');
var ApplicationConstant = require('../constant/ApplicationConstant');

module.exports = class crawler {

    //Depedency Injection of Db and other essential variables.
    constructor(seedUrl, db, numberOfUrlToSeed, config) {
        this.db = db;
        this.seedUrl = seedUrl;
        this.numberOfUrlToSeed = numberOfUrlToSeed;
        this.config = config;
        this.addUrlToVisitedList(this.seedUrl);
    }

    startCrawling() {
        return this.crawler(this.seedUrl);
    }

    deleteOldDataCopies() {
        let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + this.seedUrl;
        let storeName = ApplicationConstant.TO_BE_VISITED_STORE_NAME + this.seedUrl;
        this.db.del(vistedStoreName, (err, res) => {
            this.db.del(storeName);
        });
    }

    crawler(currentUrl) {
        console.log('crawling ', currentUrl);
        let that = this;

        let resolveCrawlerPromise;
        let listOfUrlPromise = new Promise((resolve, reject) => {
            resolveCrawlerPromise = resolve;
        });
        request(currentUrl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let links = $(ApplicationConstant.linkQuery);
                let linkArray = [];
                for (let index = 0; index < links.length; ++index) {

                    let completeLink = linkUtil.getCompleteLink($(links[index]).attr(ApplicationConstant.linkAttribure), currentUrl);
                    completeLink = linkUtil.filterLink(completeLink, that.config);
                    if (completeLink != null) {
                        linkArray.push(completeLink);
                    }
                }

                that.isLinkAlreadyScrapped(linkArray).then(isScrapped => {
                    that.upsertStore(linkArray, isScrapped).then(upserted => {

                        that.popNextHighestAndCrawl(resolveCrawlerPromise);
                    });
                });
            }
            else {
                that.popNextHighestAndCrawl(resolveCrawlerPromise);
            }
        });
        return listOfUrlPromise;
    }


    // get the most frequent link
    popNextHighestAndCrawl(resolveCrawlerPromise) {
        let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + this.seedUrl;
        this.popHighestScoredUrl().then(url => {
            this.addUrlToVisitedList(url);

            this.db.SCARD(vistedStoreName, (err, number) => {
                if (number < this.numberOfUrlToSeed) {
                    this.crawler(url);
                }
                else {
                    this.db.SMEMBERS(vistedStoreName, (err, list) => {
                        console.log('scrapping completed')
                        resolveCrawlerPromise(list);
                    });
                }
            });
        }).catch(err => {
            console.error(err);
            this.db.SMEMBERS(vistedStoreName, (err, list) => {
                resolveCrawlerPromise(list);
            });
        })
    }

    // return an array of 0,1 representing if the url is already visited.
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
        let rejectPromise;
        let highestScoredUrlPromise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
        this.db.ZREVRANGEBYSCORE(storeName, "+inf", "-inf", "LIMIT", 0, 1, (err, highestScoredUrl) => {
            if (highestScoredUrl[0] == null) {
                rejectPromise('url to be scrapped empty');
            }
            else {
                this.db.ZREM(storeName, highestScoredUrl[0]);
                resolvePromise(highestScoredUrl[0])
            }

        });
        return highestScoredUrlPromise;
    }

}
