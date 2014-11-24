var Connection = require('ssh2');
var _ = require('underscore');

var Deploy = function(options) {
  var self = this;
  var options = options || {};

  self.conn = new Connection();
  self.conn.connect({
    host: options.host,
    port: 22,
    username: options.username,
    password: options.password
  });
};


_.extend(Deploy.prototype, {
  scp: function(from,to,callback) {
    var self = this;

    self.conn.on('ready',function() {
      self.conn.sftp(function(err,sftp) {
        if(err) return callback(err);

        sftp.fastPut(from,to,function(err) {
          if(err) return callback(err);

          return callback(false);
        });
      });

    });
  },

  exec: function(cmd,callback) {
    var self = this;

    self.conn.on('ready',function() {
      self.conn.exec(cmd,function(err,command) {
        if(err) return callback(err);

        command.on('end',function() {
          callback(false);
        });
      });
    });
  },

  close: function() {
    var self = this;

    self.conn.end();
  }
});

module.exports = new Deploy();
