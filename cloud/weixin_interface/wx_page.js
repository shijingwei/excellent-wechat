var constants = require('cloud/weixin_interface/wx_constants.js');
function get_authorize(appidval,redirect_urival){
  AV.Cloud.httpRequest({
    url: constants.URL_PAGE_AUTHORIZE,
    params :{
      appid : appidval,
      redirect_uri : redirect_urival,
      response_type : "code",
      scope : "snsapi_base",
      state : "state#wechat_redirect"
    },
    success: function(httpResponse) {
      console.log(__filename,"get_authorize success");
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
}

function get_access_token(appidval,secretval,codeval,cb){
  AV.Cloud.httpRequest({
  url: constants.URL_ACCESS_TOKEN,
  params :{
    grant_type:'authorization_code',
    appid : appidval,
    secret :  secretval,
    code : codeval
  },
  success: function(httpResponse) {
    var resObject = JSON.parse(httpResponse.text);
    if(resObject.access_token){
      account.set('access_token',resObject.access_token);
      refreshJsapi(resObject.access_token,function(jsapi_ticket){
        if(jsapi_ticket){
          account.set('ticket',jsapi_ticket);
          account.save();
        }
      });
      account.save();
    }else{
      if(resObject.errmsg){
        console.error(__filename,resObject.errcode,resObject.errmsg);
      }
    }
  },
  error: function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
  }
  });
}
exports.get_access_token = get_access_token;
exports.get_authorize = get_authorize;
