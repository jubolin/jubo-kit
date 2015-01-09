/**
 * @namespace IoT
 * @summary The namespace for all IoT-related methods and classes.
 */

IoT = {};
IoT.Home = {};
IoT.Drivers = {};
IoT.Connectors = {};

IoT.Home.properties = new Mongo.Collection('jubo_iot_home_properties');
IoT.Home.devices = new Mongo.Collection('jubo_iot_home_devices');

var addDeviceAsync = function(device,cb) {
  var dev = {
    location: 'Home',
    type: device.type,
    devid: device.devid,
    connector: device.connector,
  };

  IoT.Home.devices.insert(dev,function(err,result) {
    if(err) return cb(err);

    console.log('export methods:\n',device.methods);
    Meteor.methods(device.methods);

    _.each(device.properties,function(property) {
      IoT.Home.properties.insert(property,function(err,result) {
        if(err) return cb(err);
        console.log('add property:\n', property);
      });
    });
  });

  cb && cb(null);
};

IoT.Home.addDevice = Meteor.wrapAsync(addDeviceAsync);

IoT.Home.installDevice = function(devid,location) {
  IoT.Home.devices.update({devid:devid},{$set:{'location': location}});
  IoT.Home.properties.update({devid:devid},{$set:{'location': location}},{multi:true});
};

IoT.Home.getDevice = function(location) {
  var device = IoT.Home.devices.findOne({"location":location});
  device.properties = IoT.Home.properties.find({'location':location}).fetch();
  console.log('get device ',device);
  return device;
};

IoT.Home.authorize = function(app,locations) {
  _.each(locations,function(location) {
    console.log(app + ' authorized to ' + location);
    IoT.Home.properties.update({location:location},{$addToSet: {'authorized': app}},{multi:true});
    // ToDo 细粒度的权限控制
    IoT.Home.properties.allow({
      update: function(userId,doc) {
        return true;
      }
    });
  });
};

IoT.Home.findDriver = function(connector,about) {
  var findedDriver;
  _.each(IoT.Drivers[connector],function(driver) {
    if(driver.probe(about)){
      findedDriver = driver;
    }
  });

  return findedDriver;
};


IoT.Home.uuid = function() {
  return Random.id();
}

Meteor.methods({
  createHomeSlice: function(name) {
    console.log('crate home slice',name);
    Meteor.publish('jubo_iot_home_slice_' + name,function(name) {
      return IoT.Home.properties.find({'authorized':name},{fields: {'authorized': 0}});
    });
  },

  requestAuthorization: function(app,locations) {
    console.log('Application ' + app + 'request authorization ' + locations); 
  }
});

