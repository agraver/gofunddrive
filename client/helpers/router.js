Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('/', function() {
    this.render('home')
  }, {
    name: 'home'
  });

  this.route('/create', {
    name: 'drive.create'
  });

  this.route('labelPDF', {
    path: '/label/:_id',
    where: 'server',
    action: function() {
      var label = Labels.findOne({_id: this.params._id});
      var data = label.pdfBase64;

      var headers = {
        'Content-type':'data:application/pdf'
      }

      this.response.writeHead(200, headers);
      this.response.end(data);

    }

  });


  this.route('/:slug/updateCampaign', {
    name: 'drive.updateCampaign',
    data: function() {
      return Drives.findOne({slug: this.params.slug});
    }
  });

  this.route('usps-label-form');
  this.route('donate-info');
  this.route('summernote-test');
  this.route('zone-not-accepted');
  this.route('applyForBeta');

  this.route('/:slug', function(){
    var params = this.params;
    var slug = params.slug;

    this.render('staticDrive', {
      data: function() {
        return Drives.findOne({'slug':slug});
      }
    });
  }, {
    name: 'drive'
  });

  this.route('/:slug/donate-info', function(){
    this.render('donateInfo')
  }, {
    name: 'drive.donateInfo'
  });

  this.route('/:slug/usps-label-form', function(){
    this.render('uspsLabelForm')
  }, {
    name: 'drive.uspsLabelForm'
  });

  this.route('/:slug/pack-the-box', function() {
    this.render('packTheBox');
  }, {
    name: 'drive.packTheBox'
  });

  this.route('/:slug/schedule-pickup', function() {
    this.render('schedulePickup');
  }, {
    name: 'drive.schedulePickup'
  });

});

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    Router.go('home');
  } else {
    this.next();
  }
};

Router.onBeforeAction(goToDashboard, {only: ['inviteValid']});


Router.onBeforeAction(function() {
  BodyClass.run();
  this.next();
});

Router.onStop(function() {
  BodyClass.cleanup();
});
