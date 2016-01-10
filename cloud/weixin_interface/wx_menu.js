/**
* 微信端菜单
*/
var constants = require('cloud/weixin_interface/wx_constants.js');

//微信配置
function wxcreate(appid) {
  //get token
  //删除已有的菜单
  //查询数据库菜单
  //调用创建菜单

  AV.Cloud.httpRequest({
  url: constants.URL_CREATE_MENU,
  params :{
    grant_type:'client_credential',
    appid : appid,
    secret : secret
  },
  success: function(httpResponse) {
  },
  error: function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
  }
  });
}

//菜单列表
exports.listMenu = function (req ,res ){
  var params = req.query;

}

//创建菜单
exports.createMenu= function(req,res){
  var params = req.body;
  create(params, function(err, data) {
    if (err) {
      return res.send(err.code || 500, err.message);
    }
    return res.json(data);
  });
}

function create(params,cb){
  save(params.account_id,params.level,params.type,params.name,params.key,params.url,params.media_id,cb);
};

//private
function save(account_id,level,type,name,key,url,media_id,cb){
  var menu = new AV.Object('wx_menu');
  menu.set('account_id',account_id);
  menu.set('level',level);
  menu.set('type',type);
  menu.set('name',name);
  menu.set('key',key);
  menu.set('url',url);
  menu.set('media_id',media_id);
  menu.save(null,{success:function(menu){cb(null,menu);},error:function(menu,err){cb(err);}});
}
