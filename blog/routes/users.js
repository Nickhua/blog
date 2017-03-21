var express = require('express');
var router = express.Router();

// 引入数据库中的用户集合
var userModel = require("../mongodb/db").userModel;

// 引入数据加密
var md5 = require("../md5/test");

//
var auth = require("../middleware/auth");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get("/reg",auth.checkNotLogin, function (req, res) {
    res.render("user/reg", {title: "注册标题", content: "注册内容"});
});

router.post("/reg",auth.checkNotLogin, function (req, res) {
    // 获取表单提交的内容
    var userInfo = req.body;
    // 保存到数据库
    // 用户名和密码不能完全一样
    userInfo.password = md5(userInfo.password);
    userInfo.avatar = "https://www.gravatar.com/avatar/"+md5(userInfo.email)+"?s=50";
    var query = {username:userInfo.username,password:userInfo.password};
    //userModel.remove({username:"薛泽华"},function (err,doc) {
    //  console.log(doc);
    //});
    userModel.findOne(userInfo,function (err, doc) {
        if (!err) {
            if (doc){
                //console.log("当前用户已经被注册");
                req.flash("error","当前用户已经被注册");
                res.redirect("back");
            } else {
                userModel.create(userInfo,function (err,doc) {
                    if (!err){
                        //console.log("用户注册成功");
                        req.flash("success","用户注册成功");
                        res.redirect("/user/login");
                    } else {
                        //console.log("用户注册失败");
                        req.flash("error","用户注册失败");
                        res.redirect("back");
                    }
                });
            }
        } else {
            console.log("数据库查询失败");
            res.redirect("back");
        }
    });




});

router.get("/login",auth.checkNotLogin, function (req, res) {
    res.render("user/login", {title: "登录标题", content: "登录内容",msg:req.msg});
});

router.post("/login",auth.checkNotLogin, function (req, res) {
    //
    var userInfo = req.body;
    //
    userInfo.password = md5(userInfo.password);

    userModel.findOne(userInfo, function (err, doc) {
        if (!err) {
            if (doc) {
                //console.log("当前用户登录成功");
                req.flash("success","当前用户登录成功");
                // 将用户的信息保存到session中
                req.session.user = doc;
                //req.msg = "当前用户登录成功";
                res.redirect("/");
            } else {
                //console.log("当前用户没有注册");
                req.flash("error","当前用户没有注册");
                res.redirect("/user/reg");
            }
        } else {
            //console.log("数据库查找失败");
            req.flash("error","数据库查找失败");
            res.redirect("back");
        }
    });
});

router.get("/logout",auth.checkLogin, function (req, res) {
    req.session.user = null;    // 退出清空session
    res.redirect('/');
});

module.exports = router;
