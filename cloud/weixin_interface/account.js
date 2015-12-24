/**
* 后台用户
*
*/

function register_page(req,res) {
  res.render('weixin/register',{});
}

//注册 账号
function register(req,res) {
  console.log(req);
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
      weixinAccount.save();
      res.render('register');
    },
    error: function(user, error) {
      // 失败了
      console.log(error);
      res.send('error');
    }
  });
}

// 查看账号信息
function detail() {

}

exports.register_page = register_page;
exports.register = register;
exports.detail = detail;
