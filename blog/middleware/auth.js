module.exports.checkLogin = function (req,res,next) {
    if (req.session.user){
        next();
    } else {
        req.flash("error","当前用户未登录,不能执行此操作");
        res.redirect("/user/login");
    }
};

module.exports.checkNotLogin = function (req,res,next) {
    if (!req.session.user){
        next();
    } else {
        req.flash("error","当前用户已登录,不能执行此操作,请先退出");
        res.redirect("/");
    }
};