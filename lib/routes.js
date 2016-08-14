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

    if(!invite) this.render('invite-invalid');
    if(invite.status == "invited"){
      Meteor.call("invitesVisited", token);
      Meteor.loginWithInvite(token);
      this.render('invite-valid');
    } else if(invite.status == "visited"){
      this.render('invite-valid');
    } else if(invite.status == "claimed"){
      this.render('invite-claimed');
    } else
      this.render('invite-invalid');
  }
});

// 'inviteAdmin' template supplied by t3db0t:invites
Router.route('/invites', 'inviteAdmin');
