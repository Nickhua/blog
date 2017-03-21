var express = require("express");

var router = express.Router();
// 权限控制
var auth = require("../middleware/auth");

var articleModel = require("../mongodb/db").articleModel;

var reviewModel = require("../mongodb/db").reviewModel;

var userModel = require("../mongodb/db").userModel;

// 引入multer模块实现图片上传
var multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads'); //上传图片后保存的路径地址
    },
    filename: function (req, file, cb) {
        cb(null, req.session.user.username+file.originalname); //上传图片后图片的名字等于原来图片的名字
    }
});
// 配置 upload 是一个中间件处理函数
var upload = multer({storage: storage});

router.get("/add", auth.checkLogin, function (req, res) {
    var article = {};
    res.render("article/add", {title: "发表文章", content: "发表文章内容",article:article});
});

router.post("/add", auth.checkLogin,upload.single('poster'),function (req, res) {
    var articleInfo = req.body;

    // req.file  上传的文件的信息   名字
    // console.log(req.file);

    //{ fieldname: 'poster',
    //    originalname: '1409361883500.png',
    //    encoding: '7bit',
    //    mimetype: 'image/png',
    //    destination: '../public/uploads',
    //    filename: '1409361883500.png',
    //    path: '..\\public\\uploads\\1409361883500.png',
    //    size: 81746 }

    if (req.file){
        articleInfo.poster = "/uploads/"+req.file.filename;
    }


    articleInfo.createAt = Date.now();
    articleInfo.user = req.session.user._id;
    articleModel.create(articleInfo, function (err, doc) {
        if (!err) {
            req.flash("success", "文章发表成功。。。");
            res.redirect("/");
        } else {
            req.flash("error", "文章发表失败。。。");
            res.redirect("back");
        }
    });
});
//  修改
router.post("/add/:id",auth.checkLogin,upload.single('poster'),function (req,res) {
    var id = req.params.id;
    var newArticleInfo = req.body;

    if (req.file){
        newArticleInfo.poster = "/uploads/"+req.file.filename;
    }
    articleModel.update({"_id":id},newArticleInfo,function (err,doc) {
        if (!err){
            res.redirect("/");
        } else {

        }
    });
});

router.get("/detail/:id",auth.checkLogin,function (req,res) {
    var id = req.params.id;

    //articleModel.findById(id,function (err,articleInfo) {
    //    if(!err){
    //        req.flash("success","成功进入详情页");
    //        console.log(articleInfo);
    //        res.render("article/detail",{title:"详情页",articleInfo:articleInfo});
    //    } else {
    //        req.flash("error","进入详情页失败");
    //        res.render("back");
    //    }
    //});

    articleModel.findById(id)
        .populate("user")
        .exec(function (err,articleInfo) {
            if(!err){
                req.flash("success","成功进入详情页");
                res.render("article/detail",{title:"详情页",articleInfo:articleInfo});
            } else {
                req.flash("error","进入详情页失败");
                res.render("back");
            }
        });
});

router.get("/add/:id",auth.checkLogin,function (req,res) {
    var id = req.params.id;
    articleModel.findById(id,function (err,article) {
        if (!err){
            req.flash("success","修改文章成功!");
            res.render("article/add", {title: "发表文章", article: article});
        } else {
            req.flash("error","修改文章失败");
            res.render("back");
        }
    });

});

router.post("/detail/:id",auth.checkLogin,function (req,res) {
    var id = req.params.id;
    var reviewInfo = req.body;
    reviewInfo.createAt = Date.now();
    reviewInfo.user = req.session.user;
    reviewModel.create(reviewInfo,function (err,doc) {
        if (!err){
            console.log(doc);
            articleModel.update({"_id":id},{"review":doc._id},function (err,info) {
                if (!err){
                    articleModel.findById(id)
                        .populate("review")
                        .populate("user")
                        .exec(function (err,articleInfo) {
                            if(!err){
                                req.flash("success","成功进入详情页");
                                userModel.findById(articleInfo.user,function (err,user) {
                                    res.render("article/detail",{title:"详情页",articleInfo:articleInfo,user:user});
                                });
                            } else {
                                req.flash("error","进入详情页失败");
                                res.render("back");
                            }
                        });
                } else {
                    console.log(err);
                }
            });
        }
    });

});

module.exports = router;