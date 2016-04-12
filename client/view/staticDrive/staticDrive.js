picture = undefined

Template.registerHelper("showMoreUpdates", function(){
  return Session.get('showMoreUpdates');
});

Template.staticDrive.onCreated(function(){
  var subHandle = this.subscribe('driveBySlug', Router.current().params.slug);
  Session.set('showMoreUpdates', false);
  Session.set('cropping', false);
});

Template.staticDrive.onRendered(function(){ });

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
  'load #cropMainImg': function(){
    picture = $("#cropMainImg");
    picture.guillotine({width: 646, height: 400});
    picture.guillotine('fit');
  },
  'click .showMoreUpdates': function () {
    Session.set('showMoreUpdates', true);
  },
})

Template.cropControls.events({
  'click #rotate_left': function() {
    picture.guillotine('rotateLeft');
  },
  'click #rotate_right': function() {
    picture.guillotine('rotateRight');
  },
  'click #fit': function() {
    picture.guillotine('fit');
  },
  'click #zoom_in': function() {
    picture.guillotine('zoomIn');
  },
  'click #zoom_out': function() {
    picture.guillotine('zoomOut');
  },
  'click #save_crop': function() {
    var data = picture.guillotine('getData');
    Drives.upsert({_id:this._id},{$set:{"image.crop": data}});
    picture.guillotine('remove');
    Session.set('cropping', false);
  },
});

Template.staticDrive.helpers({
  mainImgUrl: function(){
    var drive = Drives.findOne();
    var image = drive.image;

    if(!image){
      return "http://placehold.it/646x400";
    }

    if (image && image.crop) {
      var params = image.crop;
      var baseUrl = "http://res.cloudinary.com/gofunddrive/image/upload/"
      var scale = params.scale;
      var transformUrl = "";
      var roundedScale = (Math.round(scale * 100 + 0.5))/100;
      if (scale != 1 || roundedScale != 1) {
        transformUrl = "w_" + roundedScale + "/";
      }
      transformUrl += "x_" + params.x + ",y_" + params.y;
      transformUrl += ",w_" + params.w + ",h_"+params.h;
      transformUrl += ",c_crop/";
      var result = baseUrl + transformUrl + image.public_id;
      return result;
    } else {
        var baseUrl = "http://res.cloudinary.com/gofunddrive/image/upload/";
        var transformUrl = "w_646,h_400,g_center,c_fill/"
        var public_id = image.public_id;
        return baseUrl + transformUrl + public_id;
    }
  },
  cropping: function(){
    return Session.get('cropping');
  },
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

Template.changePic.onRendered(function(){
  // $("input.upload").fileinput({showCaption: false});
});

Template.changePic.events({
  'change input.upload': function(e) {
    var driveId = this._id;
    var files;
    files = e.currentTarget.files;
    console.log(files);
    Cloudinary.upload(files, {}, function(err, res) {
      if(!err) {
        console.log("Upload Result:");
        console.log(res);
        Drives.upsert({_id: driveId},{$set:{image: res}});
        Session.set("cropping", true);
      } else {
        console.log("Upload Error:");
        console.log(err);
      }
    });
  },
  'click .btn-url': function() {
    var input_url = prompt("image URL");
    // var imgUrl = "http://res.cloudinary.com/gofunddrive/image/fetch/" + input_url
    if(input_url){

      if(picture) {
        picture.guillotine('remove');
      }

      Meteor.call('upload_by_url', input_url, this._id, function(err, res){
        console.log('ayy inside callback!!')
        if(!err) {
          console.log('ayyy no err in upload by url callback')
          Session.set("cropping", true);
        }
      });
    }
  }
});
