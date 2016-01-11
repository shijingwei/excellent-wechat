/**
* 微信终端用户
*/
var constants = require('cloud/weixin_interface/wx_constants.js');

exports.getAndSave = function(parameters) {
  var app_id = parameters.app_id;
  var access_token_val = parameters.access_token;
  var openid_val = parameters.openid;
  //console.log(__filename,parameters);
  getUserInfo(access_token_val,openid_val,save);

}
function getUserInfo(access_token_val,openid_val,consumer,cb){
  AV.Cloud.httpRequest({
    url: constants.URL_USER_INFO,
    params :{
      access_token:access_token_val,
      openid:openid_val,
      lang:'zh_CN'
    },
    success: function(httpResponse) {
      //console.log(__filename,httpResponse.text);
      var resObject = JSON.parse(httpResponse.text);
      if(resObject.errcode){
        console.log(__filename,resObject.errmsg);
        return;
      }
      cb(resObject,app_id,consumer);
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
}

exports.getAndUpdate = function(parameters) {
  var app_id = parameters.app_id;
  findByOpenidAndAppid();
}

function save(params,appid,customer){
  if(!customer){
    customer = new AV.Object('WX_consumer');
  }
  var count = 0;
  for (obj in params){
    console.log(obj);
    var val =  params[obj];
    //console.log(val);
    customer.set(obj,params[obj]);
    count++;
  }
  if(count) {
    customer.set('app_id',appid);
    customer.save();
  }
}

function findByOpenidAndAppid(){
  
}
