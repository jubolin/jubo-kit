/**
 * @namespace IoT
 * @summary The namespace for all IoT-related methods and classes.
 */

IoT = {}

IoT.Home = function(name) {
  if (! (this instanceof IoT.Home))
    // called without `new`
    return new IoT.Home(name);

  this.properties = new Mongo.Collection('jubo_iot_home_properties');
  this.devices = new Mongo.Collection('jubo_iot_home_devices');
};

IoT.Home.prototype.addDevice = function(device,properties,callback) {
  var self = this;
  var dev = {
    location: 'Home'
    type: device.type,
    devid: device.devid,
    connector: device.connector,
  };

  self.devices.insert(dev,function(err,result) {
    if(err) return callback(err);

    console.log('iot add device: ',dev);
    // export device methods
    Meteor.methods(device.methods);

    _.each(device.properties,function(property) {
      self.properties.insert(property,function(err,result) {
        console.log('iot add property %s : ',err?'Error':'Successed',property);
      });
    });
  });
};

IoT.Home.prototype.installDevice = function(device,location) {
  self.devices.update({devid:devid},{$set:{'location': location}});
  self.proeprties.update({devid:devid},{$set:{'location': location}},{multi:true});
};

IoT.Home.prototype.getDevice = function(location) {
  var device = IoT.Home.devices.findOne({"location":location});
  device.properties = IoT.Home.properties.find({'device':location}).fetch();
  console.log('get device ',device);
  return device;
};

Meteor.methods({
  createHomeSlice: function(name) {
    Meteor.publish('jubo_iot_home_sclice_' + name,function(name) {
      return IoT.Home.properties.find({authorized:name},{fields: {'authorized': 0}});
    });
  }
});

