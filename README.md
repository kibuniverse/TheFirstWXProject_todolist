# 此仓库为第一次写微信小程序的仓库

[![npm_version](https://img.shields.io/badge/npm-6.13.4-orange)](https://www.npmjs.com/)    ![](https://img.shields.io/badge/pm2-4.2.3-brightgreen)    ![](https://img.shields.io/badge/node-v12.15.0-blue)    ![](https://img.shields.io/badge/weChat-v1.03-green)     ![](https://img.shields.io/badge/nginx-1.6.1-brightgreen)



## 一、开发背景

此项目实现了简单的类似todolist的功能，一是为了巩固一下微信小程序开发的知识，避免后期在重新开发时遇到各种坑，二是锻炼实践es6语法， 三是熟悉项目上线的流程



## 二、开发规范

由于该项目为个人项目，所以代码直接推送至主分支。

### 2.1、命名规则

所有的变量以及函数名均为驼峰式命名

### 2.2、文件tree

```tree
│  .gitignore
│  app.js
│  app.json
│  app.wxss
│  project.config.json
│  README.md
│  sitemap.json
├─pages
│  ├─addnew
│  ├─index
│  ├─is_done
│  ├─logs
│  ├─main
│  └─wait_todo
|
├─server
│  │  addNewThing.js
│  │  changeEventStatus.js
│  │  getUserTodoList.js
│  │  wxServer.js
│  │
│  └─utils
│          mysql.js 
└─utils
        util.js
```





## 三、开发中遇到的问题

### 3.1、获得用户`openid`的方法

由于微信的对用户数据的保密性，无法直接通过`wx.login()`获得用户对应的独立`opneid`,微信小程序在获取用户的`openid`时需要将使用`wx.login()`获得的`code`以及`appid`和`appsecret`作为参数传入登陆凭证校验接口,接口才会返回对应的数据(`session_key`, `openid`...)，但是出于安全考虑，微信小程序不允许在小程序中直接使用`wx.request`访问凭证校验接口(存在`appid`以及`appsrcret`泄露问题), 所以需要小程序将`code`发送至开发者服务器，再由开发者服务器向微信接口发送`appid`, `appsecret`, `code`，再由开发者服务器向小程序端返回登陆状态，保持`session`或者其他

#### 总结一下想要获取用户的`openid`需要经历一下几步

 - 小程序将`wx.login()`返回的`code`发送至开发者服务器
 - 开发者服务器将收到的`code`与提前写好的`appid`,`appsecret`发送至微信凭证校验接口后返回`openid`与`session_key`
- 在开发者服务器中返回小程序对应的用户状态

后端`http`请求使用了`axios`框架



### 3.2、在使用`post`请求时后台正常前端出现404



### 3.3、使用自己封装的查询数据库模块后查询时间表返回的数组为空？(在服务器终端上可以正常查询)

打印sql 语句很有必要， 在修改变量名时有一个忘记修改，导致sql语句错误，查了两个小时



## 四、开发细节

### 4.1、服务器端nginx配置

> 考虑到该项目使用的人数较少，所以未使用负载均衡

```nginx
user root root;
worker_processes 1;
error_log /usr/local/webserver/nginx/logs/nginx_error.log;
events {
	worker_connections 1024;
}

http
{
   include	mime.types;
   default_type application/octet-stream;
   sendfile on;
   keepalive_timeout 65;

   server{
    listen 443 ssl;
    server_name www.cloudykz.top;
    charset 'utf-8';
    ssl_certificate	1_www.cloudykz.top_bundle.crt;
    ssl_certificate_key 2_www.cloudykz.top.key;

    ssl_protocols	TLSv1 TLSv1.1 TLSv1.2;
    
    include /etc/nginx/conf.d/*.conf;
    location / {
        add_header 'Access-Control-Allow-Origin' $http_origin;
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,web-token,app-token,Authorization,Accept,Origin,Keep-Alive,User-Agent,X-Mx-ReqToken,X-Data-Type,X-Auth-Token,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
        if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain; charset=utf-8';
                add_header 'Content-Length' 0;
                return 204;
      }
    }
    location /getUserId/ {
		proxy_pass http://localhost:9999;
    } 
            
    location /addNewThing/ {
        proxy_pass http://localhost:10001;
    }
            
    location /getUserTodoThing/ {
    	proxy_pass http://localhost:10002;
    }
            
    location /changeEventStatus/ {
    	proxy_pass http://localhost:10003;
    }
   }
	
    server{	
        listen 80;
	server_name www.cloudykz.top cloudykz.top;
	rewrite ^/(.*)$ https://www.cloudykz.top:443/$1 permanent;
    }
}
```



### 4.2、服务器端sql查询的封装

```js
const mysql = require('mysql');
// 创建sql连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Yankaizhi123...',
  database: 'wx_project',
  connectionLimit: 1000,
  waitForConnections: true
});
// 封装并对外暴露查询函数
const query = (sql, callback) => {
  pool.getConnection((err, connection) => {
    if(err) {
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
```

#### 在这里多说一下为什么要使用mysql连接池

- 连接池相较于普通的连接可以处理高并发
- 连接池可以复用已有的链接

总的来说连接池相较于开启一个连接后全部使用这个连接更加的安全，而且目前据我所知没什么副作用，完全可以取代普通的连接

### 



## 五、项目总结

### 5.1、微信框架

-   微信小程序类似于大部分框架(react, vue)， 也是一种典型的视图层(使用`webview`进行渲染)和数据层(使用`jscore`运行`js`脚本) 分开的结构，我们只需要专注于逻辑层的数据处理，然后将处理好的数据传送至客户端后渲染层对比前后差异后进行重新渲染界面
- 小程序的每一个页面都是不同的`WebView`渲染后显示的
- 由于渲染层和逻辑层都有各自的线程进行渲染,所以在处理时需要考虑异步的情况（微信小程序提供了很多页面周期函数，在一定程度上方便了我们进行一些异步操作的处理）

### 5.2、性能优化

由于页面在渲染时会根据WXML代码生成对应的节点树，然后再根据节点树上的各个节点依次在界面上创建出对应的组件，所以优化的第一个方式就是减少节点的数量，将标签进行整合，减少标签的数量

第二个就是尽量减少重新渲染的次数

