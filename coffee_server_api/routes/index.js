var express = require('express');
var router = express.Router();
var db = require("../util/dbconfig");  // 引入数据库方法

var bodyparser = require('body-parser');
// 已解析表单提交数据为例 application/x-www-form-urlencoded
// extended: false 值是false时解析值是“String”或“Array” 值是true的时候可以解析任意类型的数据

//注册 
router.get('/register', (req, res) => {
  console.log(req.query);
  let sql1 = `select * from users where tel = '${req.query.tel}'`  // 查找数据表中是否已经存在用户
  // let sql1 = `select * from users where FIND_IN_SET('${req.query.user}', user)`  // 查找数据表中是否已经存在用户
  let sql2 = `INSERT INTO users(tel,paw) VALUES(?,?)`    // 插入语句，将前端传递过来的手机号和密码插入到数据库中
  db.query(sql1,function(err,data){
      if(err){
          res.send({
                  msg:"注册失败",
                  code:500
          });
      }else {
          if(data.length==0){  // data 为查询出来的结果，如果查询的手机号不存在，将会返回一个空数据 所有此时 data[0]==undefined, 执行插入语句操作;
              db.query(sql2,[req.query.tel,req.query.paw],function(err,data){
                  if(err){
                      res.send({
                          code:500,
                          msg:"注册失败!",
                      });
                      console.log(err)
                  }else {
                      res.send({
                              msg:"注册成功",
                              code:200
                      });
                  }
              });
          }else{
              // 当tel用户存在时
              res.send({code:0, msg:'用户名已存在'})
          }
      }
  });
});



// 登录
router.get('/signIn', (req, res)=>{
  let {
  tel,
  paw
  } = req.query;
let sql = `select * from users where FIND_IN_SET('${tel}', tel)`
db.query(sql,(err,data) => {
  // console.log(data)
  if (err) {
      console.log(err);
      return res.json({
          code: -1,
          msg: '登录失败'
      })
  } else {
      console.log("c")
      console.log(data);
      // 当data数组不为空时，代表该手机号注册过，然后匹对密码
      if(data.length==0){
          // 当 data 为空数组时，代表该手机号没有注册
          res.send({
              data:data,
              code:0,
              msg:"该用户没有注册"
          });
      }else{
          if(data[0].paw == paw){
              res.send({
                  data:data[0],
                  code:200,
                  msg:"登录成功！"
              });
          }else{
              res.send({
                  code:500,
                  msg:"密码错误"
              });
          }
      }
  }
  })
});

