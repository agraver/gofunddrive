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

// 'inviteAdmin' template supplied by t3db0t:invites
Router.route('/invites', 'inviteAdmin');
