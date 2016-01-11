/**
* 微信消息保存
*/
var wx_customer = require('cloud/weixin_interface/wx_consumer.js');

exports.save = function(appid,params) {
  var message = new AV.Object('WX_message');
  var count = 0;
  for (obj in params){
    //console.log(obj);
    //var val =  params[obj][0];
    //console.log(val);
    message.set(obj,params[obj][0]);
    count++;
  }
  if(count) {
    message.set('app_id',appid);
    message.save();
  }
}

exports.aftersave = function(req) {
  var message = req.object;
  //console.log(__filename,"message",message);
  var openid = message.get('FromUserName');
  var app_id = message.get('app_id');
  //保存用户 如果用户存在并且没有unionid,则更新，否则新建
  wx_customer.saveOrUpdateFrom(openid,app_id);
}
