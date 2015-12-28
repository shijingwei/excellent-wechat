/**
* 微信 token
*
*/
var constants = require('cloud/weixin_interface/wx_constants.js');


/*
轮询所有用户刷新 Token
*/
function refresh() {

}

function initlize(appid,secret) {
  AV.Cloud.httpRequest({
  url: constants.URL_ACCESS_TOKEN,
  params :{
    grant_type:'client_credential',
    appid : appid,
    secret : secret
  },
  success: function(httpResponse) {
    var query = new AV.Query('WeixinAccount');
    query.equalTo('app_id',appid);
    query.find({
      success: function(accounts){
        if(accounts && accounts.length ==1) {
          var account = accounts[0];
          var resObject = JSON.parse(httpResponse.text);
          account.set('access_token',resObject.access_token);
          account.save();
        }
      },
      error: function(error){

      }
    })
  },
  error: function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
  }
  });
}

function refresh(userid){
  var user = AV.Object.createWithoutData('_User',userid);
  var query = new AV.Query('WeixinAccount');
  query.equalTo('owner',user);
  query.find({
    success:function(accounts){
      account.forEach(function(account){
        refreshSingle()
      });
    }
  });
}

function refreshSingle(account){
  var appid =  account.get('app_id');
  var secret = account.get('app_secret');

}

exports.initlize = initlize;
exports.refresh = refresh;
