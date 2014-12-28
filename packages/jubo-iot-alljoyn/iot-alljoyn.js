IoT.Alljoyn = {};

IoT.Alljoyn.connect() = function() {
  IoT.Alljoyn.bus = alljoyn.BusAttachment('jubo-iot-alljoyn');
  IoT.Alljoyn.bus.start();
  IoT.Alljoyn.bus.connect();
};

IoT.Alljoyn.stop() = function() {
  IoT.Alljoyn.bus.stop();
  IoT.Alljoyn.bus.join();
};

IoT.Alljoyn.createDevice = function() {
  var device = {};

   device.methods = IoT.Alljoyn[deviceType].methods(device.);
   return device;
};
