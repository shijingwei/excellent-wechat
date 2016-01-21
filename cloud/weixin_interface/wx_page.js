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
  //console.log(__filename,'get_access_token',params);
  AV.Cloud.httpRequest({
  url: constants.URL_PAGE_ACCESS_TOKEN,
  params :{
    grant_type:'authorization_code',
    appid : appidval,
    secret :  secretval,
    code : codeval
  },
  success: function(httpResponse) {
    console.log(__filename,'get_access_token',httpResponse.text);
    var resObject = JSON.parse(httpResponse.text);
    if(resObject.openid){
      cb(null,resObject);
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
  var builder = new xml2js.Builder({rootName:'xml'});
  var xml = builder.buildObject(params);
  //xml ='<xml><appid>wxbb4d45d2d1ca7249</appid><mch_id>1301852701</mch_id><nonce_str>f1UZ9LEjOSpG7</nonce_str><total_fee>1</total_fee><body>4G</body><out_trade_no>data00001</out_trade_no><spbill_create_ip>::1</spbill_create_ip><notify_url>http://localhost/pay/preorderback</notify_url><tradet_ype>JSAPI</tradet_ype><openid>oyJY1t99YwHAGH1ABFe4yC25npOw</openid><sign>75a2e8c221378cbb8433f45557ed26e075bbe275</sign></xml>';
  //xml='<xml><appid>wx2421b1c4370ec43b</appid><attach>支付测试</attach><body>JSAPI支付测试</body><mch_id>10000100</mch_id><nonce_str>1add1a30ac87aa2db72f57a2375d8fec</nonce_str><notify_url>http://wxpay.weixin.qq.com/pub_v2/pay/notify.v2.php</notify_url><openid>oUpF8uMuAJO_M2pxb1Q9zNjWeS6o</openid><out_trade_no>1415659990</out_trade_no><spbill_create_ip>14.23.150.211</spbill_create_ip><total_fee>1</total_fee><trade_type>JSAPI</trade_type><sign>0CB01533B8C1EF103065174F50BCA001</sign></xml>';
  console.log(__filename,xml);

  AV.Cloud.httpRequest({
    method: 'POST',
    url: constants.URL_UNIFIEDORDER,
    headers: {
      'Content-Type': 'text/xml'
    },
    body:xml,
    success: function(httpResponse) {
      xml2js.parseString(httpResponse.text, function(err, json) {
        if (err) {
          console.error(err);
        } else {
          cb(null,json.xml);
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
