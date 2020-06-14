const app = getApp();
// pages/addnew/addnew.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chose_date: new Date().toString,
    todo_thing: '把重要的事情记录下来吧'
  },
  bindBeginTimeChange(e) {
    console.log(`修改截至日期为:${e.detail.value}`);
    this.setData({
      chose_date: e.detail.value
    })
  },

  formSubmit(e) {
    console.log(e.detail.value);
    if(e.detail.value.eventMessage.length == 0) {
      console.log('事件不能为空呦~')
    } else {
      let sendData = e.detail.value;
      this.judgeDate(sendData);
      sendData.userId = app.globalData.userId;
      this.sendNewthingToServer(sendData);
    }
    
  },
  judgeDate(sendData) {
    if(sendData.endTime == null) {
      sendData.endTime = '2030-06-03';
    }  
  },
  sendNewthingToServer(sendData) {
    wx.request({
      url: 'https://www.cloudykz.top/addNewThing',
      data: sendData,
      method: 'GET',
      success: res => {
        console.log(res)
        if(res.data.ok) {
          wx.navigateBack({
            complete: (res) => {
              app.getTodoList();
            },
          })
        }
      },
      fail: err => {

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

  },

  
})