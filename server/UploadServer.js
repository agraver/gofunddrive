
if (Meteor.isServer) {
  Meteor.startup(function () {
    UploadServer.init({
      tmpDir: process.env.PWD + '/public/uploads',
      uploadDir: process.env.PWD + '/public/uploads',
      checkCreateDirectories: true,
      uploadUrl: '/upload',
      // *** For renaming files on server
      getFileName: function(file, formData) {
        return new Date().getTime() + '-' + Math.floor((Math.random() * 10000) + 1) + '-' + file.name;
        // we get this value in the ajax response
      },
      // getDirectory: function(fileInfo, formData) {
      //   // create a sub-directory in the uploadDir based on the content type (e.g. 'images')
      //   return formData.contentType;
      // },
      // finished: function(fileInfo, formFields) {
      //   // perform a disk operation
      // },
      cacheTime: 100,
      mimeTypes: {
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif"
      },
      imageVersions: {
        big: {
          width: 800, height: 600
        },
        thumbnailBig: {
          width: 400, height: 300
        },
        thumbnailSmall: {
          width: 200, height: 100
        }
      }
    });
  });
}
