/*管理员相关路由*/
const express=require('express');
const pool=require('../../pool');
var router=express.Router();
module.exports=router;

/*GET请求可以有主体吗   不可！
API:GET /admin/login/:aname/:apwd
完成用户登录验证（有的项目此处选择POST请求）
请求数据：{aname:'xxx',apwd:'xxx'}
返回数据：{code:200,msg:'login succ'}
         {code:400,msg:'aname or apwd err'}
*/
router.get('/login/:aname/:apwd',(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    //需要对用户输入的密码执行加密操作
    pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[aname,apwd],(err,result)=>{
        if(err)throw err;
        if(result.length>0){  //查询到一行数据，登录成功  因为result是个数组
            res.send({code:200,msg:'login succ'});
        }else{  //没有查询到数据
            res.send({code:400,msg:'aname or apwd error'});
        }
    })
    //console.log(req.body);
    //res.send(req.body)
})

/*修改管理员密码
API:PATCH /admin    修改部分数据用patch打补丁
根据管理员名和密码修改管理员密码
请求数据：{aname:'xxx',oldPwd:'xxx'，newPwd:'xxx'}
返回数据：{code:200,msg:'modified succ'}
         {code:400,msg:'aname or apwd err'}
         {code:401,msg:'apwd not modified'}
*/
router.patch('/',(req,res)=>{
    var data=req.body;  //{aname:'',oldPwd:'',newPwd:''}
    console.log(data);
    //首先根据aname和oldPwd查询用户是否存在
    pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[data.aname,data.oldPwd],(err,result)=>{
        if(err)throw err;
        if(result.length==0){
            res.send({code:400,msg:'password error'})
        }else{
            pool.query('UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?',[data.newPwd,data.aname],(err,result)=>{
                if(err)throw err;
                if(result.changedRows>0){//密码修改完成
                    res.send({code:200,msg:'modified succ'})
                }else{ //新旧密码一样，未做修改
                    res.send({code:401,msg:'password not midified'})
                }
            })
        }
    });
    //如果查询到了用户再修改其密码
});


