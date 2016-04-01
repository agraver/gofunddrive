Template.donateBox.events({
  'click .btn-donate': function () {
    Router.go('drive.donateInfo', {slug: Router.current().params.slug})
  }
});

Template.staticDrive.helpers({
  drive: function() {
    return Drives.findOne({"slug": this.slug});
  }
});
