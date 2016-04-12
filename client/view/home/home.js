
Template.home.onCreated(function() {
    this.subscribe('drives');
});

Template.home.helpers({
  drives: function() {
    return Drives.find().fetch();
  },
});

Template.home.events({
  'click .btn': function () {
    Router.go('drive.create')
  }
});

Template.driveLink.helpers({
  getData: {
    slug: this.slug
  },
  thumbnailUrl: function() {

    console.log("im here")

    var drive = Drives.findOne({_id: this._id});
    var image = drive.image;

    console.log(drive);
    console.log(image);

    if(!image){
      return "http://placehold.it/240x160";
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
      transformUrl += ",c_crop/w_230/";
      var result = baseUrl + transformUrl + image.public_id;
      return result;
    } else {
        var baseUrl = "http://res.cloudinary.com/gofunddrive/image/upload/";
        var transformUrl = "w_646,h_400,g_center,c_fill/w_230/"
        var public_id = image.public_id;
        return baseUrl + transformUrl + public_id;
    }
  }
});
