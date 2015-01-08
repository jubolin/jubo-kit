Tinytest.add('jubo-iot - addDevice', function (test) {
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
  properties = slice.properties.find({location:location}).fetch();
  test.length(properties,2);
  var property = slice.property(location,'Lighting','LightState');
  test.equal(property.value,'off');
  slice.adjust('home.kitchen/bulb','Lighting','LightState','on');
  property = slice.property('home.kitchen/bulb','Lighting','LightState');
  test.equal(property.value,'on');

  slice.adjust('home.kitchen/bulb','','Words','Hello World');
  property = slice.property('home.kitchen/bulb','','Words');
  test.equal(property.value,'Hello World');
});
