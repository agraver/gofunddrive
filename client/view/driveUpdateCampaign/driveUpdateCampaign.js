Template.driveUpdateCampaign.rendered = function(){
  $(document).ready(function() {
    $('#summernote').summernote({ airMode: false });
  });
};

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
