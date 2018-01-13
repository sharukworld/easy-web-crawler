let url = require("url");

exports.getCompleteLink = function (link, parentLink) {
    let parsedLink = url.parse(link);
    if(parsedLink.hostname == null){
        let parsedParentLink = url.parse(parentLink);
        return parsedParentLink.protocol+ "//"+ parsedParentLink.hostname + link;
    }
    return link;
}