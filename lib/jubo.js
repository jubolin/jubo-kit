var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var arg = process.argv[2];
var args = process.argv.slice(2); 

if(arg === 'bundle') {
  var cmd = path.join(process.cwd(),'/devkit/demeteorizer/bin/demeteorizer');
  var shell = spawn(cmd,args);

  shell.stderr.on('data',function(data) {
    console.log('Error:',data);
  });

} else if(arg === 'help') {
  var cmd = process.cwd() + '/devkit/meteor/meteor --help';
  exec(cmd,function(err,stdout,stderr){
    if(err) console.log(err);
    else if(stderr) console.log(stederr);
    else if(stdout) console.log(stdout);
  });
} else {
  var cmd = path.join(process.cwd(),'/devkit/meteor/meteor');
  var shell = spawn(cmd,args);

  shell.stderr.on('data',function(data) {
    console.log('Error:',data);
  });
}


