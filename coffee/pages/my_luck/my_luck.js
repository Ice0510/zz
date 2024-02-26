// pages/my_luck/my_luck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyLuck()
  },

  // 使用
  luck(e){
    console.log(e.currentTarget.dataset.id);
    wx.showLoading({
      title: '请稍后...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/delLuck',
      data: {
        luck_id:e.currentTarget.dataset.item.luck_id
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data)
        setTimeout(()=>{
           wx.hideLoading();
           wx.showModal({
           title: '提示',
           content:"使用成功，点咖啡吧！",
           showCancel:false,
           success:()=>{
            this.getMyLuck()
            wx.navigateBack({
              delta: 1
            })
            wx.setStorageSync("youhuijuan",e.currentTarget.dataset.item.num);
           }
         })
        },1500);
      }
    })
  },

  // 获取所有的抽奖数据
  getMyLuck(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getMyLuck',
      data: {
        tel:wx.getStorageSync('tel')
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data)
        this.setData({
          dataList:res.data.list
        });
        wx.hideLoading()
      }
    })
  },


})