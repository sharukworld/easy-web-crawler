let url = require("url");
var ApplicationConstant = require('../constant/ApplicationConstant');

exports.getCompleteLink = function (link, parentLink) {
    if (link == null || !(link.startsWith('/') || url.parse(link).hostname != null)) {
        return;
    }
    let parsedLink = url.parse(link);
    if (parsedLink.hostname == null) {
        let parsedParentLink = url.parse(parentLink);
        return parsedParentLink.protocol + "//" + parsedParentLink.hostname + link;
    }
    return link;
}

exports.getIsLinkSeededTransactionArray = function (linkArray, seedUrl) {
    let linkSeededTransactionArray = [];
    let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + seedUrl;
    for (let index = 0; index < linkArray.length; index++) {
        linkSeededTransactionArray.push([ApplicationConstant.CHECK_IF_URL_SEEDED, vistedStoreName, linkArray[index]]);
    }
    return linkSeededTransactionArray;
}

exports.getScoreIncrArray = function (linkArray, isScrapped, seedUrl) {
    let scoreIncrArray = [];
    let storeName = ApplicationConstant.TO_BE_VISITED_STORE_NAME + seedUrl;
   for(let index = 0; index < linkArray.length; index++) {
     if(isScrapped[index] === 0) {
        scoreIncrArray.push([ApplicationConstant.INCR_SCORE, storeName, ApplicationConstant.SCORE_INCREMENT_VALUE, linkArray[index]]);
     }
   }
   return scoreIncrArray;
}