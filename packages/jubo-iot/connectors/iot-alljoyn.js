IoT.Connectors.Alljoyn = {};
IoT.Drivers.Alljoyn = {};

IoT.Connectors.Alljoyn.connect = function() {
  IoT.Alljoyn.bus = alljoyn.BusAttachment('jubo-iot-alljoyn');
  IoT.Alljoyn.bus.start();
  IoT.Alljoyn.bus.connect();
};

IoT.Connectors.Alljoyn.stop = function() {
  IoT.Alljoyn.bus.stop();
  IoT.Alljoyn.bus.join();
};

var creatConnection = function() {
};

IoT.Connectors.Alljoyn.ObserveAbout = function() {
  var listener = function(frombus,version,port,objectDescription,aboutData) {
    var driver;
    var dev = {};
    var options = {};
    var sessionListener = 0; //TODO: add sessionListener 
    var aboutObject = alljoyn.AboutObjectDescription(objectDescription);
    var sessionID = IoT.Alljoyn.bus.joinSession(frombus,port,sessionListener);

    options.aboutObject = aboutObject;
    dev.devid = IoT.Home.uuid();
    dev.about = alljoyn.AboutData(aboutData);
    driver = IoT.Home.findDriver('alljoyn',dev.about);
    console.log('device: ' + dev.devid + ' matched driver: ' + driver.id);

    _.each(aboutObject.getPaths(),function(path) {
      _.each(aboutObject.getInterfaces(path),function(ifname) {
        options.paths[ifname] = path;
      });
       
      options.proxyObject[path] = alljoyn.ProxyBusObject(IoT.Alljoyn.bus,frombus,path,sessionID);   
    });

    dev.type = driver.type;
    dev.connector = driver.connector;
    dev.methods = driver.methods(dev.devid,createConnection(options));
    dev.properties = driver.properties(dev.devid);
    IoT.Home.addDevice(dev);
  };

  IoT.Alljoyn.bus.registerAboutListener(listener);
};

IoT.Connectors.Alljoyn.registerDriver = function(driver) {
  driver.id = IoT.Home.uuid();
  IoT.Drivers.Alljoyn[driver.id] = driver;
};
