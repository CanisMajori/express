/**
 * Created by 12934 on 2018/7/25.
 */
const express=require('express');
const fs=require('fs');

//创建服务
const server=express();


//处理路由
server.get('/1.html',(req,res)=>{
    //显示页面
    fs.readFile('./view/emy.html',(err,data)=>{
        let d={
          name:'yyyy',
          info:'ssss'
        };
        //替换内容
        data=data.toString().
            replace('hhh',d.name).
            replace('#info#',d.info);

        res.send(data.toString());
    })
});

//监听端口
server.listen(81);