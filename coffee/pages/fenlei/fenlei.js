// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   * 0 html
   * 1 css
   * 2 js
   * 3 框架
   * 4 其他
   */
  data: {
    rightConentList:[],
    leftMenuList:[],
    currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow(){
    this.getClassTabs();
  },

  
  // 获取分类列表
  getClassTabs(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getClassTabs',
      data: {
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data)
        this.getFenlei(res.data.list[0].fenlei_id);
        this.setData({  
          leftMenuList:res.data.list,
          currentIndex:res.data.list[0].fenlei_id
        });
        wx.hideLoading()
      }
    })
  },

  //获取分类数据
  getFenlei(fenlei_id){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getFenlei',
      data: {
        fenlei_id
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data)
        this.setData({
          rightConentList:res.data.list
        });
        wx.hideLoading()
      }
    })
  },
  
  // 切换
  handleItemTap(e){
    console.log(e.currentTarget.dataset.id)
    this.setData({
      currentIndex:e.currentTarget.dataset.id
    });
    this.getFenlei(this.data.currentIndex);
  },

  // 跳转详情页
  goDetail(e){
    console.log(e.currentTarget.dataset.obj)
    wx.navigateTo({
      url: '../detail/detail?data='+JSON.stringify(e.currentTarget.dataset.obj),
    })
  },

    // 跳转到搜索
    goSearch(){
     wx.navigateTo({
       url: '../search/search',
     })
    },

})