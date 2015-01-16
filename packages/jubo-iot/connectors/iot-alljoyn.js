/*IoT.Connectors.Alljoyn = function() {
  if (! (this instanceof IoT.Connectors.Alljoyn))
    // called without `new`
    return new IoT.Connectors.Alljoyn();
  
  this.name = 'alljoyn';
};
*/
IoT.Connectors.Alljoyn = {};

IoT.Connectors.Alljoyn.start = function() {
  var self = this;

  slef.bus = alljoyn.BusAttachment('jubo-iot-alljoyn');
  self.bus.start();
  self.bus.connect();

  self.ntfConsumer = alljoyn.NotificationService.getInstance();
};

IoT.Connectors.Alljoyn.stop = function() {
  var self = this;

  self.bus.stop();
  self.bus.join();
};

var creatConnection = function() {
};

IoT.Connectors.Alljoyn.observeAbout = function() {
  var self = this;
  var listener = function(frombus,version,port,objectDescription,aboutData) {
    var driver;
    var dev = {};
    var options = {};
    var sessionListener = 0; //TODO: add sessionListener 
    var aboutObject = alljoyn.AboutObjectDescription(objectDescription);
    var sessionID = IoT.Alljoyn.bus.joinSession(frombus,port,sessionListener);

    options.aboutObject = aboutObject;
    dev.about = alljoyn.AboutData(aboutData);
    dev.devid = dev.about.getDeviceID(); 
    driver = IoT.Driver.match('alljoyn',dev);
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
    IoT.Device.add(dev);
    IoT.NotificationCenter.registerHandler(dev.devid,driver.handler);
    //IoT.Home.addDevice(dev);
  };

  self.bus.registerAboutListener(listener);
};

IoT.Connectors.Alljoyn.registerDriver = function(driver) {
  driver.id = IoT.uuid();
  IoT.Driver.register('alljoyn',driver);
};

IoT.Connectors.Alljoyn.observeNotification = function() {
  var self = this;
  var receiver = function(notification) {
    var devid = notification.getDeviceID();
    var appid = notification.getAppId();
    if(IoT.Device.has(devid)) 
      IoT.NotificationCenter.handle(notification);
  };

  self.ntfConsumer.initReceive(self.bus,receiver);
};


