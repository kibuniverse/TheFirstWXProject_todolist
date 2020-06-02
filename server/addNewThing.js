const querystring = require('querystring');
const urlLib = require('url');
const express = require('express');
const query = require('../utils/mysql');
var server = express();

server.use('*', function(req, res, next) {
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'null');
  next(); // 链式操作
});

server.use('/', (req, res) => {
  let data = querystring.parse(urlLib.parse(req.url).query);
  console.log(data);
  insertData(data, (err, vals, fields) => {
    if(err) {
      console.log('事件插入失败');
      console.log(err);
      res.send(`{"ok": false, "msg": "事件插入失败"}`); 
    } else {
      console.log('事件插入成功');
      console.log(vals);
      res.send(`{"ok": true, "msg": "事件插入成功"}`);
    }
    res.end();
  });
  res.send(`{"ok": true,"msg":"收到请求"}`);
  res.end();
});

function insertData(data, callback) {
  data.isDelete = 0;
  data.isDone = 0;
  let sql = {
    sql: 'INSERT INTO eventsTable SET ?',
    type: 'insert',
    postObj: data
  }
  query(sql, (err, vals, fields) => {
    callback(err, vals, fields);
  })
}
// nginx 代理
server.listen(10001, () =>{
   console.log('监听微信添加数据的端口10001已经打开');
});
