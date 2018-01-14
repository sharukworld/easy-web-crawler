let url = require("url");

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