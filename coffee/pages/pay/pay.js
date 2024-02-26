// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    youhuijuan:"",
    cartArr:[],  // 购物车中选中的商品
    totalPay:0,
    total:0,
    show:false,
    checkCartNo:[],  // 购物车中没有选中的商品
    youhui:"",   // 优惠
    heji:"",   // 优惠之后的价格
    bianhao:"",
    luck_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 获取缓存中的购物车数组
     let cartArr = wx.getStorageSync('cartArr')||[];
     //过滤购物车数组，选取 checked 为true的
      let checkedCart = cartArr.filter((item)=>{
         return item.check
     });
     //过滤购物车数组，选取 checked 为false的
     let checkCartNo = cartArr.filter((item)=>{
      return !item.check
  });
     //获取商品的总数量
     let total = 0;
     //获取商品的总价格
     let totalPay = 0
     checkedCart.forEach((item)=>{
         total += item.shopNum;
         totalPay += item.shopNum * item.money;
     });
     this.setData({
         total,
         totalPay:totalPay.toFixed(2),
         cartArr:checkedCart,
         checkCartNo
     });
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(wx.getStorageSync("youhuijuan"))
       console.log(JSON.stringify(+ new Date()).substr(-4))
    let yh = wx.getStorageSync("youhuijuan")||0;  // 优惠价格
    let jiage = this.data.totalPay - parseInt(yh);  // 优惠后的价格
    let str = `总价格${this.data.totalPay}，已优惠${yh}元！`;
    this.setData({
      youhui:str,
      heji:jiage.toFixed(2),
      youhuijuan:yh,
      bianhao:JSON.stringify(+ new Date()).substr(-4),   // 生成取餐码
    });
  },
  noop(){},
  onClickShow() {
    this.setData({ show: true });
  },
  onClickHide() {
    this.setData({ show: false });
  },

  // 跳转到优惠券的页面
  goLuck(){
    wx.setStorageSync('index', 1)
    wx.navigateTo({
      url: '../my_luck/my_luck',
    })
  },

  // 支付
  addPay(){
    wx.showLoading({
      title: '拼命支付中...',
    })
    setTimeout(()=>{
      wx.hideLoading()
      wx.request({
        url: 'http://127.0.0.1:5000/addDingdan',
        data: {
          dingdanArr:this.data.cartArr,
          tel:wx.getStorageSync('tel'),
          bianhao:this.data.bianhao
        },
        header: {
          'content-type': 'application/json' 
        },
        success:res=> {
          console.log(res.data)
          wx.hideLoading()
          this.setData({ show: false });
          wx.showModal({
            title: '提示',
            content:"支付成功！",
            showCancel:false,
            success:()=>{
              wx.setStorageSync('cartArr',this.data.checkCartNo)  //购买后将没有选中的商品重新添加到购物车数组
              wx.setStorageSync('youhuijuan',"")  
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
        }
      })
    },2000)
  },
})