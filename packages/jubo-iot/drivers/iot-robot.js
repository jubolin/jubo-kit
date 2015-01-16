Robot = {};  
Robot.type = 'robot';
Robot.connector = 'alljoyn';

Robot.probe = function(about) {
  if(about.name === 'test')
    return true;
};

Robot.init = function() {

  IoT.Connectors.Alljoyn.registerDriver(Robot);
};

Robot.notificationHandler = function(notification) {
};

Robot.observe = function() {
};

Robot.methods = function(devid,connection) {
  var methods = {};

  methods[devid + 'Words' + 'Speak'] = function(words) {
    var proxyObject = connection.getProxyObject('com.jubolin.iot.robot');
    proxyObject.methodCall('com.jubolin.iot.robot','speak',words,1);
  };

  methods[devid + 'Walk'] = function(distance) {
    var proxyObject = connection.getProxyObject('com.jubolin.iot.robot.mobility');
    proxyObject.methodCall('com.jubolin.iot.robot.mobility','walk',distance,1,reply);
  };

  methods[devid + 'Lighting' + 'LightState' + 'ToggleSwitch'] = function(state) {
    var proxyObject = connection.getProxyObject('com.jubolin.iot.robot.lighting');
    proxyObject.methodCall('com.jubolin.iot.robot.lighting','ToggleSwitch',state,1,reply);
  };

  return methods;
};

Robot.properties = function(devid) {
  var properties = {};

  properties['Lighting' + 'LightState'] = {
    devid: devid,
    service: 'Lighting',
    property: 'LightState',
    value: 'off',
    method: 'ToggleSwitch'
  };

  properties['Words'] = {
    devid: devid,
    service: '',
    property: 'Words',
    value: '',
    method: 'Speak'
  };

  return properties;
};

