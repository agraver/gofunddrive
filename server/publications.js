Meteor.publish('drives', function() {
  return Drives.find();
});

Meteor.publish('driveBySlug', function(slug) {
  return Drives.find({slug: slug});
})
