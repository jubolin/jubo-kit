var spawn = require('child_process').spawn;
var Deploy = require('deploy');

var arg = process.argv[2];
var args = process.argv.slice(2);
var juboPath = process.env.JUBO_PATH;
var cmd = juboPath;

if(arg === 'build') {
  cmd += '/demeteorizer/bin/demeteorizer';
} else if(arg === 'deploy') {
  var options = {};
  var url = args[3].split('@');

  options.username = url[0];
  options.host = url[1].split(':')[0];
  options.path = url[1].split(':')[1];
  options.juboPath = juboPath;

  var deploy = new Deploy(options);
  deploy.scp(juboPath + '/jubo-r1.0.tar.gz','/tmp/jubo-r1.0.tar.gz',function(err) {
    if(err) {
      console.log(err);
      return;
    }

    var remote = '/tmp/' + app;
    deploy.scp(app,remote,function(err) {
      if(err) {
        console.log(err);
        return;
      }

      cmd = 'tar zxvf ' + remote + ' -C /root && ' +
            '/root/jubo/jubo install ' + app + '&& ' +
            '/root/jubo/jubo run ' + app;

      deploy.exec(cmd,function(err) {
        if(err) {
          console.log(err);
          return;
        }
      });
    });
  });

  deploy.close();
  return;
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


