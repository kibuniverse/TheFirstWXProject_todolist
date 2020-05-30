const app = getApp();


Page({
  // 页面初始数据
  data: {
    
  },
  bindtapTodo: () => {
    wx.navigateTo({
      url: '../wait_todo/wait_todo',
    })
  },
  bindtapIsDone: () => {
    wx.navigateTo({
      url: '../is_done/isdone',
    })
  },
  bindtapAddNew: () => {
    wx.navigateTo({
      url: '../addnew/addnew',
    })
  },
  // 生命周期函数， 监听页面加载, 加载完成执行
  onLoad: options => {
    
  },

  onReady: () => {

  },

  onShow: () => {

  }
})