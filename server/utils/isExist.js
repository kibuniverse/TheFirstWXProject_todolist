function isExist(obj, sql, ways) {

  return new Promise(
      function(resolve, reject) {
          obj.query(sql, (err, result) => {
              if(err) {
                  //sql 语句错误
                  res.send({
                      ok: false,
                      way: ways,
                      msg: '数据库错误'
                  });
                  res.end();
                  reject();
              } else {
                  // console.log(result);
                  if(result.length == 0) {
                      console.log('用户名或密码错误');
                      reject();
                  } else {
                      // console.log('该用户存在');
                      resolve();
                  }
              }
          });
      })
}

