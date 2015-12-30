﻿var config = require('./config.js');
if (config.debug) {
    var http = require('http');
}
var logger = require('koa-logger');
var koa = require('koa');
var parse = require('co-body');
var cors = require('koa-cors');
var limit = require('koa-better-ratelimit');
var router = require('koa-router')({
    prefix: '/api'
});
if (config.redisState) {
    var Redis = require('ioredis');
    var redis = new Redis(config.redis);
}
var app = module.exports = koa()

app.use(logger());

if (config.limitState) {
    app.use(limit({
        duration: 1, 
        max: config.limitMax
    //blackList: ['127.0.0.1']
    }));
}

app.use(cors());

if (config.redisState) {
    redis.on('connect', function () {
        console.log(redis.status);
    });
}

router
  .get('/', function*(next) {
    if (this.req.checkContinue) this.res.writeContinue();
    //var dt = new Date();
    //for (var i = 0; i < 100; i++) {
    //    redis.set("kkk1" + i, "vvv1" + i);
    //}
    //this.body = (new Date()) - dt;
    var data = yield redis.get('kkk199');
    this.body = { key: 'kkk199', data : data };
    //this.body = "hello world";
})
  .post('/users', function*(next) {
    if (this.req.checkContinue) this.res.writeContinue();
    var body = yield parse.json(this, { limit: '10kb' });
    console.log(this.req.headers['u-apikey']);
    yield redis.set("myjson", JSON.stringify(body));
    this.body = JSON.stringify(body);
})
  .put('/users/:id', function*(next) {
    if (this.req.checkContinue) this.res.writeContinue();
    this.body = 'Hello ' + this.params.id + '!';
})
  .del('/users/:id', function*(nextxt) {
    if (this.req.checkContinue) this.res.writeContinue();
    this.body = 'Hello ' + this.params.id + '!';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', function (err, ctx) {
    if (config.debug) {
        console.log('server error', err, ctx);
    }
});

if (config.debug) {
    http.createServer(app.callback()).listen(config.port);
    console.log(config.appName + ' is start with port ' + config.port);
} else {
    app.name = config.appName;
    app.port = config.port;
    app.maxHeadersCount = config.maxHeadersCount;
}