var constants = require('cloud/weixin_interface/wx_constants.js');
var xml2js = require('xml2js');
/*
function get_authorize(appidval,redirect_urival){
  var url = constants.URL_PAGE_AUTHORIZE+
  "?appid="+appidval+"appid="+appidval+"&redirect_uri="+redirect_urival+"&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
  return url;
}
*/

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
    console.log(__filename,httpResponse.text);
    var resObject = JSON.parse(httpResponse.text);
    if(resObject.openid){
      cb(null,resObject.openid);
    }else{
      if(resObject.errmsg){
        console.error(__filename,resObject.errcode,resObject.errmsg);
      }
      cb(resObject.errmsg);
    }
  },
  error: function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
    cb('Request failed with response code');
  }
  });
}

function get_unifiedorder(params,cb){
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(params);

  AV.Cloud.httpRequest({
    method: 'POST',
    url: constants.URL_UNIFIEDORDER,
    headers: {
      'Content-Type': 'application/xml'
    },
    body:xml,
    success: function(httpResponse) {
      xml2js.parseString(buf, function(err, json) {
        if (err) {
          console.error(err);
        } else {
          cb(null,json);
        }
      });
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
}
exports.get_access_token = get_access_token;
exports.get_unifiedorder = get_unifiedorder;
//exports.get_authorize = get_authorize;
