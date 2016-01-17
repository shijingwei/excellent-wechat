var crypto = require('crypto');
var config = require('cloud/config/weixin.js');
var debug = require('debug')('AV:weixin');
var wx_message = require('cloud/weixin_interface/wx_message.js');
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
var _ = require('underscore');

exports.exec = function(params, cb) {
  if (params.signature) {
    checkSignature(params.appid,params.signature, params.timestamp, params.nonce, params.echostr, cb);
  } else {
    receiveMessage(params, cb)
  }
}

// 验证签名
var checkSignature = function(appid,signature, timestamp, nonce, echostr, cb) {
  var oriStr = [appid, timestamp, nonce].sort().join('')
  var code = crypto.createHash('sha1').update(oriStr).digest('hex');
  debug('code:', code)
  if (code == signature) {
    cb(null, echostr);
  } else {
    var err = new Error('Unauthorized');
    err.code = 401;
    cb(err);
  }
}

// 接收普通消息
var receiveMessage = function(msg, cb) {
  wx_message.save(msg.appid,msg.xml);
  var result = {
    xml: {
      ToUserName: msg.xml.FromUserName[0],
      FromUserName: '' + msg.xml.ToUserName + '',
      CreateTime: new Date().getTime(),
      MsgType: 'text',
      Content: '你好，你发的内容是「' + msg.xml.Content + '」。'
    }
  }
  cb(null, result);
}

//签名json
exports.signature = function(jsons){
  if(!jsons){
    return;
  }
  var arr = new Array();
  var count = 0;
  for(o in  jsons){
    count = arr.push(o);
  }
  if(!count){
    return;
  }
  arr.sort();
  var result = "";
  for(i=0;i<count;i++){
    if(i){
      result +="&";
    }
    result += arr[i]+"="+jsons[arr[i]];
  }
  var code = crypto.createHash('sha1').update(result).digest('hex');
  return code;
}

exports.noncestr = function(n) {
  if (!n)
  n = 10;
  var str = '';
  for(i=0;i<n;i++){
    var c = _.random(0,82);
    str += CHARS.charAt(c);
  }
  return str;
}
