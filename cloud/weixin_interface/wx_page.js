var constants = require('cloud/weixin_interface/wx_constants.js');
function get_authorize(appidval,redirect_urival){
  var url = constants.URL_PAGE_AUTHORIZE+
  "?appid="+appidval+"appid="+appidval+"&redirect_uri="+redirect_urival+"&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
  return url;
}

function get_access_token(appidval,secretval,codeval,cb){
  AV.Cloud.httpRequest({
  url: constants.URL_PAGE_ACCESS_TOKEN,
  params :{
    grant_type:'authorization_code',
    appid : appidval,
    secret :  secretval,
    code : codeval
  },
  success: function(httpResponse) {
    var resObject = JSON.parse(httpResponse.text);
    if(resObject.openid){
      cb(null,resObject.openid);
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
