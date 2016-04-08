Template.registerHelper("showMoreUpdates", function(){
  return Session.get('showMoreUpdates');
});

Template.staticDrive.onCreated(function(){
  var subHandle = this.subscribe('driveBySlug', Router.current().params.slug);
  Session.set('showMoreUpdates', false);
});

// Template.staticDrive.onRendered(function(){
//   var self = this;
//   this.autorun(function(){
//     var subHandle = self.subscribe('driveBySlug', Router.current().params.slug);
//     if(subHandle.ready()){}
//   });
// });

Template.staticDrive.onDestroyed(function() {
  Session.set('showMoreUpdates', false);
});

Template.staticDrive.events({
  'click .showMoreUpdates': function () {
    Session.set('showMoreUpdates', true);
  }
})

Template.staticDrive.helpers({
  drive: function() {
    return Drives.findOne({"slug": this.slug});
  },
  updates: function() {
    var updates = this.updates;
    var oldestToNewest = updates.sort(function(a,b){
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    var indexed = oldestToNewest.map(function(update, index) {
      update.index = index + 1;
      return update;
    });

    var indexedNewestToOldest = updates.sort(function(a,b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    })

    return indexedNewestToOldest;
  },
  latestUpdate: function() {
    if(this.updates===undefined){
      return;
    }
    var updates = this.updates;
    var newestToOldest = updates.sort(function(a,b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    var latest = newestToOldest[0];
    latest.index = updates.length;

    if(latest.index == 1) {
      // get rid of the "show more" button
      Session.set('showMoreUpdates', true);
    }
    return latest;
  },
  invokeAfterLoad: function() {
    Meteor.defer(function () {
      $('.note-video-clip').parent().addClass('embed-responsive embed-responsive-16by9');
      $('.note-video-clip').addClass('embed-responsive-item');
      $('img').addClass('img-responsive');
    });
  }
});

Template.donateBox.events({
  'click .btn-donate': function () {
    Router.go('drive.donateInfo', {slug: Router.current().params.slug})
  }
});

Template.editSave.events({
  'click .btn-edit': function () {
    // Router.go('drive.updateCampaign', {slug: this.slug});
    $('.click2edit').summernote({focus: true});
  },
  'click .btn-save': function() {
    var markup = $('.click2edit').summernote('code');
    $('.click2edit').summernote('destroy');
    $('.click2edit').html("");
    // console.log(this._id);
    Drives.upsert({_id: this._id},{$set:{campaign: markup}});
  }
  // 'click .btn': function () {
  //   Router.go('drive.updateCampaign', {slug: this.slug});
  // }
});

Template.newUpdate.events({
  'click .btn-newUpdate': function() {
    $('#newUpdate').summernote({focus: true, height: 300});
  },
  'click .btn-saveUpdate': function() {
    var markup = $('#newUpdate').summernote('code');
    var update = {
      createdAt: new Date(),
      content: markup
    }
    Drives.update({_id:this._id},{$push:{updates: update}});
    $('#newUpdate').summernote('destroy');
    $('#newUpdate').html("");
    // remove html
    // update reactive calculation #latestUpdate
    // render an update
  }
});
