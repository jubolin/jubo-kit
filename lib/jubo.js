var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var Deploy = require('./deploy.js');

var arg = process.argv[2];
var args = process.argv.slice(2); 
var cmd = process.env.JUBO_PATH;

if (arg === 'deploy') {
  var options = {};
  var url = args[1].split(':');

  options.pktPath = url[1];
  options.host = url[0].split('@')[1];
  options.username = url[0].split('@')[0];
  if(options.pktPath) 
    options.appPath = options.pktPath;
  else {
    options.pktPath = '/tmp';
    options.appPath = '/root';
  }

  console.log("Build app tarball");
  cmd += '/demeteorizer/bin/demeteorizer';
  var jubo = spawn(cmd,args);

  jubo.stdout.on('data',function(data) {
    console.log(''+data);
  });

  jubo.on('close',function(code) {
    if(code === 0) {
      var appdir = process.cwd();
      var appname = path.basename(process.cwd());
      cmd = 'tar zxf ' + process.env.JUBO_PATH + '/jubo-r0.1.0.tar.gz -C ' + appdir + 
        ' && mkdir -p ./jubo/' + appname +
        ' && cp -rf .demeteorized/* ./jubo/' + appname +
        ' && cp -f ./jubo/packages/mongo.js* ./jubo/' + appname + '/programs/server/packages' +
        ' && rm -rf ./jubo/packages' +
        ' && tar zcf ' + appname + '.mpk ' + 'jubo' + 
        ' && rm -rf jubo';

      exec(cmd,function(err,stdout,stderr){
        console.log(''+stdout);
        console.log(''+stderr);

        getPassword(url[0] + '\'s password:',function(password) {
          options.password = password;
          console.log('options:',options);
    
          var deploy = new Deploy(options);
          var tarball = appname + '.mpk';

          deploy.scp(tarball,options.pktPath,function(err) {
            if(err) {
              console.log(''+err);
              return;
            }

            cmd = 'tar zxf ' + options.pktPath + '/' + tarball + ' -C ' + options.appPath + 
              ' && ' + options.appPath + '/jubo/jubo run ' + appname +
              ' && rm -rf ' + options.pktPath + '/' + tarball;

            console.log(cmd);
            deploy.exec(cmd,function(err) {
              if(err) console.log(''+err);
            });
          });
        });
      });
    }
  });

  return;
}else if(arg === 'build') {
  cmd += '/demeteorizer/bin/demeteorizer';
} else {
  cmd += '/meteor/meteor'; 
}

var jubo = spawn(cmd,args);

jubo.stdout.on('data',function(data) {
  console.log(''+data);
});

jubo.stderr.on('data',function(data) {
  console.log(''+data);
});

function getPassword(prompt, callback) {
  if (prompt === undefined) {
    prompt = 'Password: ';
  }
  if (prompt) {
    process.stdout.write(prompt);
  }

  var stdin = process.stdin;
  stdin.resume();
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  var password = '';
  stdin.on('data', function (ch) {
    ch = ch + "";
    switch (ch) {
      case "\n":
      case "\r":
      case "\u0004":
        // They've finished typing their password
        process.stdout.write('\n');
        stdin.setRawMode(false);
        stdin.pause();
        callback(password);
      break;

      case "\u0003":
        process.exit();
      break;

      default:
        process.stdout.write('*');
        password += ch;
      break;
    }
  });
}



