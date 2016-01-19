var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var appconfig = require('cloud/config/application.js');

var AV = require('leanengine');
var APP_ID =  'gc7kzpln5airnv3c8wt4bof1kwxyifojctfy5yz28luykpji'; // 你的 app id
var APP_KEY = '5yau1c8h4q4es3t5ibrxmz9tpjdllf1gekdrosz1blwb6kyn'; // 你的 app key
var MASTER_KEY = 'bi85xoq39g92v7y4mjuelm66hgmn6opjb50enwfknj39co5e'; // 你的 master key
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

var token = require("cloud/weixin_interface/token.js");
var product = require("cloud/pay/product.js");

var xml2js = require('xml2js');
var weixin = require('cloud/weixin.js');
var account = require('cloud/weixin_interface/account.js');
var utils = require('express/node_modules/connect/lib/utils');
var wxmenu = require('cloud/weixin_interface/wx_menu.js');
var wxmessage = require('cloud/weixin_interface/wx_message.js');

// 解析微信的 xml 数据
var xmlBodyParser = function (req, res, next) {
  if (req._body) return next();
  req.body = req.body || {};

  // ignore GET
  if ('GET' == req.method || 'HEAD' == req.method) return next();

  // check Content-Type
  if ('text/xml' != utils.mime(req)) return next();

  // flag as parsed
  req._body = true;

  // parse
  var buf = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ buf += chunk });
  req.on('end', function(){
    xml2js.parseString(buf, function(err, json) {
      if (err) {
          err.status = 400;
          next(err);
      } else {
          req.body = json;
          next();
      }
    });
  });
};

var userSessionFilter = function(req,res,next){

}

var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use('/static', express.static('public'));
//app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(xmlBodyParser);

// 加载 cookieSession 以支持 AV.User 的会话状态
app.use(AV.Cloud.CookieSession({ secret: 'scret', maxAge: 3600000, fetchUser: true }));

// 强制使用 https
app.enable('trust proxy');
//app.use(AV.Cloud.HttpsRedirect());

//app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//获得办公室IP地址
app.get('/remoteip',function(req,res){
  //console.log(req.headers['x-real-ip']);
  var remoteaddress = new AV.Object('RemoteAddress');
  var ips = req.ips;
  var ip = req.headers['x-real-ip']?req.headers['x-real-ip']:req.ip;

  remoteaddress.set('IPAddress',ip);
  remoteaddress.save();
  res.send('Success');

});

app.get('/login', function(req, res) {
  // 渲染登录页面
  res.render('login');
});
// 点击登录页面的提交将出发下列函数
app.post('/login', function(req, res) {
  AV.User.logIn(req.body.username, req.body.password).then(function(user) {
    //登录成功，AV.Cloud.CookieSession 会自动将登录用户信息存储到 cookie
    //跳转到profile页面。
    //console.log('signin successfully: %j', user);
    res.redirect('/profile');
  },function(error) {
    //登录失败，跳转到登录页面
    res.redirect('/login');
  });
});
//查看用户profile信息
app.get('/profile', account.profile);

//调用此url来登出帐号
app.get('/logout', function(req, res) {
  // AV.Cloud.CookieSession 将自动清除登录 cookie 信息
  AV.User.logOut();
  res.redirect('/profile');
});

app.get('/weixin/:appid', function(req, res) {
  //console.log('weixin req.originalUrl:',req.originalUrl);
  //console.log('weixin req:', req.query);
  var params = req.query;
  params.appid = req.params.appid;
  weixin.exec(params, function(err, data) {
    if (err) {
      return res.send(err.code || 500, err.message);
    }
    return res.send(data);
  });
});

app.post('/weixin/:appid', function(req, res) {
  //console.log('weixin req.originalUrl:',req.originalUrl);
  //console.log('weixin req:', req.body);
  var params = req.body;
  params.appid = req.params.appid;
  weixin.exec(params, function(err, data) {
    if (err) {
      return res.send(err.code || 500, err.message);
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(data);
    //console.log('res:', data)
    res.set('Content-Type', 'text/xml');
    return res.send(xml);
  });
});

//注册微信管理账号
app.get('/register',function(req, res) {res.render('weixin/register');});
app.post('/register',account.register);
app.post('/profile',account.profile);
app.post('/addAccount',account.addAccount);

//菜单管理
app.get('/wxmenu',function(req,res){ res.render('weixin/wxmenu');});
app.post('/wxmenu',wxmenu.createMenu);

//流量
//app.get('/pay',product.product_req);
//app.get('/pay/productReq',product.product_req);
app.get('/pay/product',product.product);
app.post('/pay/product',product.product);
app.post('/pay/preorder',product.preorder);
app.post('/pay/preorderback',product.preorderback);

//Test
//刷新Token
app.get('/refresh',token.refreshTimer);
//Message
//app.get('/message',function(req,res){ var params = req.query; wxmessage.save(params);res.send('success');});
//app.get('/signature',function(req,res){ var s= weixin.signature({a:'a',z:'z',g:'g',b:'b'});res.send(s); });
//app.get('/noncestr',function(req,res){ var s= weixin.noncestr(32);res.send(s); });

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
