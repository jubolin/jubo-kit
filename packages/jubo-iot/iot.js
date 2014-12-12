
var IoT = function(name) {
  var self = this;

  self.sence = {};
  self.home = new Mongo.Collection('juboHome');
  self.devices = new Mongo.Collection('juboDevices')

  Tracker.autorun(function() {
    var slice = Meteor.subscribe('homeSlice',name);

    for(name in self.sence) {
      var fire = true;
      if(slice.ready()) {
        _.each(self.sence[name],function(trigger) {
          self.home.findOne(trigger,function(err,data) {
            if(err || data === null) 
              fire = false; 
          });
        });
      }

      if(fire) self.event.fire(name);
    }
  });
}

_.extend(IoT.prototype, {
  addDevice: function(device,callback) {
    var self = this;

    self.devices.insert(device,{w:1},function(err,result) {
      if(err) return callback(err); 

      console.log('iot add device: ',device);
      var dev = JSON.parse(device);
      var sence = {"devid": dev.id,"service": {}};

      for(serv in dev.service) {
        sence.service[serv] = dev.service[serv];
        self.home.insert(sence,{w:1},function(err,result) {
          console.log('iot add sence %s : ',err?'Error':'Successed',sence);
        });
      }
    });
  },

  adjust: function(dev,service,property) {
    var self = this;
    var sence = {'dev':dev,'service':service,'property':property};

    console.log('adjust ',sence);
    self.home.update(sence, function(err) {
      if(err) console.log('adjust error');
    });
  },

  addSence: function(name,trigger,callback) {
    var self = this;
  
    self.sence[name] = trigger; 
    Tracker.autorun(function() {
      if(self.event.trigger() === name)
        callback();
    });    
  }
});

/*IoT.getDevice = function(location) {
  IoT.devices.findOne({"location":location},function(err,dev) {
    if(err) console.log('get device[%s] error[]',location,err);

    var device = null; 
    switch(dev.type) {
      case "bulb":
        device = new Bulb();
        break;
      case "thermostat":
        device = new Thermostat();
        break;
      default:
        console.log('Invalid device type[%s]',dev.type);
    }

    return device;
  });  
};
*/



