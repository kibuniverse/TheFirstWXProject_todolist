const querystring = require('querystring');
const urlLib = require('url');
const express = require('express');
const query = require('../utils/mysql');
var server = express();

server.use('/', (req, res) => {
  let data = querystring.parse(urlLib.parse(req.url).query);
  console.log(data);
  data.way == 'delete' ? deleteEvent(data.eventId, (err, vals) => {
    if(err) {
      console.log('事件删除失败');
      console.log(err);
      res.send(`{"ok": false, "msg": "事件删除失败"}`); 
    } else {
      console.log('事件删除成功');
      console.log(vals);
      res.send(`{"ok": true, "msg": "事件删除成功"}`);
    }
    res.end();
  }) 
  : changeEventStatus(data.eventId, (err, vals) => {
    if(err) {
      console.log('修改时间状态失败');
      console.log(err);
      res.send(`{"ok": false, "msg": "修改时间状态失败"}`); 
    } else {
      console.log('修改时间状态成功');
      console.log(vals);
      res.send(`{"ok": true, "msg": "修改时间状态成功"}`);
    }
    res.end();
  });
  res.end();
});


function changeEventStatus(eventId,  callback) {
  getEventId(eventId).then((vals) => {
    console.log(vals[0]);
    let intoData = vals[0].isDone;
    intoData == 0 ? intoData = 1 : intoData = 0;
    let sql = {
      sql: `UPDATA eventsTable SET isDone = '${intoData}' WHERE id='${eventId}'`
    };
    query(sql, (err, vals) => {
      callback(err, vals);
    })
    
  }).catch(err => {
    console.log(err);
  })
}

function getEventId(eventId) {
  return new Promise((reslove, reject) => {
    let sql = {
      sql: `SELECT * FROM eventsTable WHERE id='${eventId}'`
    }
    query(sql, (err, vals) => {
      if(err) {
        reject(err);
      } else {
        console.log(vals);
        reslove(vals);
      }
    })
  })
}
function deleteEvent(eventId, callback) {
  let sql = {
    sql: `DELETE FROM eventsTable where id='${eventId}'`
  }
  query(sql, (err, vals) => {
    callback(err, vals);
  })
  
  
}


// nginx 代理
server.listen(10001, () =>{
   console.log('监听改变事件状态的端口10003已经打开');
});
