Template.summernoteTest.onCreated(function(){
  var imagesHandle = Meteor.subscribe('images');
  //
  //
  // var url = "http://res.cloudinary.com/demo/image/upload/w_200/lady.jpg"
  // canvas = document.createElement('canvas');
  // context = canvas.getContext('2d');
  // make_base(url);
  // var img = canvas.toDataURL("image/jpg");
  // if (canvas.toBlob) {
  //   canvas.toBlob(
  //     function(blob) {
  //       console.log(blob);
  //       var files = [];
  //       files.push(blob);
  //       Cloudinary.upload(files, {}, function(err, res) {
  //         if(!err) {
  //           console.log("Upload Result:");
  //           console.log(res);
  //           Images.insert(res);
  //         } else {
  //           console.log("Upload Error:");
  //           console.log(err);
  //         }
  //       });
  //     }, "image/jpeg"
  //   )
  // }
  // console.log(img);
  //
  // function make_base(url){
  //   base_image = new Image();
  //   base_image.src = url;
  //   var width = base_image.naturalWidth; // this will be 300
  //   var height = base_image.naturalHeight; // this will be 400
  //   console.log(width + ' ' + height);
  //   base_image.onload = function(){
  //     context.drawImage(base_image, 0, 0, width, height);
  //   }
  // }
  // // /* ... your canvas manipulations ... */
  // // if (canvas.toBlob) {
  // //     canvas.toBlob(
  // //         function (blob) {
  // //             // Do something with the blob object,
  // //             // e.g. creating a multipart form for file uploads:
  // //             var formData = new FormData();
  // //             formData.append('file', blob, fileName);
  // //             /* ... */
  // //         },
  // //         'image/jpeg'
  // //     );
  // // }
});

$.cloudinary.config({
  cloud_name: 'gofunddrive',
  api_key: '997982172839677'
});

Template.summernoteTest.events({
  "change input.file_bag": function(e) {
    var files;
    files = e.currentTarget.files;
    console.log(files);
    Cloudinary.upload(files, {}, function(err, res) {
      if(!err) {
        console.log("Upload Result:");
        console.log(res);
        Images.insert(res);
      } else {
        console.log("Upload Error:");
        console.log(err);
      }
    });
  },
  // "click button.delete": function() {
  //   Cloudinary.delete(this.public_id, function(err, res) {
  //     if(!err) {
  //       console.log("Upload Result:");
  //       console.log(res);
  //     } else {
  //       console.log("Upload Error:");
  //       console.log(err);
  //     }
  //   });
  // },
  "click button.delete_private": function() {
    Cloudinary.delete(this.public_id, "private", function(err, res) {
      if(!err) {
        console.log("Delete Result:");
        console.log(res);
        Images.remove({public_id: this.public_id});
      } else {
        console.log("Delete Error:");
        console.log(err);
      }
    });
  }
});

Template.summernoteTest.helpers({
  "files": function() {
    return Cloudinary.collection.find();
  },
  "uploaded_images": function() {
    return Images.find();
  },
  "complete": function() {
    return this.status === "complete";
  }
});
