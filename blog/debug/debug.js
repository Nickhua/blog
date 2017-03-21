console.log(222222);
var successDebug = require("debug")("blog:success");
var failDebug = require("debug")("blog:fail");
var warnDebug = require("debug")("blog:warn");
successDebug("success");
failDebug("fail");
warnDebug("warn");