Template.driveCreate.events({
  'submit form': function(e) {
    e.preventDefault();

    var drive = {
      slug: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      // message: $(e.target).find('[name=message]').val()
    }

    drive._id = Drives.insert(drive);
    Router.go('drive.updateCampaign', drive);
  }
});
