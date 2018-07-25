/**
 * Created by 12934 on 2018/7/25.
 */

const express=require('express');
const mysql=require('mysql');
const ejs=require('ejs');

const server=express();
//设置模板引擎
server.enjine('html',ejs.renderFile); //定义HTML格式的模板引擎
server.set('view engine','html');//注册模板引擎
server.set('views','./tpl');//设置视图文件夹


server.get('',(req,res)=>{
    res.render('',{

    });

});


server.listen(81);