// 查看咖啡是否已经收藏    
router.get('/isStar', (req, res) => {    
    let sql = `select * from star where tel = '${req.query.tel}' && goods_id = '${req.query.goods_id}'`  // 查找数据表中是否存在
    db.query(sql, (err, data) => {
        if (err) {
            res.send({
                code: 500,
                msg: "获取失败"
            })
        } else {
            res.send({
                list: data,
                code: 200,
                 msg: "获取数据成功"
            })
        }
    });
  });

  //取消收藏
  router.get('/delStar', (req, res) => {
    let sql = `delete from star where goods_id = ${req.query.goods_id} && tel = ${req.query.tel}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
})
})

//查询所有的咖啡数据
router.get('/getData', (req, res) => {    
  var sql = "select * from goods";
  db.query(sql, (err, data) => {
      if (err) {
          res.send({
              code: 500, 
              msg: "获取失败"
          })
      } else {
          res.send({
              list: data,
              code: 200,
               msg: "获取数据成功"
          })
      }
  });
});

// 添加到收藏
router.get('/addSart', (req, res) => {
    console.log(req.query);   
    let sql2 = `INSERT INTO star(fenlei_id,goods_id,title,img,yuanliao,money,tel) VALUES(?,?,?,?,?,?,?)`    // 插入语句，将前端传递过来的手机号和密码插入到数据库中
  // data 为查询出来的结果，如果查询的手机号不存在，将会返回一个空数据 所有此时 data[0]==undefined, 执行插入语句操作;
                db.query(sql2,[req.query.fenlei_id,req.query.goods_id,req.query.title,req.query.img,req.query.yuanliao,req.query.money,req.query.tel],function(err,data){
                    if(err){
                        res.send({
                            code:500,
                            msg:"添加失败!",
                        });
                        console.log(err)
                    }else {
                        res.send({
                                msg:"添加成功!",
                                code:200
                        });
                    }
                });
  });

  // 分类
router.get('/getFenlei', (req, res) => {
    let sql1 = `select * from goods where fenlei_id = '${req.query.fenlei_id}'`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });

  // 我的收藏
  router.get('/getMyStar', (req, res) => {
    console.log(req.query);
    let sql1 = `select * from star where tel = '${req.query.tel}'`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"获取失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"获取成功！",
                code:"200"
            });
        }
    });
  });



// 添加咖啡接口
router.get('/addData', (req, res) => {
    console.log(req.query);
    let sql = `INSERT INTO goods(title,img,fenlei_id,yuanliao,money) VALUES(?,?,?,?,?)`    // 插入语句，将前端传递过来的手机号和密码插入到数据库中
        db.query(sql,[req.query.title,req.query.img,req.query.fenlei_id,req.query.yuanliao,req.query.money],function(err,data){
                if(err){
                    res.send({
                        code:500,
                        msg:"添加失败!",
                    });
                        console.log(err)
                    }else {
                        // console.log(data);
                        // res.redirect("/users"); 重定向，添加完后返回到用户首页
                        res.send({
                            msg:"添加成功!",
                             code:200
                    });
                }
        });
  });

  // 用户购买将咖啡添加到订单
router.get('/addDingdan', (req, res) => {
    const arr = JSON.parse(req.query.dingdanArr);
    let sql = `INSERT INTO dingdan(goods_id,shopNum,title,img,yuanliao,money,tel,bianhao) VALUES(?,?,?,?,?,?,?,?)`    // 插入语句
    for(let i=0;i<arr.length;i++){
        db.query(sql,[arr[i].goods_id,arr[i].shopNum,arr[i].title,arr[i].img,arr[i].yuanliao,arr[i].money,`${req.query.tel}`,`${req.query.bianhao}`],function(err,data){
            if(err){
                console.log(err)
                if(i==arr.length-1){
                    res.send({
                        code:500,  
                        msg:"订单提交成功!",
                    });
                }
                }else {
                    console.log(data);
                if(i==arr.length-1){
                    res.send({
                        msg:"订单提交成功!",
                         code:200
                  });
                }
            }
    });
    }
  });

// 我的订单
router.get('/myDingdan', (req, res)=>{
let sql = `select * from dingdan where tel = '${req.query.tel}'`
db.query(sql,(err,data) => {
    // console.log(data)
    if (err) {
        console.log(err);
        return res.json({
            code: 500,
            msg: '获取失败'
        })
    } else {
            console.log(data)
            res.send({
                list:data,
                code:200,
                msg:"获取成功"
            });
        }
  })
});

// 获取所有订单
router.get('/getDingdan', (req, res)=>{
    let sql = `select * from dingdan`
    db.query(sql,(err,data) => {
        // console.log(data)
        if (err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: '获取失败'
            })
        } else {
                console.log(data)
                res.send({
                    list:data,
                    code:200,
                    msg:"获取成功"
                });
            }
      })
    });

 // 修改订单
 router.get('/updateOrder', (req,res)=>{
    var sql = `update dingdan set tel='${req.query.tel}',shopNum='${req.query.shopNum}',money='${req.query.money}' where dingdan_id='${req.query.dingdan_id}'`;
    console.log(req.query);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            // res.redirect("/users");
            console.log(data,"a")
            res.send({
               msg:"修改成功",
               code:200
           
            });
        }
    })
})

// 评论
router.get('/star', (req, res) => {
    console.log(req.query);
    let sql = `INSERT INTO pinglun(nickName,name_img,goods_id,msg,star,tel,shijian) VALUES(?,?,?,?,?,?,?)`    // 插入语句，将前端传递过来的手机号和密码插入到数据库中
        db.query(sql,[req.query.nickName,req.query.name_img,req.query.goods_id,req.query.msg,req.query.star,req.query.tel,req.query.shijian],function(err,data){
                if(err){
                    res.send({
                        code:500,
                        msg:"添加失败!",
                    });
                        console.log(err)
                    }else {
                        res.send({
                            msg:"添加成功!",
                             code:200
                    });
                }
        });
  });

  // 评价后，修改订单状态
  router.get('/xgOrderStar', (req,res)=>{
    var sql = `update dingdan set active='1' where dingdan_id='${req.query.dingdan_id}'`;
    console.log(req);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            // res.redirect("/users");
            console.log(data,"a")
            res.send({
               msg:"修改成功",
               code:200
           
            });
        }
    })
})

// 获取咖啡评论
router.get('/getPinglun', (req, res) => {
    let sql1 = `select * from pinglun where goods_id = '${req.query.goods_id}'`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });


// 用户管理


// 获取所有用户
  router.get('/getUser', (req, res) => {
    let sql1 = `select * from users`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });

 // 修改用户信息
 // 修改列表,根据id修改
 router.get('/updateUser', (req,res)=>{
    var sql = `update users set paw='${req.query.paw}',xingming='${req.query.xingming}',xingbie='${req.query.xingbie}' where id='${req.query.id}'`;
    console.log(req);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            console.log(data,"a")
            res.send({
               msg:"修改成功",
               code:200
           
            });
        }
    })
})

// admin 修改密码
 router.get('/updatePost', (req,res)=>{
    var sql = `update users set paw='${req.query.paw}' where id='${req.query.id}'`;
    console.log(req);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            console.log(data,"a")
            res.send({
               msg:"修改成功",
               code:200
           
            });
        }
    })
})

// 获取用户个人信息
router.get('/getUserInfo', (req, res) => {
    let sql1 = `select * from users where id = '${req.query.id}'`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });


// 删除用户
router.get('/delUser', (req, res) => {
    let sql = `delete from users where id = ${req.query.id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
})
})

