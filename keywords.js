/**
 * Created by 12934 on 2018/7/25.
 */
const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
const bodyParser=require('body-parser');
//创建服务
const server=express();

//设置模板引擎
server.engine('html',ejs.renderFile);
server.set('view-engine','html');
server.set('views','./tpl');
//连接数据库
let quxdb=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:3306,
    database:'user'
});
quxdb.connect();
//接收数据
server.use(bodyParser.urlencoded({extended:true}));
//一个路由
server.get('/',(req,res)=>{
    //查询前50条数据显示到页面
    let sql='SELECT id,kw,c1,c2,c3 FROM hotword WHERE 1';
    let kw = req.query.keywords;
    //将要查询的值写到sql语句里
    if(kw){
        sql+='  AND kw LIKE "'+ kw+'%"';
    }
    sql += ' LIMIT 0,50';//限制50个
    quxdb.query(sql,(err,result)=>{
        if(err){
            console.log(sql);
            console.log(err);
            res.send('系统错误');
        }else{//查询成功
            res.render('keywords.html',{
                kwlist:result,
                keywords:kw
            });
        }
    });
});

//删除数据
server.post('/delkw',(req,res)=>{
    //根据id删数据
    let id=req.body.id123;
    let sql='DELETE FROM hotword WHERE id=? LIMIT 1';
    quxdb.query(sql,id,(err,result)=>{
        if(err){
            console.log('删除失败');
            res.json({r:'db_err'});
        }else{
            res.json({r:'success'});//ajax,返回json格式数据
            console.log('从数据库中删除成功');
        }
    });
});
//静态资源托管
server.use(express.static('tpl'));
//监听端口
server.listen(81);