Package.describe({
  name: 'jubo-iot',
  summary: ' Internet Of Thing package ',
  version: '0.0.1',
});

Package.onUse(function(api) {
//  api.versionsFrom('1.0.1');
  api.addFiles('jubo-iot.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jubo-iot');
  api.addFiles('jubo-iot-tests.js');
});
