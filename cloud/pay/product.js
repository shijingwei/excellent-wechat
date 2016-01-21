/**
* 流量
*/
var crypto = require('crypto');
var wxpage = require('cloud/weixin_interface/wx_page.js');
var wxaccount = require('cloud/weixin_interface/account.js');
var logfile = require('cloud/utils/logfile.js');
var weixin = require('cloud/weixin.js');
var constants = require('cloud/weixin_interface/wx_constants.js');
var _ = require('underscore');

/*
exports.product_req = function(req,res){
  console.log(__filename,req.query);
  var app_id = req.query.appid;
  var uri = req.protocol+'://'+req.hostname+req.originalUrl.replace('Req','');
  var redirect_uri = encodeURIComponent(uri); //req.query.redirecturi;
  var redirect = wxpage.get_authorize(app_id,redirect_uri);
  res.redirect(redirect);
}
*/

//请求菜单URL网页授权后调用 （运行在服务器端）
//redirect_uri/？appid＝appid&code=CODE&state=STATE
function product(req,res){
  console.log(__filename,"product",req.query);
  //logfile.log(new Buffer(req.toString()));
  var codeval = req.query.code;
  var app_id = req.query.appid;
  var uri = req.protocol+'://'+req.hostname+req.originalUrl;

  wxaccount.geWXAccountByAppId(app_id,function(accounts){
    if(accounts && accounts.length>0){
      var account = accounts[0];
      var appidval = account.get('app_id');
      var secretval = account.get('app_secret');
      var timestampval = account.updatedAt.getTime();
      var ticket = account.get('ticket');
      var oriStr={"jsapi_ticket":ticket,"noncestr":appidval,"timestamp":timestampval,"url":uri};
      var signatureval = weixin.signature(oriStr); //加载页面的js签名

      console.log(__filename,"product invoke get_access_token",appidval,secretval,codeval);
      wxpage.get_access_token(appidval,secretval,codeval,function(err,json){
        if(err){
          console.error(__filename,err);
          return;
        }
        var params = {
          appid : appidval,
          timestamp : timestampval,
          nonceStr : appidval,
          signature : signatureval,
          openid :  json.openid
        };
        console.log(__filename,'product',params);
        res.render("pay/product",params);
      });
    }
  });

  //res.render("pay/product",{});
}

//（预防订单回调 可以不参考）
exports.preorderback = function(req,res){
  console.log(__filename,'preorderback',req.body);
  console.log(__filename,'preorderback',req.query);
}

//预付订单
function preorder(req,res){
  //ajax上来的参数
  var parameters = req.body;
  console.log(__filename,"preorder",req.body);
  var app_id = parameters.appid;
  var openid_val = parameters.openid;

  var bodyval = '4G';
  var tradeno = 'data'+_.random(0,10000);
  var totalfee= 1;
  var remoteip =req.headers['x-real-ip']?req.headers['x-real-ip']:req.ip;
  var notifyurl = req.protocol+'://'+req.hostname+req.originalUrl+"back";
  var tradetype ='JSAPI';

  //从数据库中查询当前微信号
  wxaccount.geWXAccountByAppId(app_id,function(accounts){
    if(accounts && accounts.length>0){
      var account = accounts[0];
      var appidval = account.get('app_id');
      var mchidval = account.get('mch_id');
      var secretval = account.get('app_secret');
      var timestampval = account.updatedAt.getTime();
      var ticket = account.get('ticket');
      var noncestr = weixin.noncestr(16);
      //var oriStr={"jsapi_ticket":ticket,"noncestr":appidval,"timestamp":timestampval,"url":uri};


      //为调用微信统一订单 参数
      var parameters = {
        appid:appidval,
        mch_id:mchidval,
        nonce_str:noncestr,
        total_fee:totalfee,
        body:bodyval,
        out_trade_no:tradeno,
        spbill_create_ip:remoteip,
        notify_url:notifyurl,
        trade_type:tradetype,
        openid:openid_val
      };
      //为调用微信统一订单 增加签名参数
      var signatureval = weixin.signature(parameters,'md5','yisharing2016yisharing2016ys2016');
      parameters.sign = signatureval.toUpperCase();
      //sign:signatureval,

      //调用微信统一订单接口
      wxpage.get_unifiedorder(parameters,function(err,json){
        if(err){
          console.error(__filename,err);
          return;
        }
        console.log(__filename,'get_unifiedorder',json);

        //微信服务器统一订单返回的参数
        var params = {
          appId : appidval,
          timeStamp : timestampval,
          nonceStr : noncestr,
          package: 'prepay_id='+json.prepay_id[0],
          signType : 'MD5'
        };

        //增加签名并返回给页面
        signatureval = weixin.signature(params,'md5','yisharing2016yisharing2016ys2016');
        params.paySign = signatureval.toUpperCase();
        console.log(__filename,'request weixin pay',params);
        res.json(params);
      });
    }
  });
}

//测试的代码
function producttest(req,res){
  console.log(__filename,"producttest",req.query);
  //logfile.log(new Buffer(req.toString()));
  var codeval = "0319a62788f17e8ed26d889129bd25bs";
  var opendidval = "oyJY1t99YwHAGH1ABFe4yC25npOw";
  var app_id = req.query.appid;
  var uri = "http:excellent.leanapp.cn/pay/product";

  wxaccount.geWXAccountByAppId(app_id,function(accounts){
    if(accounts && accounts.length>0){
      var account = accounts[0];
      //console.log(__filename,account);
      var appidval = account.get('app_id');
      var secretval = account.get('app_secret');
      var timestampval = account.updatedAt.getTime();
      var ticket = account.get('ticket');
      var oriStr={"jsapi_ticket":ticket,"noncestr":appidval,"timestamp":timestampval,"url":uri};
      var signatureval = weixin.signature(oriStr);
      var params = {
        appid : appidval,
        timestamp : timestampval,
        nonceStr : appidval,
        signature : signatureval,
        openid :  opendidval
      };
      console.log(__filename,'producttest',params);
      res.render("pay/product",params);
    }
  });

  //res.render("pay/product",{});
}

exports.product = product;
exports.preorder = preorder;
