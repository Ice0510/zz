var createError = require('http-errors');
var express = require('express'); 
const multer = require('multer')   // 上传图片  npm install multer --save
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");   // 引入 fs文件上传


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// 改写, 从bin目录下剪切代码过来 , 然后就可以删除bin目录了
var http = require('http');
var server = http.createServer(app);
var cors = require('cors')
app.use(cors())

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);





//图片上传
app.post(
  "/upload",
  multer({
    //设置文件存储路径
    dest: "public/image", 
  }).array("file", 1),
  function (req, res, next) {
    console.log(req.files[0])
    let file = req.files[0];
    let fileInfo = {};
    var path = "image/" + Date.now().toString() + "_" + file.originalname;
    let path2 = "public/image/" + Date.now().toString() + "_" + file.originalname;
    console.log(path)
    fs.renameSync("./public/image/" + file.filename, path2);
    //获取文件基本信息
    fileInfo.type = file.mimetype;
    fileInfo.name = file.originalname;
    fileInfo.size = file.size;
    fileInfo.path = path;
       // string.substr(start,length) 从某一项开始，到某一项结束截取字符串，如果第二项不写就是从某一项开始截取后面所有字符串；
    var imgUrl = `http://127.0.0.1:5000/${path}`
    res.json({
      code: 200,
      msg: "OK",
      data: fileInfo,
      imgUrl
    });
    console.log(fileInfo)
    console.log(imgUrl)
  }
);

// module.exports = app;  改写之后这里就不用暴露出去了 ，直接在下面写一个监听端口
server.listen(5000,()=>{
  console.log("服务器启动成功！");
  console.log("可以使用http:127.0.0.1:5000进行访问了");
});
