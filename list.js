/**
 * Created by 12934 on 2018/7/25.
 */
const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
//启动服务
const app=express();
//设置模板引擎
app.engine('html',ejs.renderFile);
app.set('view engine','html');
app.set('views','./tpl');
//连接数据库
let quxdb=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'user'
});
quxdb.connect();

//路由
app.get('/list',(req,res)=>{
    //接收值
    let name=req.query.name;
    let min=req.query.min;
    let max=req.query.max;
    //在数据库里查询
    let sql=`SELECT id,name,salary FROM employee WHERE 1`;
     //sql追加语句前面必须加空格
    if(name){
        sql+= '  AND name="'+name+'" ';
    }
    if(min){
        sql+= "  AND salary >= "+min;
    }
    if(max){
        sql+='  AND salary <='+max;
    }
    sql+=`  ORDER BY salary DESC`;//降序排列
    /*1.降序order by 列名desc
    --2.升序order by 列名   或order by 列名asc     默认(不写)为升序
    --3.order by语句必须一定要放在整个sql语句的最后。*/

    quxdb.query(sql,(err,result)=>{
        console.log(result);
        if(err){
            console.log(err);
        }else{
            res.render('list.html',{//html可省略
                userlist:result,
                name:name,
                min:min,
                max:max
            });
        }
    });
});
app.listen(81);