var Redis = require('ioredis');
let redis;
var db = module.exports = {};

db.connect = function (){
    redis = new Redis();
    return redis;
};

db.disconnect = function (){
    redis = null;
};

db.instance = function (){
    return redis;
};