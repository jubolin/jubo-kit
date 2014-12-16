Package.describe({
  name: 'jubo-iot',
  summary: ' Internet Of Thing package ',
  version: '0.0.1',
});

Package.onUse(function(api) {
  Npm.depends({alljoyn: "0.1.3"});
  api.addFiles('iot.js');
  api.addFiles('iot-slice.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jubo-iot');
  api.addFiles('jubo-iot-tests.js');
});
