IoT.Slice = function(name) {
  if (! (this instanceof IoT.Slice))
    // called without `new`
    return new IoT.Slice(name);

  this.name = name;
  this.scene = {};
  this.connection = DDP.connect(process.env.JUBO_IOT_HOME_URL);
  this.properties = new Mongo.Collection('jubo_iot_home');
  this.connection.call('createHomeSlice',name);
  this.slice = this.connection.subscribe('jubo_iot_home_slice_' + name,name);
};

IoT.Slice.prototype.adjust = function(device,service,property,value) {
  var self = this;
  var sence = {'device':device,'service':service,'property':property};

  console.log('adjust ',sence);
  self.properties.update(sence, function(err) {
    if(err) console.log('adjust error');
  });
};

IoT.Slice.prototype.property = function(device,service,property) {
  console.log('get %s.%s property %s.'device,service,property);
  return self.properties.findOne({'device':device,'service':service,'property':property},
                                 {fields:{'property': 1,'value': 1}});
};



