IoT.Slice = function(name) {
  if (! (this instanceof IoT.Slice))
    // called without `new`
    return new IoT.Slice(name);

  var subscribeAsync = function(connection,name,cb) {
    connection.subscribe('jubo_iot_home_slice_' + name,name,function(){
      cb && cb();
    });
  };

  var subscribe = Meteor.wrapAsync(subscribeAsync);

  this.name = name;
  console.log('slice ' + name + ' connect to ',process.env.JUBO_IOT_HOME_URL);
  this.connection = DDP.connect(process.env.JUBO_IOT_HOME_URL);
  this.connection.call('createHomeSlice',name);
  console.log('connection status:',this.connection.status());
  
  this.properties = new Mongo.Collection('jubo_iot_home_properties',this.connection);
  this.slice = subscribe(this.connection,name);
};



IoT.Slice.prototype.adjust= function(location,service,property,value) {
  var self = this;

  var query = {'location':location,'service':service,'property':property};
  var sence = self.properties.findOne(query);
  if(sence) {
    console.log('adjust ',sence);
    // apply action
    console.log('call method','' + sence.devid + service + property + sence.method);
    self.connection.call(sence.devid + service + property + sence.method,value);
    // emit event
    self.properties.update(sence._id,{$set:{'value': value}});
  } else {
    console.log(self.name + 'don\'t have permission to adjust ' + location);
  }
};

IoT.Slice.prototype.property = function(location,service,property,cb) {
  var self = this;
  console.log('get ' + location + '.' + service + '.' + property);
  return self.properties.findOne({'location':location,'service':service,'property':property},
                                 {fields:{'property': 1,'value': 1}});
};

IoT.Slice.prototype.requestAuthorization = function(locations) {
  var self = this;
  self.connection.call('requestAuthorization',self.name,locations);
};



