/*
*小肥牛扫码点餐项目API子系统
*/
const PORT = 8090; 
const express = require('express');
const cors = require('cors');
const categoryRouter = require('./routes/admin/category');

//创建HTTP应用服务器
var app = express(); 
app.listen(PORT, ()=>{
  console.log('Server Listening: '+PORT);
});

//使用中间件
app.use(cors());

//挂载路由器
app.use('/admin/category', categoryRouter);