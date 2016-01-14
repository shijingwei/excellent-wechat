var fs = require('fs');
exports.saveLog = function(buf){
  fs.writeFile('message.txt', buf, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}
