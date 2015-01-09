Tinytest.add('jubo-iot - iot-home - addDevice', function (test) {
  var location = 'home.kitchen/bulb';
  var id = 'J93c06771-c725-48c2-b1ff-6a2a59d445b8';
  var device = {
    devid: id,
    aboutData: {},
    driverID: '27',
    methods: {},
    properties: {} 
  };

  device.methods[id + 'Words' + 'Speak'] = function(words) {
    console.log('Robot speak:',words);
  };

  device.methods[id +'Lighting' + 'LightState' + 'ToggleSwitch'] = function(state) {
    console.log('Robot toggle switch ',state);
  };

  device.properties['Lighting' + 'LightState'] = {
    devid: id,
    service: 'Lighting',
    property: 'LightState',
    value: 'off',
    method: 'ToggleSwitch'
  };

  device.properties['Words'] = {
    devid: id,
    service: '',
    property: 'Words',
    value: '',
    method: 'Speak'
  };

  IoT.Home.devices.remove({});
  IoT.Home.properties.remove({});

  IoT.Home.addDevice(device);
  var devs = IoT.Home.devices.find({devid:id}).fetch();
  var properties = IoT.Home.properties.find({devid:id}).fetch();
  test.length(devs,1);
  test.length(properties,2);
  test.equal(devs[0].location,'Home');

  IoT.Home.installDevice(id,location);
  devs = IoT.Home.devices.find({devid:id}).fetch();
  test.equal(devs[0].location,location);

  IoT.Home.authorize('iotest',[location]);
  var property = IoT.Home.properties.findOne({'location':location,'service':'Lighting'});
  test.equal(property.authorized,['iotest']);
  property = IoT.Home.properties.findOne({'location':location,'service':''});
  test.equal(property.authorized,['iotest']);

  var slice = new IoT.Slice('iotest');
  var property = slice.property(location,'Lighting','LightState');
  test.equal(property.value,'off');
  slice.adjust('home.kitchen/bulb','Lighting','LightState','on');
  property = slice.property('home.kitchen/bulb','Lighting','LightState');
  test.equal(property.value,'on');

  slice.adjust('home.kitchen/bulb','','Words','Hello World');
  property = slice.property('home.kitchen/bulb','','Words');
  test.equal(property.value,'Hello World');
});

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

Robot.methods = function(devid,connection) {
  var methods = {};

  methods[devid + 'Words' + 'Speak'] = function(words) {
    console.log('robot['+ devid + '] speak ' + words + ' to ' + connection.proxyObject.name + ':' + connection.proxyObject.port);
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

Robot.init();
var createDevice = function() {
    var driver;
    var dev = {};
    var connection = {proxyObject:{name:'org.alljoyn.robot',port:22786}};
    
    dev.about = {name:'test'};
    dev.devid = IoT.Home.uuid();
    driver = IoT.Home.findDriver('Alljoyn',dev.about)
    console.log('get driver:',driver.id);
    dev.type = driver.type;
    dev.connector = driver.connector;
    dev.methods = driver.methods(dev.devid,connection);
    dev.properties = driver.properties(dev.devid);
    IoT.Home.addDevice(dev);
};

Tinytest.add('jubo-iot - iot-home - addDriver', function (test) {
  
  var location = 'home.robot';
  var location2 = 'home.kitchen';
  var name = 'drvtest';
  var id = 'J83c06771-c725-48c2-b1ff-6a2a59d445b8';

  IoT.Home.devices.remove({});
  IoT.Home.properties.remove({});
  createDevice();
  createDevice();

  devices = IoT.Home.devices.find().fetch();
  test.length(devices,2);

  id = devices[0].devid;
  IoT.Home.installDevice(id,location);
  devs = IoT.Home.devices.find({devid:id}).fetch();
  test.equal(devs[0].location,location);

  IoT.Home.authorize(name,[location]);
  var property = IoT.Home.properties.findOne({'location':location,'service':'Lighting'});
  test.equal(property.authorized,[name]);
  property = IoT.Home.properties.findOne({'location':location,'service':''});
  test.equal(property.authorized,[name]);

  var slice = new IoT.Slice(name);
  slice.adjust(location,'','Words','Hello World');
  property = slice.property(location,'','Words');
  test.equal(property.value,'Hello World');

  id = devices[1].devid;
  IoT.Home.installDevice(id,location2);
  devs = IoT.Home.devices.find({devid:id}).fetch();
  test.equal(devs[0].location,location2);

  IoT.Home.authorize(name,[location2]);
  var property = IoT.Home.properties.findOne({'location':location2,'service':'Lighting'});
  test.equal(property.authorized,[name]);
  property = IoT.Home.properties.findOne({'location':location2,'service':''});
  test.equal(property.authorized,[name]);

  slice.adjust(location2,'','Words','Hello World');
  property = slice.property(location2,'','Words');
  test.equal(property.value,'Hello World');
});


