// pages/is_done/isdone.js
const app = getApp()
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
              todoArray: app.globalData.todoList.filter(item => {return item.isDone == 1}),
            })
          })
        }
      },
      fail: err => {
        console.log(err);
      }
    })
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
      todoArray: app.globalData.todoList.filter(item => {return item.isDone == 1}),
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