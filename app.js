//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://www.cloudykz.top/getUserId',
          data: {
            appid: 'wx280f9b26f309bc44',
            code: res.code
          },
          method: 'GET',
          success: openIdRes => {
            console.log(openIdRes.data);
            this.globalData.userId = openIdRes.data.userId;
            // 得到用户id后根据id查询事件， 优化后续体验
            this.getTodoList();
          },
          fail: err => {
            console.log(err)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getTodoList() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://www.cloudykz.top/getUserTodoThing',
        data: {
          userId: this.globalData.userId,
        },
        method: 'get',
        success: res => {
          console.log(res);
          this.globalData.todoList = res.data;
          resolve();
        },
        fail: err => {
          console.log(err);
          reject();
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    userId: null,
    todoList: null,
  }
})