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
server.set('view engine','html');
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
//路由
//查询数据&分页
server.get('/',(req,res)=>{
    let kw=req.query.keywords;
    let c1=req.query.c1;
    //当前页数,通过连接传过来的
    let page=req.query.page;
    //防止用户手贱乱输的处理
    if(page<1|| isNaN(page)){
        page=1;
    }
    //定义每一页的数量
    const pagenum=20;
    //渲染的参数：是个对象：
    const viewdata={
        kw:'',
        c1:'',
        kwlist:[],
        page:page,
        //初始化总页
        totalpage:0
    };

    //计算总页数，需要知道总共多少条 ，数据库查询
    //查询所有数据 并用缓存字段计数
    //count 函数  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=>?
    let sq=`SELECT count(id) AS totalnum FROM hotword WHERE 1`;
    quxdb.query(sq,(err,result)=>{
        //先处理一下err
        if(err){
            console.log(err);
            res.send('db-err');
        }else{
            let totalnum=result[0].totalnum;//返回值为数组
            let totalpage=Math.ceil(totalnum/pagenum);//设置总页数
            viewdata.totalpage=totalpage;//赋给返回的对象
            //最大值溢出设置
            if(page>totalpage){page=totalpage;};
            //定义分页按钮个数
            let showpage=7;
            //第一个按钮的页数，=当前页减去总页数减1除2
            console.log('页数'+page);
            let start=page-Math.floor((showpage-1)/2);
            console.log(start+'start'); //-2    ？？？？？？？？？？？？？？？？？？？
            //最后一个按钮的页数
            let end=page-0+Math.ceil((showpage-1)/2);
            //按钮范围限制
            if(start<1){
                start=1;
                end = start + showpage-1;
            }
            console.log(start+'start2');//1
            if(end>totalpage){
                end = totalpage;
                start = end - showpage+1;
            }
            console.log(start+'start3');//-5
            viewdata.showpage=showpage;
            viewdata.start=start;
            viewdata.end=end;
            let sql='select id,kw,c2,c1,c3 from hotword where 1 ';
            if(kw){
                sql+='  AND kw LIKE "'+kw+'%"';
                viewdata.kw=kw;
            }
            if(c1){
                sql+='  AND c1 ="'+c1+'"';
                viewdata.c1=c1;
            }
            sql+=` limit ?,?`;
            quxdb.query(sql,[(page-1)*pagenum,pagenum],(err,result)=>{
                if(err){
                    res.send('dberr');
                    console.log(err);
                }else {
                  viewdata.kwlist = result;
                    console.log(viewdata);
                    res.render('keywords.html',viewdata);
                }

            });

        }
    });

});
//修改数据之跳转页面
server.get('/update',(req,res)=>{

    let id=req.query.id;//获取到要修改的id，这个id会在地址里传过来
    let sql='select * from hotword where id=?';
    console.log(id);
    //根据传来的id显示数据：
    quxdb.query(sql,id,(err,result)=>{
        console.log(result);
        //result穿过来的是数组
        if(err){
            res.send('db error');
            console.log(err);
        }else{
            console.log(result);
            res.render('update.html',result[0]);//数组 加0
        }
    });
});
//修改ajax传过来的数据
server.post('/update',(req,res)=>{
    let pd=req.body;//传过来的所有东西，是个对象
    let id=pd.id;
    let sql='update hotword set kw=?,c1=?,c2=?,c3=? where id=?';
    quxdb.query(sql,[pd.kw,pd.c1, pd.c2, pd.c3, id],(err,result)=>{
        if(err){
            console.log(err);
            res.send('db err');
        }else{
            res.redirect('/?c1='+pd.c1+'&keyword='+pd.kw+'');//跳转页面
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
//删除所有数据
server.post('/delall',(req,res)=>{
    console.log(req.body.id);
    //把req.body.id中的元素通过逗号连接成字符串
    let sql = 'DELETE FROM hotword WHERE id IN('+req.body.id.join(',')+')';
    console.log(sql);
    quxdb.query(sql, (err, result)=>{
        console.log(result);
        if(err){
            res.json({r:'fail'});
        }else{
            res.json({r:'success'});
        }
    });
});

//静态资源托管
//如果有图片资源也要托管过来
server.use(express.static('tpl'));
//监听端口
server.listen(8080);