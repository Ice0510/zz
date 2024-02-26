// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star:0,  // 评分
    goods_id:"",
    dingdan_id:"",
    msg:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(JSON.parse(options.obj));
    this.setData({
      goods_id:JSON.parse(options.obj).goods_id,
      dingdan_id:JSON.parse(options.obj).dingdan_id
    });
  },

  // 获取评价内容
  getMsgInput(e){
    console.log(e.detail.value);
    this.setData({
      msg:e.detail.value
    });
  },

  // 评分
  onChange(e){
    console.log(e.detail)
    this.setData({
      star:e.detail
    });
  },

  // 提交  
  star(){
    if(this.data.msg){
      wx.showLoading({
        title: '请稍后...',
      })
      wx.request({
        url: 'http://127.0.0.1:5000/star',
        data: {
          goods_id:this.data.goods_id,
          msg:this.data.msg,
          star:this.data.star,
          tel:wx.getStorageSync('tel'),
          nickName:wx.getStorageSync("userInfo").nickName,
          name_img:wx.getStorageSync("userInfo").avatarUrl,
          shijian:this.getTime(),
        },
        header: {
          'content-type': 'application/json' 
        },
        success:res=> {
          console.log(res.data)
        }
      })

      // 修改订单评价状态
      wx.request({
        url: 'http://127.0.0.1:5000/xgOrderStar',
        data: {
          dingdan_id:this.data.dingdan_id,
        },
        header: {
          'content-type': 'application/json' 
        },
        success:res=> {
          console.log(res.data)
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content:"评价成功！",
            showCancel:false,
            success:()=>{
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content:"请输入评价信息！",
        showCancel:false,
        success:()=>{
          return
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 获取当前时间
  //显示日期在页面上  yyy-MM-dd
  getTime(){
	  var now = new Date();
	  var year = now.getFullYear(); //得到年份
	  var month = now.getMonth();//得到月份
	  var date = now.getDate();//得到日期
	  var day = now.getDay();//得到周几
	  var hour = now.getHours();//得到小时
	  var minu = now.getMinutes();//得到分钟
	  var sec = now.getSeconds();//得到秒
	  month = month + 1;
	  if (month < 10) month = "0" + month;
	  if (date < 10) date = "0" + date;
	  if (hour < 10) hour = "0" + hour;
	  if (minu < 10) minu = "0" + minu;
	  if (sec < 10) sec = "0" + sec;
	  var time = "";
	  //精确到天
		time = year + "-" + month + "-" + date;
    // return time;
    console.log(time)
    return time
},


})