﻿module.exports = {
    mongoPoolSize: 100,
    mongoDbName: "Q1ServerAc",
    mongoColl:"Users",
    mongo : 'mongodb://localhost:27017',//使用mongodb数据库
    redis : 'redis://:jacle169@127.0.0.1:6379/2',//库0-15
    tokenex: 1200,//token超时时间 单位秒
    debug : true,//生产环境下需设置为false
    port: 8080,//本服务端口
    v : '1.0.0',
    appName: 'Q1ServerAc',
    whitelist: ['0.0.0.0/0', '::ffff:127.0.0.1']//ip白名单，'0.0.0.0/0'开头为禁用此功能
};