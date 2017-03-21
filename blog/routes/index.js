var express = require('express');
var router = express.Router();

var articleModel = require("../mongodb/db").articleModel;

var markdown = require("markdown").markdown;

/* GET home page. */
router.get("/", function (req, res, next) {

    var query = {};

    var keyword = req.query.keyword;
    if (keyword) {
        req.session.keyword = keyword;
        var reg = new RegExp(keyword, "i");
        query = {$or: [{title: reg}, {content: reg}]};
    }

    var pageNum = parseInt(req.query.pageNum) || 1;
    var pageSize = parseInt(req.query.pageSize) || 3;

    articleModel.find(query)
        .skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .populate("user")
        .exec(function (err, articles) {
            if (!err) {
                req.flash("success", "获取文章列表信息成功");

                articles.forEach(function (article, index) {
                    // 让所有文章的内容支持markdown格式
                    article.content = markdown.toHTML(article.content);
                });

                //  求个数
                articleModel.count(query,function (err,count) {
                    if (!err){
                        res.render("index", {
                            title: "首页标题",
                            articles: articles,
                            keyword: keyword,
                            pageNum:pageNum,
                            pageSize:pageSize,
                            totalPage:Math.ceil(parseInt(count)/pageSize)
                        });
                    } else {
                        req.flash("error", "获取页数总条数失败");
                        res.redirect("back");
                    }
                });
            } else {
                req.flash("error", "获取文章列表信息失败");
                res.redirect("back");
            }
        });
});

router.get("/:id", function (req, res, next) {
    var id = req.params.id;

    articleModel.remove({"_id":id},function (err,doc) {
        if (!err){
            var query = {};

            var keyword = req.query.keyword;
            if (keyword) {
                req.session.keyword = keyword;
                var reg = new RegExp(keyword, "i");
                query = {$or: [{title: reg}, {content: reg}]};
            }

            var pageNum = parseInt(req.query.pageNum) || 1;
            var pageSize = parseInt(req.query.pageSize) || 3;

            articleModel.find(query)
                .skip((pageNum-1)*pageSize)
                .limit(pageSize)
                .populate("user")
                .exec(function (err, articles) {
                    if (!err) {
                        req.flash("success", "获取文章列表信息成功");

                        articles.forEach(function (article, index) {
                            // 让所有文章的内容支持markdown格式
                            article.content = markdown.toHTML(article.content);
                        });

                        //  求个数
                        articleModel.count(query,function (err,count) {
                            if (!err){
                                res.render("index", {
                                    title: "首页标题",
                                    articles: articles,
                                    keyword: keyword,
                                    pageNum:pageNum,
                                    pageSize:pageSize,
                                    totalPage:Math.ceil(parseInt(count)/pageSize)
                                });
                            } else {
                                req.flash("error", "获取页数总条数失败");
                                res.redirect("back");
                            }
                        });
                    } else {
                        req.flash("error", "获取文章列表信息失败");
                        res.redirect("back");
                    }
                });
        } else {

        }
    });


});


module.exports = router;
