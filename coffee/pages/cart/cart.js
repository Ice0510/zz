// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartArr:[],
    // 全选
    allCheck:true,
    // 总价
    totalPrice:0,
    // 商品总数
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onShow (options) {
   
    // 获取购物车数组
    let cartArr = wx.getStorageSync('cartArr')||[];
    this.setCart(cartArr)

  },

  handlePay() {
    let is_kong = this.data.cartArr.some(item=>{
      return item.check == true
    })
    console.log(is_kong)
    if(is_kong&&this.data.cartArr!==0){
      this.setData({ show: true });
      wx.navigateTo({
      url: '../pay/pay',
    })
    }else{
      wx.showModal({
        title: '提示',
        content: '还没有选择商品',
        showCancel:false,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },


  // 单选框切换
  checkedChange(e){
    console.log(e.currentTarget.dataset);
     //   console.log(e)
    // 获取点击的商品id
    let id = e.currentTarget.dataset.id;
    //获取购物车数组
    let {cartArr} = this.data;
    // 找到被修改的商品对象
    let index = cartArr.findIndex((item)=>item.goods_id === id);   // 找到后会返回对应的索引值
    //找到后 取反
    cartArr[index].check =! cartArr[index].check
    //将 数组重新填回data中 和缓存中
    this.setData({
      cartArr
    });
    //重新计算总价格和总数量
    this.setCart(cartArr);
  },
   //点击全选
   allCheckedChange(){
    //获取到购物车数组 和全选变量
    let {cartArr,allCheck} = this.data;
    // 全选取反
    allCheck =! allCheck;
    // 然后将每一项单选框的状态都取值和全选一样
      cartArr.forEach((item)=> item.check=allCheck);
      this.setData({
        allCheck
      });
      //重新计算商品数量和总价格
      this.setCart(cartArr);
  },

  // 修改商品数量
  operationGoods(e) {
    // console.log(e);
    //获取购物车数组
    let {cartArr} = this.data;
    //获取修改商品id 和 加减参数
    let {id,operation} = e.currentTarget.dataset;
    //获取要修改商品的索引
   let index = cartArr.findIndex((item)=> item.goods_id == id);
   if(cartArr[index].shopNum===1&&operation===-1){
       // 弹框提示
       wx.showModal({
        title: '提示',
        content: '您是否要删除该商品',
        success:(res)=>{
          if (res.confirm) {
            cartArr.splice(index,1);
           this.setCart(cartArr);
            console.log('用户点击确定')
            }
           }
        }) 
       }else{
        // 进行商品数量修改
        cartArr[index].shopNum += operation;
        //重新计算 商品总价 和商品数量
        this.setCart(cartArr);
   }
},

   // 设置购物车状态同时 重新计算底部工具栏的数据 全选 总价格 购买数量
   setCart(cartArr){
    //计算全选
    const allCheck = cartArr.length>0?cartArr.every((item)=>item.check) : false;
    // console.log(allCheck)
    //计算总数量
    let totalNum = 0;
    let totalPrice = 0;
    cartArr.forEach((item)=>{
        if(item.check){  //如果当前商品是处于选中状态，那就计算
            totalNum += item.shopNum  //计算商品数量
            totalPrice += item.money*item.shopNum
            console.log("q",item.shopNum)
        }
    });
    this.setData({
        cartArr,
        allCheck,
        totalPrice,
        totalNum,
    });
    //计算完后 将购物车数组重新 保存到缓存中
    wx.setStorageSync('cartArr',cartArr);
    console.log(totalPrice)
}
})