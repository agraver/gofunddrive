Template.applyForBeta.events({
  'submit form': function(event){
    event.preventDefault();
    var target = event.target;
    var email = target.email.value;
    // console.log(email);
    Meteor.call("invitesRequest", email, true, function(err, res) {
      if (res) {
        console.log(res);
      } else {
        console.log(err);
      }
    });
    alert('Invitation Request successful');
    Router.go('/');
  }
});
