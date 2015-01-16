IoT.Alljoyn.Robot = funtcion(devid,connection){
  if (! (this instanceof IoT.Alljoyn.Robot))
    // called without `new`
    return new IoT.Alljoyn.Robot(name);

  this.type = 'robot';
  this.prefix = devid;
  this.connector = 'alljoyn'
  this.connection = connection;
};

IoT.Alljoyn.Robot.probe = function(about) {
};

IoT.Alljoyn.Robot.init = function() {
  IoT.Alljoyn
};

IoT.Alljoyn.Robot.methods = function() {
  var self = this;
  var methods = {};

  methods[self.prefix + 'Words' + 'Speak'] = function(words) {
    var proxyObject = self.connection.getProxyObject('com.jubolin.iot.robot');
    proxyObject.methodCall('com.jubolin.iot.robot','speak',words,1);
  };

  methods[self.prefix + 'Walk'] = function(distance) {
    var proxyObject = self.connection.getProxyObject('com.jubolin.iot.robot.mobility');
    proxyObject.methodCall('com.jubolin.iot.robot.mobility','walk',distance,1,reply);
  };

  methods[self.prefix + 'Lighting' + 'LightState' + 'ToggleSwitch'] = function(state) {
    var proxyObject = self.connection.getProxyObject('com.jubolin.iot.robot.lighting');
    proxyObject.methodCall('com.jubolin.iot.robot.lighting','ToggleSwitch',state,1,reply);
  };

  return methods;
};

IoT.Alljoyn.Robot.properties = function() {
  var properties = {};

  properties['Lighting' + 'LightState'] = {
    devid: prefix,
    service: 'Lighting',
    property: 'LightState',
    value: 'off',
    method: 'ToggleSwitch'
  };

  properties['Words'] = {
    devid: prefix,
    service: '',
    property: 'Words',
    value: '',
    method: 'Speak'
  };
};

