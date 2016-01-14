var fs = require('fs');
function saveLog(buf){
  fs.open('log.js','w+',function(err,fd){
    if(!err){
      fs.write(fd,buf,0,buf.length);
    }
  });
}
