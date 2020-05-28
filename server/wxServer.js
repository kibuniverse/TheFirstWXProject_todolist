const http = require('http');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const querystring = require('querystring');
const urlLib = require('url');
const express = require('express');
var server = express();
const axios = require('axios');

server.use('*', function(req, res, next) {
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'null');
  next(); // 链式操作
});
server.use('/', (req, res) => {
    let data = querystring.parse(urlLib.parse(req.url).query);
    axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
                appid: data.appid,
                secret: 'b97d5f3f60a3326add2158148abf87e0',
                js_code: data.code,
                grant_type:  'authorization_code'
        }}).then(value => {
                console.log(value);
                res.send(`用户openid为${value.data.openid}`);
                res.end();
        }).catch(err => {
                console.log(err);
        })
})

// nginx 代理
server.listen(9999, () =>{
  console.log('监听微信小程序数据传输的端口9999已经打开')
})
