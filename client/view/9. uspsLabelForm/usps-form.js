Template.uspsForm.events({
  'submit form': function(event){
    event.preventDefault();
    console.log('Form submitted, mates!');

    var target = event.target;

    var addressForm = {
      'email' : target.email.value,
      'fname' : target.fname.value,
      'lname' : target.lname.value,
      'streetAddr' : target.streetAddr.value,
      'aptSuite' : target.aptSuite.value,
      'city' : target.city.value,
      'state' : target.state.value,
      'zip' : target.zip.value,
      'telnr' : target.telnr.value
    }

    Session.set('personalDetails', addressForm);

    //TODO check that it's the allowed Zone
    Meteor.call("calculate_rates_soap", "Priority", 420, addressForm.zip, function(err, res) {
      if(res){
        console.log(res);
      } else {
        console.log(err);
      }
    });

    // Router.go('drive.packTheBox', {slug: Router.current().params.slug})
  }
});


Template.uspsForm.onCreated(function(){
    console.log("The 'uspsForm' template was just created.");
});

Template.uspsForm.onRendered(function(){
    console.log("The 'uspsForm' template was just rendered.");
    $('#uspsForm').validate();
});

Template.uspsForm.onDestroyed(function(){
    console.log("The 'uspsForm' template was just destroyed.");
});