// 修改商品信息
router.get('/updateData', (req,res)=>{
    var sql = `update goods set title='${req.query.title}',fenlei_id=${req.query.fenlei_id},yuanliao='${req.query.yuanliao}',money='${req.query.money}' where goods_id='${req.query.goods_id}'`;
    console.log(req);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            console.log(data,"a")
            res.send({
               msg:"修改成功",
               code:200
           
            });
        }
    })
})

// 删除咖啡
router.get('/delData', (req, res) => {
    let sql = `delete from goods where goods_id = ${req.query.goods_id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
})
})

// 删除订单
router.get('/delOrder', (req, res) => {
    let sql = `delete from dingdan where dingdan_id = ${req.query.dingdan_id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
   })
})

// 获取用户所有评论
router.get('/getPinglunAll', (req, res) => { 
    let sql = `select * from pinglun`
    db.query(sql,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            console.log(data)
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });

  // 删除评论 
  router.get('/delPinglun', (req, res) => {
    let sql = `delete from pinglun where pinglun_id = ${req.query.pinglun_id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
   })
})

// 修改评论
router.get('/updatePinglun', (req,res)=>{
    var sql = `update pinglun set msg='${req.query.msg}',star='${req.query.star}' where pinglun_id='${req.query.pinglun_id}'`;
    console.log(req.query);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            console.log(data,"a")
            res.send({
               msg:"修改成功",
               code:200
           
            });
        }
    })
})

// 获取用户收藏
  router.get('/getStar', (req, res) => {
    let sql1 = `select * from star`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"获取失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"获取成功！",
                code:"200"
            });
        }
    });
  });

   //  删除收藏
   router.get('/delUserStar', (req, res) => {
    let sql = `delete from star where star_id = ${req.query.star_id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
})
})


  // 获取公告
  router.get('/getGonggao', (req, res) => {
    let sql1 = `select * from gonggao`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            console.log(data)
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });

      // 修改公告
      router.get('/updateGonggao', (req,res)=>{
        var sql = `update gonggao set msg='${req.query.msg}' where msg_id='1'`;
        console.log(req);
        db.query(sql,function(err,data){
            if(err){
                console.log(err,"v")
                res.send("修改失败 " + err);
            }else {
                // res.redirect("/users");
                console.log(data,"a")
                res.send({
                   msg:"修改成功",
                   code:200
               
                });
            }
        })
    })


    

// 根据咖啡标题名称查询咖啡数据
router.get('/search', (req, res)=>{
    // 查询语句
    let sql = `select * from goods where title REGEXP '${req.query.title}'`
    db.query(sql,(err,data) => {
        if (err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: '搜索失败'
            })
        } else {
                console.log(data)
                res.send({
                    list:data,
                    code:200,
                    msg:"搜索成功"
                });
            }
      })
    });

// 后台管理员根据用户手机号查询用户
router.get('/searchUser', (req, res)=>{
    // 查询语句
    let sql = `select * from users where tel REGEXP '${req.query.tel}'`
    db.query(sql,(err,data) => {
        if (err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: '搜索失败'
            })
        } else {
                console.log(data)
                res.send({
                    list:data,
                    code:200,
                    msg:"搜索成功"
                });
            }
      })
    });


// 根据用户手机号查询用户订单
router.get('/searchOrder', (req, res)=>{
    // 查询语句
    let sql = `select * from dingdan where tel REGEXP '${req.query.tel}'`
    db.query(sql,(err,data) => {
        if (err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: '搜索失败'
            })
        } else {
                console.log(data)
                res.send({
                    list:data,
                    code:200,
                    msg:"搜索成功"
                });
            }
      })
    });
   
