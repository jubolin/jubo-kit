Package.describe({
  name: 'jubo-iot',
  summary: ' Internet Of Thing package ',
  version: '0.0.1',
});

Package.onUse(function(api) {
  api.use('random');
  api.use('mongo', ['client', 'server']);
  api.addFiles('iot.js');
  api.addFiles('./connectors/iot-alljoyn.js');
  api.addFiles('./drivers/iot-robot.js');
  api.addFiles('iot-slice.js');
  api.export('IoT');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('test-helpers');
  api.use('jubo-iot');
  api.addFiles('jubo-iot-tests.js','server');
});
