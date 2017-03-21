var mongoose = require("mongoose");

mongoose.connect(require('../dbUrl').dbUrl);

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // 用户头像地址
    avatar: String
});

var userModel = mongoose.model('user', userSchema);

var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    poster: String,
    createAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    review: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "review"
    },
    goodNum: Number,
    badNum: Number
});

var reviewSchema = new mongoose.Schema({
    content : String,
    createAt : {
        type : Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

var reviewModel = mongoose.model("review",reviewSchema);


var articleModel = mongoose.model("article", articleSchema);

module.exports.userModel = userModel;
module.exports.articleModel = articleModel;
module.exports.reviewModel = reviewModel;