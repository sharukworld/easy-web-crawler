

var request = require('request');
var cheerio = require('cheerio');
var linkUtil = require('../util/link-util');
var redis = require('../util/redis-db');
var ApplicationConstant = require('../constant/ApplicationConstant')

module.exports = class crawler {

    constructor(seedUrl, db) {
        this.db = db;
        this.seedUrl = seedUrl;
    }

    startCrawling(){
        this.crawler(this.seedUrl);
    }

    startCrawling2(){
        this.upsertStore("taatt", "ttttaaattt");
    }

     crawler(currentUrl) {
    
        let that = this;
        request(currentUrl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                var links = $('a:not([href^="#"],[href^="mailto:"])');
                // $(links).each(
                //     function (i, link) {
                //       let completeLink = linkUtil.getCompleteLink($(link).attr('href'), currentUrl );    
                //       console.log(completeLink)         
                //       //that.upsertStore(completeLink, that.seedUrl)   
                // });

                var promi  = [];
                console.log('her', links.length)
                let pipeline = that.db.pipeline();
                $(links).each(
                  (i , link) => {
                    let completeLink = linkUtil.getCompleteLink($(link).attr('href'), currentUrl ); 
                      pipeline.sismember(completeLink, that.seedUrl);
                      //console.log("endaaa ", i);
                    // console.log('her', completeLink)
                         
                        //  console.log('te', result);           
                   // await that.upsertStore(completeLink, that.seedUrl);  
                   if(i ===  500) {
                    console.log("end");
                
                    that.db
                    .multi().set('foo', 'asd').set('cho', 'cat').get('foo').exec(function (results) {
                        // results === [[null, 'OK'], [null, 'bar']]
                        res = results;
                        console.log('tr', results.length)
                      }).then(el => {
                          console.log('err', el)
                      });
                      console.log("en3d");
                    //     .multi([
                    //     ['sismember', 'tedt', 'adaf'],
                    //     ['get', 'foo']
                    //   ]).exec(res => {
                    //       console.log('ger', res);
                    //   });
                   }
                  });
                  // Promise.all(promi).then(function(values) {
                  
                    // pipeline.exec(function (err, results) {
                    //     console.log('res', results)
                    //   });
                 // });
            }
        });
    }

    async isLinkAlreadyScrapped(link, seedUrl){
        // let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + seedUrl;
        // this.db.sismember(vistedStoreName, link).then(member => {
        //     console.log('me', member)
        // });

        // return this.db.sismember(vistedStoreName, link);
    }

    async upsertStore(link, seedUrl) {

        // let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + seedUrl;
        //  this.db.sismember(vistedStoreName, link).then(member => {
        //     console.log('visited name', member)
        //     if(member === 1) {
        //        return;
        //     }
        //     else {
        //         let storeName = ApplicationConstant.TO_BE_VISITED_STORE_NAME + seedUrl;
        //         this.db.zincrby(storeName, ApplicationConstant.SCORE_INCREMENT_VALUE, link)
        //     }
        // }, err => {
        //     console.error('errr', err)
        // });
        return new Promise(resolve => {
            setTimeout(() => {
              resolve('resolved');
            }, 2000);
          });
    }
}
