const querystring = require('querystring');
const urlLib = require('url');
const express = require('express');
const query = require('../utils/mysql');
var server = express();
// 跨域已在nginx中处理
server.use('/', (req, res) => {
  let data = querystring.parse(urlLib.parse(req.url).query);
  console.log(data);
  data.way == 'delete' ? deleteEvent(data.eventId, (err, vals) => {

  }) 
  : changeEventStatus(data.id, data.way, (err, vals) => {
    
  });
});


function changeEventStatus(eventId,  callback) {
  getEventId(eventId).then((vals) => {
    console.log(vals);
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
