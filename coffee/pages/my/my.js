// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:'',
    name:"",
    img:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow: function () {
    console.log(wx.getStorageSync('info'));
    this.setData({
      name:wx.getStorageSync('userInfo').nickName||"",
      img:wx.getStorageSync('userInfo').avatarUrl
    });
  },


  // 我的收藏
   goMyStar(){
    wx.navigateTo({
      url: '../star/star',
    })
  },

  // 管理员登录
  goAdmin(){
    wx.navigateTo({
      url: '../admin/admin',
    })
  },

// 我的奖品
goMyLuck(){
    wx.navigateTo({
      url: '../my_luck/my_luck',
    })
  },

  // 我的订单
  goMyDingdan(){
    wx.navigateTo({
      url: '../dingdan/dingdan',
    })
  },

  gSet(){
    wx.navigateTo({
      url: '../set/set',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


})