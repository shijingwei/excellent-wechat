/**
* 流量
*/
var crypto = require('crypto');
var wxpage = require('cloud/weixin_interface/wx_page.js');
var wxaccount = require('cloud/weixin_interface/account.js');
var logfile = require('cloud/utils/logfile.js');

exports.product_req = function(req,res){
  console.log(__filename,req.query);
  var app_id = req.query.appid;
  var uri = req.protocol+'://'+req.hostname+req.originalUrl.replace('Req','');
  var redirect_uri = encodeURIComponent(uri); //req.query.redirecturi;
  var redirect = wxpage.get_authorize(app_id,redirect_uri);
  res.redirect(redirect);
}

//redirect_uri/?code=CODE&state=STATE
function product(req,res){
  console.log(__filename,"product",req.query);
  //logfile.log(new Buffer(req.toString()));
  var codeval = req.query.code;
  var app_id = req.query.appid;

  wxaccount.geWXAccountByAppId(app_id,function(accounts){
    if(accounts && accounts.length>0){
      var account = accounts[0];
      var appidval = account.get('app_id');
      var secretval = account.get('app_secret');
      var timestampval = account.updatedAt.getTime();
      var ticket = account.get('ticket');
      var oriStr="jsapi_ticket="+ticket+"&noncestr="+appidval+"&timestamp="+timestampval+"&url="+uri;
      var signatureval = crypto.createHash('sha1').update(oriStr).digest('hex');

      wxpage.get_access_token(appidval,secretval,codeval,function(opendidval){
        var params = {
          appid : appidval,
          timestamp : timestampval,
          nonceStr : appidval,
          signature : signatureval,
          opendid :  opendidval
        };
        res.render("pay/product",params);
      });
    }
  });

  //res.render("pay/product",{});
}

function producttest(req,res){
  console.log(__filename,"producttest",req.query);
  //logfile.log(new Buffer(req.toString()));
  var codeval = "testcode";
  var opendidval = "openid";
  var app_id = req.query.appid;
  var uri = req.protocol+'://'+req.hostname+req.originalUrl;

  wxaccount.geWXAccountByAppId(app_id,function(accounts){
    if(accounts && accounts.length>0){
      var account = accounts[0];
      //console.log(__filename,account);
      var appidval = account.get('app_id');
      var secretval = account.get('app_secret');
      var timestampval = account.updatedAt.getTime();
      var ticket = account.get('ticket');
      var oriStr="jsapi_ticket="+ticket+"&noncestr="+appidval+"&timestamp="+timestampval+"&url="+uri;
      var signatureval = crypto.createHash('sha1').update(oriStr).digest('hex');
      var params = {
        appid : appidval,
        timestamp : timestampval,
        nonceStr : appidval,
        signature : signatureval,
        opendid :  opendidval
      };
      //console.log(__filename,params);
      res.render("pay/product",params);
    }
  });

  //res.render("pay/product",{});
}

exports.product = product ;
