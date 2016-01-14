/**
* 流量
*/
var wxpage = require('cloud/weixin_interface/wx_page.js');
var wxaccount = require('cloud/weixin_interface/account.js');
var logfile = require('cloud/utils/logfile.js');

exports.product_req = function(req,res){
  console.log(__filename,req.query);
  var app_id = req.query.appid;
  var redirect_uri = encodeURI(req.protocol+'://'+req.hostname+req.originalUrl); //req.query.redirecturi;
  console.log(__filename,redirect_uri);
  wxpage.get_authorize(app_id,redirect_uri);
  res.send('');
}

//redirect_uri/?code=CODE&state=STATE
exports.product =  function(req,res){
  console.log(__filename,req.baseUrl);
  //logfile.log(new Buffer(req.toString()));
  var code = req.query.code;
  var app_id = req.query.appid;
  wxaccount.geWXAccountByAppId(app_id,function(accounts){
    if(accounts && accounts.length>0){
      var account = accounts[0];
      var appid = account.get('app_id');
      var secret = account.get('app_secret');

      wxpage.get_access_token(appid,secret,code,function(opendid){
        var params = {
          appid : appid,
          opendid : opendid,
          secret : secretval,
          code : codeval
        };
        res.render("/pay/product",params);
      });
    }
  });
}
