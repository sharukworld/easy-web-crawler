var Redis = require("redis");
let redis;
var db = module.exports = {};

db.connect = function (){
    redis =  Redis.createClient();
    return redis;
};

db.disconnect = function (){
    redis = null;
};

db.instance = function (){
    if(redis == null){
        redis = Redis.createClient();
    }
    return redis;
};