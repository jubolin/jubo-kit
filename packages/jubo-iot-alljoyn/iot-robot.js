IoT.Robot = function(device) {
  if (! (this instanceof IoT.Robot))
    // called without `new`
    return new IoT.Robot(location);

  var self = this;
  self.device = device;
};

IoT.Robot.prototype.methods = function() {
  var methods = {};

  methods[self.device.methodPrefix + 'Talk'] = function(brightness) {
  };

  methods[self.device.methodPrefix + 'WalkFoward'] = function(length) {
  };

  Meteor.methods(methods);
}

/*
IoT.Robot.prototype.property = function(slice,device,service,property) {
  console.log('get %s.%s property %s.'device,service,property);
  return self.slice.properties.findOne({'device':device,'service':service,'property':property},
                                 {fields:{'property': 1,'value': 1}});
};

Meteor.methods({
  robotWalk: function(location,direction,length) {
    // walk

  },
});
*/

