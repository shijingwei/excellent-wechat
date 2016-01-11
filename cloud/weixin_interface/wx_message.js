/**
* 微信消息保存
*/
var account = require('cloud/weixin_interface/account.js');
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
  var query = new AV.Query('WX_consumer');
  var message = req.object;
  console.log(__filename,"message",message);
  var openid = message.get('FromUserName');
  var app_id = message.get('app_id');
  query.equalTo('open_id',openid);
  query.equalTo('app_id',appid);
  query.find({
    success:function(customers){
      console.log(__filename,customers);
      if(customers.length<1){
        account.geWXAccountByAppId(appid,function(accounts){
          var wxaccount = accounts[0];
          var access_token = wxaccount.get('access_token');
          var params = {};
          params.openid= openid;
          params.access_token = access_token;
          params.app_id=appid;
          wx_customer.getAndSave(params);
        });
      }
    },
    error:function(err,customers){
      console.error(__filename,err);
    }
  });
}
