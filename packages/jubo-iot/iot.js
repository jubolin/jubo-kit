/**
 * @namespace IoT
 * @summary The namespace for all IoT-related methods and classes.
 */

IoT = {}

IoT.Home = function(name) {
  if (! (this instanceof IoT.Home))
    // called without `new`
    return new IoT.Home(name);

  this.properties = new Mongo.Collection('jubo_iot_home');
  this.devices = new Mongo.Collection('jubo_iot_home_devices');
};

IoT.Home.prototype.addDevice = function(device,callback) {
  var self = this;

  self.devices.insert(device,{w:1},function(err,result) {
    if(err) return callback(err);

    console.log('iot add device: ',device);
    var dev = JSON.parse(device);
    var sence = {"devid": dev.id,"service": {}};

    for(serv in dev.service) {
      sence.service[serv] = dev.service[serv];
      self.properties.insert(sence,{w:1},function(err,result) {
        console.log('iot add sence %s : ',err?'Error':'Successed',sence);
      });
    }
  });
};

IoT.Home.prototype.getDevice = function(location) {
  var device = {};
  IoT.Home.devices.findOne({"location":location},function(err,dev) {
    console.log('get device[' + location + ']' + err?'failed':'successed.');
    if(!err) {
      device = dev;
      IoT.Home.properties.find({'device':location}).toArray(function(err,properties) {
        console.log('get device[' + location + ']' + '\'s properties' + err?'failed':'successed.');
        device.properties = properties;
      });
    }
  });
};



