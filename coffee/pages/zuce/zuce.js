// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    paw:'',
    paws:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUser(e){
    console.log(e.detail.value)
    this.setData({
      user:e.detail.value
    });
  },
  getPaw(e){
    console.log(e.detail.value)
    this.setData({
      paw:e.detail.value
    });
  },
  getPaws(e){
    console.log(e.detail.value)
    this.setData({
      paws:e.detail.value
    });
  },
  login(){
    // 身份证验证
    let reg = /^1[0-9]{10}$/;
    let isId = reg.test(this.data.user)
    if(!isId){
      wx.showModal({
        title: '提示',
        content: "请输入合法的手机号",
        showCancel:false,
        success () {
        }
      })
      return
    }
    // 密码验证
    if(!(this.data.paw.length>=6&&this.data.paw.length<=16)){
      wx.showModal({
        title: '提示',
        content: "密码必须是6-16位",
        showCancel:false,
        success () {
        }
      })
      return
    }
    if(!(this.data.paw==this.data.paws)){
      wx.showModal({
        title: '提示',
        content: "两次密码不一样！",
        showCancel:false,
        success () {
        }
      })
      return
    }
    if(this.data.user&&this.data.paw){
      wx.showLoading({
        title: '提交中',
      })
      wx.request({
        url: 'http://127.0.0.1:5000/register', // 注册
        data: {
          tel: this.data.user,
          paw: this.data.paw
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          wx.hideLoading()
          console.log(res.data)
          if(res.data.code==500){
            wx.showModal({
              title: '提示',
              content: "注册失败",
              showCancel:false,
              success () {
              }
            })
          }
          if(res.data.code==0){
            wx.showModal({
              title: '提示',
              content: "该用户已存在",
              showCancel:false,
              success () {
              }
            })
          }
          if(res.data.code==200){
            wx.showModal({
              title: '提示',
              content: "注册成功",
              showCancel:false,
              success:(res2)=> {
                if (res2.confirm) {
                  wx.navigateTo({
                    url: '../login/login'
                  })
                }
              }
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请把信息输入完整',
        showCancel:false,
        success (res) {
        }
      })
    }
  },

  // 注册
  goLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

 
})