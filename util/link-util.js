let url = require("url");
var ApplicationConstant = require('../constant/ApplicationConstant');

exports.getCompleteLink = function (link, parentLink) {
    if(link == null){
        return;
    }
    let parsedLink = url.parse(link);
    if(parsedLink.hostname == null){
        let parsedParentLink = url.parse(parentLink);
        return parsedParentLink.protocol+ "//"+ parsedParentLink.hostname + link;
    }
    return link;
}

exports.getIsLinkSeededTransactionArray = function (linkArray, seedUrl) {
    console
    let linkSeededTransactionArray = [];
    let vistedStoreName = ApplicationConstant.VISITED_STORE_NAME + seedUrl;
    for(link in linkArray){
        linkSeededTransactionArray.push([ApplicationConstant.CHECK_IF_URL_SEEDED, vistedStoreName, link]);
    }
   return linkSeededTransactionArray;
}