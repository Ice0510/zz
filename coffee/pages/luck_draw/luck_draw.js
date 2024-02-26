// 上下文对象
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_play: false,// 是否在运动中，避免重复启动bug
    available_num: 3,// 可用抽奖的次数，可自定义设置或者接口返回
    start_angle: 0,// 转动开始时初始角度=0位置指向正上方，按顺时针设置，可自定义设置
    base_circle_num: 9,// 基本圈数，就是在转到（最后一圈）结束圈之前必须转够几圈 ，可自定义设置
    low_circle_num: 5,// 在第几圈开始进入减速圈（必须小于等于基本圈数），可自定义设置
    add_angle: 10,// 追加角度，此值越大转动越快，请保证360/add_angle=一个整数，比如1/2/3/4/5/6/8/9/10/12等
    use_speed: 1,// 当前速度，与正常转速值相等
    nor_speed: 1,// 正常转速，在减速圈之前的转速，可自定义设置
    low_speed: 10,// 减速转速，在减速圈的转速，可自定义设置
    end_speed: 20,// 最后转速，在结束圈的转速，可自定义设置
    random_angle: 0,// 中奖角度，也是随机数，也是结束圈停止的角度，这个值采用系统随机或者接口返回
    change_angle: 0,// 变化角度计数，0开始，一圈360度，基本是6圈，那么到结束这个值=6*360+random_angle；同样change_angle/360整除表示走过一整圈
    result_val: "未中奖",// 存放奖项容器，可自定义设置
    Jack_pots: [// 奖项区间 ，360度/奖项个数 ，一圈度数0-360，可自定义设置
     // random_angle是多少，在那个区间里面就是中哪个奖项
      {
        startAngle: 1,
        endAngle: 51,
        val: "一等奖：15元优惠券",
        num:"15"
      },
      {
        startAngle: 52,
        endAngle: 102,
        val: "二等奖：10元优惠券",
        num:"10"
      },
      {
        startAngle: 103,
        endAngle: 153,
        val: "三等奖：5元优惠券",
        num:"5"
      },
      {
        startAngle: 154,
        endAngle: 203,
        val: "很遗憾，未中奖！"
      },
      {
        startAngle: 204,
        endAngle: 251,
        val: "很遗憾，未中奖！"
      },
      {
        startAngle: 252,
        endAngle: 307,
        val: "很遗憾，未中奖！"
      },
      {
        startAngle: 307,
        endAngle: 360,
        val: "很遗憾，未中奖！"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // that.luckDrawStart();
  },

  /**
   * 启动抽奖
   */
  luckDrawStart: function () {
    if(this.data.available_num>0){
      // 阻止运动中重复点击
    if (!that.data.is_play) {
      // 设置标识在运动中
      that.setData({
        is_play: true
      });
      // 重置参数
      that.luckDrawReset();
      // 几率随机，也可从服务端获取几率
      that.setData({
        random_angle: Math.ceil(Math.random() * 360)
      });
     // 运动函数
      setTimeout(that.luckDrawChange, that.data.use_speed);
     };
    }else{
      wx.showModal({
        title: '提示',
        content: "抽奖机会已用完！",
        showCancel:false,
        success () {
          
        }
      })
    }
  },

  /**
   * 转盘运动
   */
  luckDrawChange: function () {
   // 继续运动
    if (that.data.change_angle >= that.data.base_circle_num * 360 + that.data.random_angle) {// 已经到达结束位置
     // 提示中奖，
      that.getLuckDrawResult();
     // 运动结束设置可用抽奖的次数和激活状态设置可用
      that.luckDrawEndset();
    } else {// 运动
      if (that.data.change_angle < that.data.low_circle_num * 360) {// 正常转速
        // console.log("正常转速")
        that.data.use_speed = that.data.nor_speed
      } else if (that.data.change_angle >= that.data.low_circle_num * 360 && that.data.change_angle <= that.data.base_circle_num * 360) {// 减速圈
        // console.log("减速圈")
        that.data.use_speed = that.data.low_speed
      } else if (that.data.change_angle > that.data.base_circle_num * 360) {// 结束圈
       // console.log("结束圈")
        that.data.use_speed = that.data.end_speed
      }
     // 累加变化计数
      that.setData({
        change_angle: that.data.change_angle + that.data.add_angle >= that.data.base_circle_num * 360 + that.data.random_angle ? that.data.base_circle_num * 360 + that.data.random_angle : that.data.change_angle + that.data.add_angle
      });
      setTimeout(that.luckDrawChange, that.data.use_speed);
    }

  },

  /**
   * 重置参数
   */
  luckDrawReset: function () {
    // 转动开始时首次点亮的位置，可自定义设置
    that.setData({
      start_angle: 0
    });
    // 当前速度，与正常转速值相等
    that.setData({
      use_speed: that.data.nor_speed
    });
    // 中奖索引，也是随机数，也是结束圈停止的位置，这个值采用系统随机或者接口返回
    that.setData({
      random_angle: 0
    });
    // 变化计数，0开始，必须实例有12个奖项，基本是6圈，那么到结束这个值=6*12+random_number；同样change_num/12整除表示走过一整圈
    that.setData({
      change_angle: 0
    });
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

  /**
   * 获取抽奖结果
   */
  getLuckDrawResult: function () {
    for (var j = 0; j < that.data.Jack_pots.length; j++) {
      if (that.data.random_angle >= that.data.Jack_pots[j].startAngle && that.data.random_angle <= that.data.Jack_pots[j].endAngle) {
        that.setData({
          result_val: that.data.Jack_pots[j].val
        });
        wx.showModal({
          title: '抽奖结果',
          content: that.data.Jack_pots[j].val,
          showCancel:false,
          success:()=>{
            console.log(that.data.Jack_pots[j].val);
            console.log(j);
            // j = 0 ， 1 ，2 的时候是中奖
               if(j==0||j==1||j==2){
                wx.showLoading({
                  title: '请稍后...',
                })
                wx.request({ 
                  url: 'http://127.0.0.1:5000/luck', 
                  data: {
                     msg:that.data.Jack_pots[j].val,
                     num:that.data.Jack_pots[j].num,
                     tel:wx.getStorageSync('tel'),
                     shijian:that.getTime()
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success:(res)=> {
                    console.log(res.data)
                    wx.hideLoading()
                    if(res.data.code==200){
                      wx.showModal({
                        title: '提示',
                        content: "奖励保存成功！",
                        showCancel:false,
                        success () {
                          
                        }
                      })
                    }else{
                      wx.showModal({
                        title: '提示',
                        content: "保存失败！",
                        showCancel:false,
                        success () {
                          
                        }
                      })
                    }
                  }
                })
              }
          }
        })
        break;
      };
    };
  },

  /**
   * 更新状态（运动结束设置可用抽奖的次数和激活状态设置可用）
   */
  luckDrawEndset: function () {
    // 是否在运动中，避免重复启动bug
    that.setData({
      is_play: false
    })
    // 可用抽奖的次数，可自定义设置
    that.setData({
      available_num: that.data.available_num - 1
    });
  },
})