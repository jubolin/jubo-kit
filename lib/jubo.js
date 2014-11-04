var exec = require('child_process').exec;

var arg = process.argv[2];
var args = process.argv.slice(2); 
var cmd = process.cwd();

if(arg === 'bundle') {
  cmd += '/devkit/demeteorizer/bin/demeteorizer ';
} else {
  cmd += '/devkit/meteor/meteor ';
}

args.forEach(function(arg) {
  cmd = cmd + arg + ' '; 
});

exec(cmd,function(err,stdout,stderr) {
  if(stderr) console.log(stderr);
  if(stdout) console.log(stdout);
});

