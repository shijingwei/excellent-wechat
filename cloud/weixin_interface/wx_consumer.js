/**
* 微信终端用户
*/
var constants = require('cloud/weixin_interface/wx_constants.js');
var account = require('cloud/weixin_interface/account.js');

function getUserInfo(parameters,consumer,cb){
  //console.log(__filename,parameters);
  var app_id = parameters.app_id;
  var access_token_val = parameters.access_token;
  var openid_val = parameters.openid;
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

function save(params,appid,customer){
  if(!customer){
    customer = new AV.Object('WX_consumer');
  }
  var count = 0;
  for (obj in params){
    //console.log(obj);
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

//如果用户存在并且没有unionid,则更新，如果用户不存在则新建
function saveOrUpdateFrom(openid,app_id){
  var query = new AV.Query('WX_consumer');
  query.equalTo('openid',openid);
  query.equalTo('app_id',app_id);
  query.find({
    success:function(customers){
      //console.log(__filename,customers);
      var customer=null;
      if(customers.length>0){
        customer = customers[0];
        var unionid = customer.get('unionid');
        if(unionid){
          return;
        }
      }
      account.geWXAccountByAppId(app_id,function(accounts){
        var wxaccount = accounts[0];
        var access_token = wxaccount.get('access_token');
        var params = {};
        params.openid= openid;
        params.access_token = access_token;
        params.app_id=app_id;
        getUserInfo(params,customer,save);
        //save(params,app_id,customer);
      });
    },
    error:function(err,customers){
      console.error(__filename,err);
    }
  });
}

exports.saveOrUpdateFrom = saveOrUpdateFrom;
