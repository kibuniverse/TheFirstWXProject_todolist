const app = getApp();

// pages/wait_todo/wait_todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoArray: null,
  },
  bindtapEvent(e) {
    console.log(e);
    let changeId = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://www.cloudykz.top/changeEventStatus',
      data: {
        eventId: changeId,
        way: 'changestatus',
      },
      method: 'get',
      success: res => {
        console.log(res);
        if(res.data.ok) {
          app.getTodoList().then(() => {
            this.setData({
              todoArray: app.globalData.todoList.filter(item => {return item.isDelete == 0 && item.isDone == 0 && this.judgeTime(item.endTime)})
            })
          })
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  },
 
  judgeTime(time) {
    let [year, month, day] = [...time.slice(0, 10).split('-')];
    console.log(year, month, day);
    let now_time = new Date();
    let [now_year, now_month, now_day] = [now_time.getFullYear(), now_time.getMonth() + 1, now_time.getDate()];
    console.log(now_year, now_month, now_day);
    if(now_year < year) {
      return true;
    } 
    if(now_year == year) {
      if(now_month < month) {
        return true;
      } 
      if(now_month == month) {
        if(now_day <= day) {
          return true;
        }
      }
    }
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      todoArray: app.globalData.todoList.filter(item => {return item.isDelete == 0 && item.isDone == 0 && this.judgeTime(item.endTime)}),
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})