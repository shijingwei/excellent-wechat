require("cloud/app.js");
var token = require("cloud/weixin_interface/token.js");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
AV.Cloud.define("refreshTimer",token.refreshTimer);
