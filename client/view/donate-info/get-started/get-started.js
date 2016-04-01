Template.getStarted.events({
  'click .btn': function () {
    Router.go('drive.uspsLabelForm', {slug: Router.current().params.slug})
  }
});
