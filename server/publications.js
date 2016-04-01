Meteor.publish('drives', function() {
  return Drives.find();
});
