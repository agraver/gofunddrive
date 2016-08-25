Router.route('acceptInvitation', {
  path: '/acceptInvite/:token',
  waitOn: function(){
    return Meteor.subscribe('invites-status', this.params.token);
  },
  action: function(){
    // check for valid beta token
    var token = this.params.token;
    console.log(InvitesCollection.find().fetch());
    var invite = InvitesCollection.findOne({"token":token});
    if(!invite) this.render('inviteInvalid');
    if(invite.status == "invited"){
      Meteor.call("invitesVisited", token);
      Meteor.loginWithInvite({'inviteToken': token});
      this.render('inviteValid');
    } else if(invite.status == "visited"){
      this.render('inviteValid');
    } else if(invite.status == "claimed"){
      this.render('inviteClaimed');
    } else
      this.render('inviteInvalid');
  }
});

Router.route('labelPDF', {
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

// 'inviteAdmin' template supplied by t3db0t:invites
Router.route('/invites', 'inviteAdmin');
