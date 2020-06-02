const querystring = require('querystring');
const urlLib = require('url');
const express = require('express');
const query = require('utils/mysql');
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
  searchData(data, (err, vals, field) => {
    if(err) {
      console.log('查询失败');
      console.log(err);
      res.send(`{"ok": false, "msg": "数据库查询失败"}`);
    } else {
      console.log(vals);
      res.send(vals);
    }
    res.end();
  })
});

function searchData(data, callback) {
  let sql = {
    sql: `SELECT * FROM eventsTable WHERE userId='${data.userId}'`, 
  }
  query(sql, (err, vals, fields) => {
    callback(err, vals, fields);
  });
}
// nginx 代理
server.listen(10002, () =>{
   console.log('监听查询用户待办事件的端口10002已经打开');
});
