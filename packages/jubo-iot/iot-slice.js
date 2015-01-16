var subscribeAsync = function(connection,name,cb) {
    connection.subscribe('jubo_iot_home_slice_' + name,name,function(){
      cb && cb();
    });
};

var subscribe = Meteor.wrapAsync(subscribeAsync);

IoT.Home.Slice = function(name) {
  console.log('+++++++++++++++++++++++');
  if (! (this instanceof IoT.Home.Slice))
    // called without `new`
    return new IoT.Home.Slice(name);


  this.name = name;
  console.log('slice ' + name + ' connect to ',process.env.JUBO_IOT_HOME_URL);
  this.connection = DDP.connect(process.env.JUBO_IOT_HOME_URL);
  this.connection.call('createHomeSlice',name);
  console.log('connection status:',this.connection.status());
  this.properties = new Mongo.Collection('jubo_iot_properties',this.connection);
};



IoT.Home.Slice.prototype.adjust= function(location,service,property,value) {
  var self = this;

  var slice = subscribe(self.connection,self.name);
  var query = {'location':location,'service':service,'property':property};
  var sence = self.properties.findOne(query);
  if(sence) {
    console.log('adjust property: ' + service + '.' + property + '@' + location);
    self.connection.call(sence.devid + service + property + sence.method,value);
    self.properties.update(sence._id,{$set:{'value': value}});
  } else {
    console.log(self.name + ' don\'t have permission to adjust',query);
  }
};

IoT.Home.Slice.prototype.property = function(location,service,property,cb) {
  var self = this;
  var slice = subscribe(self.connection,self.name);

  console.log('get property: ' + service + '.' + property + '@' + location);
  return self.properties.findOne({'location':location,'service':service,'property':property},
                                 {fields:{'property': 1,'value': 1}});
};

IoT.Home.Slice.prototype.sence = function(f) {
  var self = this;
  var c = Tracker.autorun(function senceAutorun(c) { 
    return f.call(self, c);
  });
};

IoT.Home.Slice.prototype.requestAuthorization = function(locations) {
  var self = this;
  self.connection.call('requestAuthorization',self.name,locations);
};



