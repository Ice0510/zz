// 引入数据库
const mysql = require('mysql'); 
// 普通连接方式
var db = mysql.createConnection({
    host: '127.0.0.1',  // 本地服务主机
    port: '3306',       // 数据库端口号
    user: 'root',    // 数据库的用户名
    password: 'root',   // 数据库密码
    database: 'coffee'   // 数据库名称
});
db.connect((err) => {   
    err ? console.log("数据库连接失败！",err) : console.log("数据库连接成功！",db.query);
    
});
module.exports = db;

