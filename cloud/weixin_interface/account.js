/**
* 后台用户
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
      // 注册成功，可以使用了.
      var weixinAccount = AV.Object.new('WeixinAccount');
      weixinAccount.set('owner',user);
      weixinAccount.set('app_id',appid);
      weixinAccount.set('app_secret',secret);

      //初次初始化 access_token
      weixinAccount.save(null,{success:function(account){tokenjs.initlize(appid,secret);}});
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
function addWeixinAccount(req,res){

}


// 查看账号信息
function detail() {

}

exports.profile = profile;
exports.register = register;
exports.detail = detail;
