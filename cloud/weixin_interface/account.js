/**
* 后台用户
*
*/

function registerPage(req,res) {

}

//注册 账号
function register() {
  var user = new AV.User();
  user.set('username', 'hjiang');
  user.set('password', 'f32@ds*@&dsa');
  user.set('email', 'hang@leancloud.rocks');

  // other fields can be set just like with AV.Object
  user.set('phone', '186-1234-0000');

  user.signUp(null, {
    success: function(user) {
      // 注册成功，可以使用了.
    },
    error: function(user, error) {
      // 失败了
      console.log('Error: ' + error.code + ' ' + error.message);
    }
  });
}

// 查看账号信息
function detail() {

}
