/**
* 微信终端用户
*/
var constants = require('cloud/weixin_interface/wx_constants.js');

exports.getAndSave = function(parameters) {
  var app_id = parameters.appid;
  //console.log(__filename,parameters);

  AV.Cloud.httpRequest({
    url: constants.URL_USER_INFO,
    params :{
      access_token:parameters.access_token,
      openid:parameters.openid,
      lang:'zh_CN'
    },
    success: function(httpResponse) {
      //console.log(__filename,httpResponse.text);
      var resObject = JSON.parse(httpResponse.text);
      if(resObject.errcode){
        console.log(__filename,resObject.errmsg);
        return;
      }
      save(resObject,app_id);
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
}

function save(params,appid){
  var customer = new AV.Object('WX_consumer');
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
