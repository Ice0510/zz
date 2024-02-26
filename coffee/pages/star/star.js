// pages/my_shujia/my_shujia.js
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
    this.getMyStar();
  },

  goDetail(e){
    console.log(e.currentTarget.dataset.obj);
    wx.navigateTo({
      url: '../detail/detail?data=' + JSON.stringify(e.currentTarget.dataset.obj)   
    })
  },

  // 商品添加到购物车
  addCart(e){
    console.log(e.currentTarget.dataset.item.goods_id)
    const objItem = e.currentTarget.dataset.item;
    // 获取缓存中的购物车数组
    const cartArr = wx.getStorageSync('cartArr')||[];
   let index = cartArr.findIndex(item=>{   // findIndex 进行匹配，如果找不到则返回 -1 如果找到就返回 索引
      return item.goods_id == objItem.goods_id
    })
    if(index==-1){
      // 如果商品不存在
      objItem.shopNum = 1;
      objItem.check = false;
      cartArr.push(objItem)
    }else{
      // 如果商品存在，就将商品 +1处理
      cartArr[index].shopNum ++;
    }
    console.log(index);
    console.log(cartArr);
    // 然后在讲购物车数组存入缓存中
    wx.setStorageSync('cartArr',cartArr);
    wx.showToast({
      title: '添加商品成功！',
      icon: 'success',
      duration: 1000
    })
  },

  // 获取所有收藏咖啡
  getMyStar(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getMyStar',
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