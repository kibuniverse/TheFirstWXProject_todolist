const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Yankaizhi123...',
  database: 'wx_project'
});

const query = (sql, callback) => {
  pool.getConnection((err, connection) => {
    if(err) {
      // 创建连接出错
      callback(err, null, null)
    } else {
      if(sql.type === 'insert') {
        connection.query(sql.sql, sql.postObj, (err, vals, fields) => {
          connection.release();
          callback(err, vals, fields);
        })
      } else {
        connection.query(sql.sql, (err, vals, fields) => {
          connection.release();
          callback(err, vals, fields);
        })
      }
      
    }
  })
}

module.exports = query;