Cloudinary.config({
  cloud_name: 'gofunddrive',
  api_key: '997982172839677',
  api_secret: 'XUQbVR-rR7GQt2xuP_LTm7k5rJY'
});

Cloudinary.rules.delete = function() {
  console.log(this.userId);
  console.log(this.public_id);
  return true;
};

Cloudinary.rules.signature = function() {
  console.log(this.options);
  console.log(this.userId);
  return true;
};

Cloudinary.rules.private_resource = function() {
  console.log(this.userId);
  return true;
};

Cloudinary.rules.download_url = function() {
  console.log(this.userId);
  return true;
};
