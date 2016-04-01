Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('static-drive', {
    path: '/'
  });

  this.route('usps-label-form');

  this.route('donate-info')

});

Router.onBeforeAction(function() {
  BodyClass.run();
  this.next();
});

Router.onStop(function() {
  BodyClass.cleanup();
});
