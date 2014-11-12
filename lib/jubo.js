var spawn = require('child_process').spawn;

var arg = process.argv[2];
var args = process.argv.slice(2); 
var cmd = process.env.JUBO_PATH;

if(arg === 'build') {
  cmd += '/demeteorizer/bin/demeteorizer';
} else {
  cmd += '/meteor/meteor';
}

var jubo = spawn(cmd,args);

jubo.stdout.on('data',function(data) {
  console.log(''+data);
});

jubo.stderr.on('data',function(error) {
  console.log(''+data);
});


