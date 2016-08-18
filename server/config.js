Meteor.startup(function () {
  smtp = {
    username: 'anton@britishdeluxe.ee',   // eg: server@gentlenode.com
    password: 'AssisT565',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.britishdeluxe.ee',  // eg: mail.gandi.net
    port: 587
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

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

Invites.config({
  from: "GoodsFundDriver Beta <beta@goodsfunddriver.com>",
  inviteRequest: {
    subject: "GoodsFundDriver Beta invitation",
    body: "Thanks for your interest in GoodsFundDrive! We'll let you know when you've been invited."
  },
  invite: {
    subject: "Welcome to GoodsFundDriver",
    body: "Thanks for your interest in GoodsFundDriver!"
  }
});

function validateToken(token){
	if(InvitesCollection.findOne({"token":token})) return true;
	else return false;
}

function onCreatedAccount(token){
	InvitesCollection.update({"token":token}, {$set:{"status":"claimed"}});
}

AccountsInvite.register({
  validateToken: validateToken,
  onCreatedAccount: onCreatedAccount
});
