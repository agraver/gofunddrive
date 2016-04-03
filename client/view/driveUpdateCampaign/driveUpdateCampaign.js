Template.driveUpdateCampaign.onRendered(function(){
  var self = this;

  self.autorun(function(){

    var slug = Router.current().params.slug
    var drivesHandle = Meteor.subscribe('driveBySlug', slug);

    if (drivesHandle.ready()) {
      console.log(this._id);
      var drive = Drives.findOne({slug: slug});
      var campaign = drive.campaign;

      $('#summernote').html(campaign);

      $('#summernote').summernote({
        airMode: false,
        // placeholder: 'type your campaign here',
      });

    }
  });
});

Template.driveUpdateCampaign.helpers({

});

Template.driveUpdateCampaign.events({
  'click .btn-save': function(e) {
    e.preventDefault();
    var markup = $('#summernote').summernote('code');
    Drives.upsert({_id: this._id},{$set:{campaign: markup}});
    // $('#summernote').summernote('destroy');
    Router.go('drive', this);
  }
});
