var uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);

// send an image URL to Cloudinary and get a URL in return
var uploadImageFromURL = function (imageUrl, drive_id) {
  try {
    var result = uploadSync(imageUrl, function(res){
      console.log(res);
      Drives.upsert({_id: drive_id},{$set:{image:res}});
      return res;
    });
    return result;
  } catch (error) {
    console.log("// Cloudinary upload failed for URL: "+imageUrl);
    console.log(error.stack);
  }
}

Meteor.methods({
  upload_by_url: function(imgUrl, drive_id) {
    var result = uploadImageFromURL(imgUrl, drive_id);
    console.log('hey man')
    console.log(result)
  }
});