// 根据用户手机号查询用户评论
router.get('/searchPinglun', (req, res)=>{
    // 查询语句
    let sql = `select * from pinglun where tel REGEXP '${req.query.tel}'`
    db.query(sql,(err,data) => {
        if (err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: '搜索失败'
            })
        } else {
                console.log(data)
                res.send({
                    list:data,
                    code:200,
                    msg:"搜索成功"
                });
            }
      })
    });


// 查询所有分类
router.get('/getClassTabs', (req, res)=>{
    // 查询语句
    let sql = `select * from fenlei`
    db.query(sql,(err,data) => {
        if (err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: '搜索失败'
            })
        } else {
                console.log(data)
                res.send({
                    list:data,
                    code:200,
                    msg:"搜索成功"
                });
            }
      })
    });

      // 修改分类
      router.get('/updateClassTabs', (req,res)=>{
        var sql = `update fenlei set text='${req.query.text}' where fenlei_id='${req.query.fenlei_id}'`;
        console.log(req);
        db.query(sql,function(err,data){
            if(err){
                console.log(err,"v")
                res.send("修改失败 " + err);
            }else {
                res.send({
                   msg:"修改成功",
                   code:200
               
                });
            }
        })
    })

// 添加分类
router.get('/addClassTabs', (req, res) => {
    console.log(req.query);
    let sql = `INSERT INTO fenlei(text) VALUES(?)`
        db.query(sql,[req.query.text],function(err,data){
                if(err){
                    res.send({
                        code:500,
                        msg:"添加失败!",
                    });
                        console.log(err)
                    }else {
                        res.send({
                            msg:"添加成功!",
                             code:200
                    });
                }
        });
  });



  // 删除分类
  router.get('/delClassTabs', (req, res) => {
    let sql = `delete from fenlei where fenlei_id = ${req.query.fenlei_id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
})
})

  // 抽奖
  router.get('/luck', (req, res) => {
    console.log(req.query);
    let sql = `INSERT INTO luck(tel,msg,shijian,num) VALUES(?,?,?,?)`   
        db.query(sql,[req.query.tel,req.query.msg,req.query.shijian,req.query.num],function(err,data){
                if(err){
                    res.send({
                        code:500,
                        msg:"添加失败!",
                    });
                        console.log(err)
                    }else {
                        res.send({
                            msg:"添加成功!",
                             code:200
                    });
                }
        });
  });

  // 获取个人抽奖 
  router.get('/getMyLuck', (req, res) => {
    let sql1 = `select * from luck where tel = '${req.query.tel}'`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });

  // 优惠券使用之后 删除优惠券
router.get('/delLuck', (req, res) => {
    let sql = `delete from luck where luck_id = ${req.query.luck_id}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                code: 500,
                msg: "删除失败"
            })
        } else {
            res.send({
                code: 200,
                msg: "删除成功"
        })
    }
})
})

  // 获取待出餐
  router.get('/getChucan', (req, res) => {
    let sql1 = `select * from dingdan where tel = '${req.query.tel}' && is_chucan=0`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });

  // 获取待确认的
  router.get('/getQueren', (req, res) => {
    let sql1 = `select * from dingdan where tel = '${req.query.tel}' && is_queren=0 && is_chucan=1`
    db.query(sql1,function(err,data){
        if(err){
            res.send({
                    msg:"查询失败",
                    code:500
            });
        }else {
            res.send({
                list:data,
                msg:"查询成功！",
                code:"200"
            });
        }
    });
  });

    // 获取待评价
    router.get('/getPingjia', (req, res) => {
        let sql1 = `select * from dingdan where tel = '${req.query.tel}' && is_queren=1`
        db.query(sql1,function(err,data){
            if(err){
                res.send({
                        msg:"查询失败",
                        code:500
                });
            }else {
                res.send({
                    list:data,
                    msg:"查询成功！",
                    code:"200"
                });
            }
        });
      });


  // 出餐后修改订单状态
  router.get('/updateChucan', (req,res)=>{
    var sql = `update dingdan set is_chucan='1' where dingdan_id='${req.query.dingdan_id}'`;
    console.log(req.query);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            res.send({
               msg:"修改成功",
               code:200
            });
        }
    })
})

 // 确认之后修改订单状态
 router.get('/updateQueren', (req,res)=>{
    var sql = `update dingdan set is_queren='1' where dingdan_id='${req.query.dingdan_id}'`;
    console.log(req.query);
    db.query(sql,function(err,data){
        if(err){
            console.log(err,"v")
            res.send("修改失败 " + err);
        }else {
            res.send({
               msg:"修改成功",
               code:200
            });
        }
    })
})

  

module.exports = router;
