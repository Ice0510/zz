// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:[],
    itemArr:[],
    is_active:'',  // 收藏
    pinglunNum:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.data)
    console.log(data);
    this.setData({
      obj:data
    });
    this.getData();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isStar();  // 查看用户是否收藏过
    this.getPinglun()   // 获取用户评论
  },

  isStar(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/isStar',
      data: {
        tel:wx.getStorageSync("tel"),
        goods_id:this.data.obj.goods_id
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data.list)
         if(res.data.list.length>0){
           this.setData({
            is_active:true
           });
         }else{
          this.setData({
            is_active:false
           });
         }
        wx.hideLoading()
      }
    })
  },

  // 收藏  
  addStar(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/addSart',
      data: {
         goods_id:this.data.obj.goods_id,
         tel:wx.getStorageSync("tel"),
         yuanliao:this.data.obj.yuanliao,
         money:this.data.obj.money,
         title:this.data.obj.title,
         img:this.data.obj.img,
         fenlei_id:this.data.obj.fenlei_id
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data)
        wx.showModal({
          title: '提示',
          content: "收藏成功！",
          showCancel:false,
          success :()=> {
            this.isStar();
          }
        })
        wx.hideLoading()
      }
    })
  },
  // 取消收藏
  delStar(){
    wx.showModal({
      title: '提示',
      content: '确定要取消收藏吗？',
      success:(res)=> {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',
          })
          wx.request({
            url: 'http://127.0.0.1:5000/delStar',
            data: {
              tel:wx.getStorageSync("tel"),
              goods_id:this.data.obj.goods_id
            },
            header: {
              'content-type': 'application/json' 
            },
            success:res=> {
              this.isStar()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
          pinglunNum:res.data.list.length
        });
        wx.hideLoading()
      }
    })
  },

  // 更多推荐
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getData',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res=> {
        console.log(res.data)
        this.setData({
          dataList:res.data.list.splice(2,13)
        });
        wx.hideLoading()
      }
    })
  },

  // 详情
  goDetail(e){
    console.log(e.currentTarget.dataset.obj);
    wx.navigateTo({
      url: '../detail/detail?data=' + JSON.stringify(e.currentTarget.dataset.obj)   
    })
  },

    // 将商品添加购物车
    addCart(){
      // console.log(e.currentTarget.dataset.item._id)
      // const objItem = e.currentTarget.dataset.item;
      console.log(this.data.obj.goods_id);
      // 获取缓存中的购物车数组
      const cartArr = wx.getStorageSync('cartArr')||[];
     let index = cartArr.findIndex(item=>{   // findIndex 进行匹配，如果找不到则返回 -1 如果找到就返回 索引
        return item.goods_id == this.data.obj.goods_id
      })
      if(index==-1){
        // 如果商品不存在
        this.data.obj.shopNum = 1;
        this.data.obj.check = false;
        cartArr.push(this.data.obj)
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

  
    // 立即购买
  gmCart(){
    const cartArr = wx.getStorageSync('cartArr')||[];  // 获取缓存中的购物车数组
    let index = cartArr.findIndex(item=>{   // findIndex 进行匹配，如果找不到则返回 -1 如果找到就返回 索引
       return item.goods_id == this.data.obj.goods_id
     })
     if(index==-1){
       // 如果商品不存在
       this.data.obj.shopNum = 1;
       this.data.obj.check = false;
       cartArr.push(this.data.obj)
     }else{
       // 如果商品存在，就将商品 +1处理
       cartArr[index].shopNum ++;
     }
     console.log(index);
     console.log(cartArr);
     // 然后在将购物车数组存入缓存中
     wx.setStorageSync('cartArr',cartArr);
     wx.switchTab({
       url: '../cart/cart',   // 跳转到购物车页面
     })
  },
  
  // 跳转到评论 
  goPinglun(){
    wx.navigateTo({
      url:"../pinglun/pinglun?obj="+JSON.stringify(this.data.obj)
    })
  }

})