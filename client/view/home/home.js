
Template.home.onCreated(function() {
    this.subscribe('drives');
});

Template.home.helpers({
  drives: function() {
    return Drives.find().fetch();
  }
});

Template.home.events({
  'click .btn': function () {
    Router.go('drive.create')
  }
});

Template.driveLink.helpers({
  getData: {
    slug: this.slug
  }
});
