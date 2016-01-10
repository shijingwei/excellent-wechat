/**
* 后台微信账号管理
*
*/
var tokenjs = require('cloud/weixin_interface/token.js');

//注册 账号
function register(req,res) {
  //console.log(req);
  var username = req.body.username;
  var password = req.body.password;
  var appid = req.body.appid;
  var secret = req.body.secret;
  var user = new AV.User();
  user.set('username', username);
  user.set('password', password);

  user.signUp(null, {
    success: function(user) {
      /*
      // 注册成功，可以使用了.
      var weixinAccount = AV.Object.new('WeixinAccount');
      weixinAccount.set('owner',user);
      weixinAccount.set('app_id',appid);
      weixinAccount.set('app_secret',secret);
      weixinAccount.save(null,{success:function(account){tokenjs.initlize(appid,secret);}});
      */
      saveWeixinAccount(user,appid,secret);
      res.redirect('/profile');
    },
    error: function(user, error) {
      // 失败了
      console.log(error);
      res.send('error');
    }
  });
}

//登陆后显示页面
function profile(req,res){
  // 判断用户是否已经登录
  if (req.AV.user) {
    // 如果已经登录，发送当前登录用户信
    var query = new AV.Query('WeixinAccount');
    var user = req.AV.user;
    var u = AV.Object.createWithoutData('_User',user.id);
    query.equalTo('owner',u);
    query.find({success:function(accounts){
            //console.log(accounts);
            res.render('weixin/profile',{"accounts":accounts});
        },
        error:function(){}
    });

  } else {
    // 没有登录，跳转到登录页面。
    res.redirect('/login');
  }

}

//增加微信账号
function addAccount(req,res){
  var appid = req.body.appid;
  var secret = req.body.secret;

  if (req.AV.user){
    var user = AV.Object.createWithoutData('_User',req.AV.user.id);
    saveWeixinAccount(user,appid,secret);
    res.redirect('/profile');
  } else {
    res.redirect('/login');
  }
}

//private 保存Account
function saveWeixinAccount(user,appid,secret){
  var weixinAccount = AV.Object.new('WeixinAccount');
  weixinAccount.set('owner',user);
  weixinAccount.set('app_id',appid);
  weixinAccount.set('app_secret',secret);

  //初次初始化 access_token
  weixinAccount.save(null,{success:function(account){tokenjs.initlize(appid,secret);}});
}

//通过appid获得微信账号信息
function geWXAccountByAppId(appid,cb){
  if(!cb){
    return;
  }
  var query = new AV.Query('WeixinAccount');
  query.equalTo('app_id',appid);
  query.find({success:function(accounts){
    if(accounts.length){
      cb(accounts);
    }
  }});
}

exports.profile = profile;
exports.register = register;
exports.addAccount = addAccount;
exports.geWXAccountByAppId = geWXAccountByAppId;
