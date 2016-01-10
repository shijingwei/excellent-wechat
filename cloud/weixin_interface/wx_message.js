/**
* 微信消息保存
*/
exports.save = function(params) {
  var message = new AV.Object('WX_message');
  var count = 0;
  for (obj in params){
    console.log(obj);
    var val =  params[obj][0];
    console.log(val);
    message.set(obj,params[obj][0]);
    count++;
  }
  if(count) message.save();
}
