// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    msg:"",    // 公告
    dataList:[],
    reArr:[]   // 猜你喜欢  
  },
  // 事件处理函数
  onLoad() { 
  },
  
  onShow: function () {
    this.getGonggao();
    this.getData();
  },

   // 获取所有咖啡信息
   getGonggao(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getGonggao',
      data: {
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data.list)
        this.setData({  
          msg:res.data.list[0].msg,
        });
        wx.hideLoading()
      }
    })
  },

 
  // 跳转到详情页
  goDetail(e){
    console.log(e.currentTarget.dataset.obj);
    wx.navigateTo({
      url: '../detail/detail?data=' + JSON.stringify(e.currentTarget.dataset.obj)   
    })
  },

  // 获取所有咖啡信息
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getData',
      data: {
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        var arr = res.data.list;
        console.log(res.data)
        this.setData({  
          dataList:res.data.list,
          reArr:arr.slice(6,24)
        });
        wx.hideLoading()
      }
    })
  },

// 跳转到抽奖页面
  goLuck(){
    wx.navigateTo({
      url:"../luck_draw/luck_draw"
    });
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

  // 跳转到搜索
  goSearch(){
    wx.navigateTo({
      url: '../search/search',
    })
   },
})
