// const wxContext = cloud.getWXContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getuserinfo(e){
     console.log(e.detail.rawData);  // 打印的就是用户信息
     wx.setStorageSync('userInfo', JSON.parse(e.detail.rawData))
     wx.switchTab({
       url: '../index/index',
     })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})