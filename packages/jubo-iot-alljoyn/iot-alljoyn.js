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

IoT.Alljoyn.ObserveAbout() = function() {
  var listener = function(frombus,version,port,objectDescription,aboutData) {
    var driver;
    var dev = {};
    var options = {};
    var sessionListener = 0; //TODO: add sessionListener 
    var aboutObject = alljoyn.AboutObjectDescription(objectDescription);
    var sessionID = IoT.Alljoyn.bus.joinSession(frombus,port,sessionListener);

    options.aboutObject = aboutObject;
    dev.devid = Iot.Home.getUUID();
    dev.aboutData = alljoyn.AboutData(aboutData);
    dev.driverID = IoT.Home.findDriver('alljoyn',dev.aboutData);

    _.each(aboutObject.getPaths(),function(path) {
      _.each(aboutObject.getInterfaces(path),function(ifname)) {
        options.paths[ifname] = path;
      }
       
      options.proxyObject[path] = alljoyn.ProxyBusObject(IoT.Alljoyn.bus,frombus,path,sessionID);   
    });

    driver = IoT.Alljoyn.Driver[dev.driverID](dev.devid,IoT.Alljoyn.Connection(options));
    dev.methods = driver.methods();
    dev.properties = driver.properties();
    IoT.Home.addDevice(dev);
  };

  IoT.Alljoyn.bus.registerAboutListener(listener);
};


