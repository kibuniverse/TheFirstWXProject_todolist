# 此仓库为第一次写微信小程序的仓库

  ![](https://img.shields.io/badge/npm-6.13.4-orange) ![](https://img.shields.io/badge/pm2-4.2.3-brightgreen)  ![](https://img.shields.io/badge/node-v12.15.0-blue)![](https://img.shields.io/badge/weChat-v1.03-green)   ![](https://img.shields.io/badge/nginx-1.6.1-brightgreen)

## 此项目实现了简单的类似todolist的功能，一是为了巩固一下微信小程序开发的知识，避免后期在重新开发时遇到各种坑，二是锻炼实践es6语法

> 下面是编写过程中遇到的一些问题以及解决方法
## 一、获得用户`openid`的方法

由于微信的对用户数据的保密性，无法直接通过`wx.login()`获得用户对应的独立`opneid`,微信小程序在获取用户的`openid`时需要将使用`wx.login()`获得的`code`以及`appid`和`appsecret`作为参数传入登陆凭证校验接口,接口才会返回对应的数据(`session_key`, `openid`...)，但是出于安全考虑，微信小程序不允许在小程序中直接使用`wx.request`访问凭证校验接口(存在`appid`以及`appsrcret`泄露问题), 所以需要小程序将`code`发送至开发者服务器，再由开发者服务器向微信接口发送`appid`, `appsecret`, `code`，再由开发者服务器向小程序端返回登陆状态，保持`session`或者其他

#### 总结一下想要获取用户的`openid`需要经历一下几步

 - 小程序将`wx.login()`返回的`code`发送至开发者服务器
 - 开发者服务器将收到的`code`与提前写好的`appid`,`appsecret`发送至微信凭证校验接口后返回`openid`与`session_key`
- 在开发者服务器中返回小程序对应的用户状态

后端`http`请求使用了`axios`框架



## 二、在使用`post`请求时后台正常前端出现404



