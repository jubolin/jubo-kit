/**
 * @namespace IoT
 * @summary The namespace for all IoT-related methods and classes.
 */

IoT = {};
IoT.Home = {};
IoT.Connectors = {};
IoT.NotificationCenter = {};
IoT.Device = {};

var addDeviceAsync = function(device,cb) {
  var dev = {
    location: 'Home',
    type: device.type,
    devid: device.devid,
    connector: device.connector,
  };

  IoT.Device.devices.insert(dev,function(err,result) {
    if(err) return cb(err);

    console.log('export methods:\n',device.methods);
    Meteor.methods(device.methods);

    _.each(device.properties,function(property) {
      IoT.Device.properties.insert(property,function(err,result) {
        if(err) return cb(err);
        console.log('add property:\n', property);
      });
    });
  });

  cb && cb(null);
};

IoT.Device.properties = new Mongo.Collection('jubo_iot_properties');
IoT.Device.devices = new Mongo.Collection('jubo_iot_devices');
IoT.Device.add = Meteor.wrapAsync(addDeviceAsync);
IoT.Device.get = function(devid) {
  return IoT.Device.devices.findOne({'devid':devid});
};
//IoT.Home.addDevice = Meteor.wrapAsync(addDeviceAsync);

IoT.Home.installDevice = function(devid,location) {
  IoT.Device.devices.update({devid:devid},{$set:{'location': location}});
  IoT.Device.properties.update({devid:devid},{$set:{'location': location}},{multi:true});
};

/*IoT.NotificationCenter.connect = function(name) {
  var connection = DDP.connect(process.env.JUBO_IOT_HOME_URL);
  //this.properties = new Mongo.Collection('jubo_iot_properties',this.connection);
  Meteor.publish('jubo_iot_home_slice_' + name,function(name) {
      return IoT.Device.properties.find({'authorized':name},{fields: {'authorized': 0}});
  });

  return connection;
};
*/

/*IoT.Home.getDevice = function(location) {
  var device = IoT.Home.devices.findOne({"location":location});
  device.properties = IoT.Home.properties.find({'location':location}).fetch();
  console.log('get device ',device);
  return device;
};
*/

IoT.Home.authorize = function(app,locations) {
  _.each(locations,function(location) {
    console.log(app + ' authorized to ' + location);
    IoT.Device.properties.update({'location':location},{$addToSet: {'authorized': app}},{multi:true});
    // ToDo 细粒度的权限控制
    IoT.Device.properties.allow({
      update: function(userId,doc) {
        return true;
      }
    });
  });
};

/*IoT.Home.findDriver = function(connector,about) {
  var findedDriver;
  _.each(IoT.Drivers[connector],function(driver) {
    if(driver.probe(about)){
      findedDriver = driver;
    }
  });

  return findedDriver;
};
*/

IoT.Driver = {};
IoT.Driver.drivers = {};
IoT.Driver.drivers.alljoyn = {};

IoT.Driver.match = function(connector,device) {
  var matchedDriver;
  _.each(IoT.Driver.drivers[connector],function(driver) {
    if(driver.probe(device)){
      matchedDriver = driver;
    }
  });

  return matchedDriver;
};

IoT.Driver.register = function(connector,driver) {
  IoT.Driver.drivers[connector][driver.id] = driver;
};

/*IoT.Home.updateProperty = function(property) {
  IoT.Home.properties.update({'devid':property.devid},{$set{'value':value}});
};
*/

//IoT.NotificationCenter.notifications = new Mongo.Collection('jubo_iot_notifications');

/*IoT.NotificationCenter.update = function(notification) {
  var property = {'devid':notification.devid,'value':notification.value};
  IoT.Home.updateProperty(property); 
};
*/

/*IoT.NotificationCenter.add = function(notification) {
  IoT.NotificationCenter.notifications.update({'devid':notification.getDeviceID(),
                                              'appid':notification.getAppID(),
                                              'msgid':notification.getMessageID()},
                                              {$set: {'notifications': notification}},
                                              {upsert:true});
};
*/

IoT.NotificationCenter.handlers = {};
IoT.NotificationCenter.handle = function(connector,notification) {
  /*var driverID = IoT.Device.getDriverID(notification.getDeviceID());
  var driver = IoT.Driver.getDriver(connector,driverID);
  var properties = driver.handleNotification(notification);
  */
  var query;
  var properties = IoT.NotificationCenter.handlers[notification.getDeviceID()](notification);

  _.each(properties,function(property) {
    query = {
      'devid': property.devid,
      'service': property.service,
      'property': property.property
    };
    console.log('notify update property:',property);
    IoT.Device.properties.update(query,{$set: {'value':property.value}});
  });
};

// TODO 根据传入参数决定移除的消息，例如只传入devid则删除该设备下的所有消息
/*IoT.NotificationCenter.remove = function(devid,appid,msgid) {
  IoT.NotificationCenter.notifications.remove({'devid':devid,'appid':appid,'msgid':msgid});
};
*/

IoT.NotificationCenter.registerHandler = function(devid,handler) {
  IoT.NotificationCenter.handlers[devid] = handler;
};

IoT.NotificationCenter.analyse = function() {
};

IoT.NotificationCenter.mining = function() {
};

IoT.uuid = function() {
  return Random.id();
}

Meteor.methods({
  createHomeSlice: function(name) {
    console.log('crate home slice',name);
    /*Meteor.publish('jubo_iot_home_slice_' + name,function(name) {
      return IoT.Device.properties.find({'authorized':name},{fields: {'authorized': 0}});
    });
    */
    Meteor.publish('jubo_iot_home_slice_' + name,function(name) {
      var self = this;
      var handler = IoT.Device.properties.find({'authorized':name},{fields: {'authorized': 0}}).observe({
        added: function(doc) {
          self.added('jubo_iot_properties',doc._id,doc);
          //console.log('publish added:',doc);
        },
        changed: function(doc) {
          self.changed('jubo_iot_properties',doc._id,doc);
          //console.log('publish changed:',doc);
        }
      });

      self.ready();
    });
  },

  requestAuthorization: function(app,locations) {
    console.log('Application ' + app + 'request authorization ' + locations); 
  }
});

