/**
 * Created by 12934 on 2018/7/25.
 */
const express=require('express');
const ejs=require('ejs');//ejs模板引擎
//创建服务
const app=express();
//这是路由
app.get('/2.html',(req,res)=>{
    //ejs.renderFile('路径'，{参数}，(err,data)=>{res.send()}); 三个参数
    ejs.renderFile('./view/emy2.html',{
        name:'qx',
        info:'世界上最好的人儿<b>，而且很酷</b>',
        tec:[{c:'精通',p:'PHP'},{c:'了解',p:'js'},{c:'熟悉', p:'nodejs'}]
    },(err,data)=>{
        res.send(data);
    });
});


app.listen(81);