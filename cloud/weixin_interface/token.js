/**
* 微信 token
*
*/
var constants = require('cloud/weixin_interface/wx_constants.js');


function initlize(appid,secret) {
    var query = new AV.Query('WeixinAccount');
    query.equalTo('app_id',appid);
    query.find({
      success: function(accounts){
        if(accounts && accounts.length ==1) {
          var account = accounts[0];
          refreshSingle(account);
        }
      },
      error: function(error){}
    });
}

function refreshSingleById(accountid){
  var query = new AV.Query('WeixinAccount');
  query.get(accountid, {
    success:function(account){
      refreshSingle(account);
    }
  });
}

/*
轮询所有用户刷新 Token
*/
function refreshTimer(req,res){
  var query = new AV.Query('WeixinAccount');
  //var date = new Date();
  //date.setTime(date.getTime()-7200000);
  //query.lessThan('updatedAt',date);
  query.limit(100);
  query.find({
    success:function(accounts){
      accounts.forEach(function(account){
        refreshSingle(account);
      });

      if(accounts.length==100){
        refreshTimer();
      }
    }
  });
  res.send('Success');
}


//刷新单个微信公众号
function refreshSingle(account){
  var appid =  account.get('app_id');
  var secret = account.get('app_secret');
  AV.Cloud.httpRequest({
  url: constants.URL_ACCESS_TOKEN,
  params :{
    grant_type:'client_credential',
    appid : appid,
    secret : secret
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
        console.error(resObject.errmsg);
      }
    }
  },
  error: function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
  }
  });
}

function refreshJsapi(access_tokenval,cb){
  if(!cb){
    return;
  }
  AV.Cloud.httpRequest({
    url: constants.URL_JSAPI_TOKEN,
    params :{
      access_token : access_tokenval,
      type : "jsapi"
    },
    success: function(httpResponse) {
      //console.log(__filename,httpResponse.text);
      var resObject = JSON.parse(httpResponse.text);
      if(resObject.ticket){
        cb(resObject.ticket);
      }else{
        if(resObject.errmsg){
          console.error(resObject.errmsg);
        }
      }
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
}

exports.initlize = initlize;
exports.refreshTimer = refreshTimer;
exports.refreshSingleById = refreshSingleById;
