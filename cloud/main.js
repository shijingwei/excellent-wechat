require("cloud/app.js");
var token = require("cloud/weixin_interface/token.js");
var wx_message = require("cloud/weixin_interface/wx_message");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
AV.Cloud.define("refreshTimer",token.refreshTimer);

AV.Cloud.afterSave('WX_message', wx_message.aftersave);
