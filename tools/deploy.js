var fs = require('fs');
var spawn = require('child_process').spawn;
var Connection = require('ssh2');
var _ = require('underscore');

var Deploy = function(options) {
  var self = this;
  self.options = options || {};

  self.conn = new Connection();
};


_.extend(Deploy.prototype, {
  scp: function(from,to,callback) {
    var len = 0;
    var self = this;
    var buf = new Buffer(256);

    len += buf.write(   'set timeout -1\n' +
    'spawn scp -o StrictHostKeyChecking=no ' + from + ' ' + 
    self.options.username + '@' + self.options.host + ':' + to + '\n' +
    'expect -exact "password: "\n' +
    'send -- "' + self.options.password + '\r"\n' +
    'expect eof\n');


    fs.writeFileSync('.scp_login.exp', buf.toString('utf8', 0, len));

    var scp = spawn('expect', ['-f', '.scp_login.exp']);

    scp.stderr.on('data', function (data) {
      callback(data);
    });

    scp.on('exit', function (code) {
      fs.unlink('.scp_login.exp', function (err) {
        if(err) return callback(err);
      });
      callback(false);
    });
  },

  exec: function(cmd,callback) {
    var self = this;

    self.conn.on('ready',function() {
      self.conn.exec(cmd,function(err,command) {
        if(err) return callback(err);

        command.on('close',function() {
          self.conn.end();
          callback(false);
        });
      });
    }).connect({
      host: self.options.host,
      port: 22,
      username: self.options.username,
      password: self.options.password
    });
  }
});

module.exports = Deploy;
