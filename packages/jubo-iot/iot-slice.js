IoT.Slice = function(name) {
  if (! (this instanceof IoT.Slice))
    // called without `new`
    return new IoT.Slice(name);

  this.name = name;
  this.scene = {};
  this.connection = DDP.connect(HOME_URL);
  //this.sence = new Mongo.Collection('jubo_iot_sence_' + name);
  this.properties = IoT.Home.properties;
  this.connection.subscribe('homeSlice',name);
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
  var self = this;

  var query = {'device':device,'service':service,'property':property};
  self.properties.findOne(query,function(err,data) {
    console.log('find ' + query + err?'failed':'successed');
    return data;
  });
};



