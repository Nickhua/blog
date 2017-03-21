module.exports = function (input) {
    var crypto = require("crypto");
    var md5 = crypto.createHash("md5");
    md5.update(input);
    return md5.digest("hex");
};



//获取所有算法
//console.log(crypto.getHashes());
// 创建md5

// 向算法中输入数据


//var result = md5.digest("hex");
//
//console.log(result);