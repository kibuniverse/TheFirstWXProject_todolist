const http = require('http');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const querystring = require('querystring');
const urlLib = require('url');
const express = require('express');
var server = express();
const axios = require('axios');
const query = require('./utils/mysql');
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
                console.log(value.data.openid);
                let sql = {
                        sql: `SELECT * FROM userIdMessage WHERE openid='${value.data.openid}'`
                }
                query(sql, (err, vals, fields) => {
                        if(err) {
                                console.log(err);
                                res.send(`{"ok": false}`);
                        } else {
                                console.log(vals);
                                if(vals.length == 0) {
                                        console.log('该用户未注册，立即执行用户注册函数');
                                        let sql = {
                                                sql: 'INSERT INTO userIdMessage SET ?',
                                                type: 'insert',
                                                postObj: {
                                                        openid: value.data.openid,
                                                        status: 1
                                                }
                                        }
                                        registerUser(sql, (err, vals, fields) => {
                                                if(err) {
                                                        console.log('注册失败');
                                                        console.log(err);
                                                        res.send(`{"ok": false}`);
                                                } else {
                                                        console.log(vals);
                                                        res.send(`{"ok": true, "userId": "${vals.insertId}"}`);
                                                }
                                        });
                                } else {
                                        console.log('用户存在');
                                        res.send(`{"ok": true, "userId": "${vals[0].id}"}`);
                                }
                        }
                        res.end();
                })
                
        }).catch(err => {
                console.log(err);
        })
})

// nginx 代理
server.listen(9999, () =>{
  console.log('监听微信小程序数据传输的端口9999已经打开')
})

// 用户注册函数
function registerUser(sql, callback) {
        query(sql, (err, vals, fields) => {
                callback(err, vals, fields);
        })
}