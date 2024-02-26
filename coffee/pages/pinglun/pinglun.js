// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:[],
    dataList:[],  // 评论数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.obj))
    this.setData({
      obj:JSON.parse(options.obj)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPinglun()
  },

   // 获取用户评论
   getPinglun(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getPinglun',
      data: {
        goods_id:this.data.obj.goods_id
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data.list);
        this.setData({
          dataList:res.data.list
        });
        wx.hideLoading()
      }
    })
  },



})