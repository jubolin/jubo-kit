IoT.Slice = function(name) {
  if (! (this instanceof IoT.Slice))
    // called without `new`
    return new IoT.Slice(name);

  this.name = name;
  this.connection = DDP.connect(process.env.JUBO_IOT_HOME_URL);
  this.properties = new Mongo.Collection('jubo_iot_home',this.connection);
  this.connection.call('createHomeSlice',name);
  this.slice = this.connection.subscribe('jubo_iot_home_slice_' + name,name);
};

IoT.Slice.prototype.adjust = function(device,service,property,value) {
  var self = this;

  // authorize
  var query = {'device':device,'service':service,'property':property,'authorized':self.name};
  var sence = self.properties.findOne(query);
  if(sence) {
    console.log('adjust ',sence);
    // apply action
    self.connection.call(sence.devid + service + sence.method,value);
    // emit event
    self.proeprties.update(query,{$set:{'value': value}});
  } else {
    console.log(self.name + 'don\'t have permission to adjust ' + device);
  }
};

IoT.Slice.prototype.property = function(device,service,property) {
  console.log('get %s.%s property %s.'device,service,property);
  return self.properties.findOne({'device':device,'service':service,'property':property},
                                 {fields:{'property': 1,'value': 1}});
};



