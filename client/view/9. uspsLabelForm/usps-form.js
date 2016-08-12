Template.uspsForm.events({
  'submit form': function(event){
    event.preventDefault();
    console.log('Form submitted, mates!');
    Session.set('labelRequested', false);
    $('#uspsForm').find('button[type="submit"]').attr('disabled','disabled');
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

    //check that the address is in the allowed Zone
    Meteor.call("calculate_priority_rates_soap", 420, addressForm.zip, function(err, res) {
      if(res){
        // console.log(res);
        var zone = res.PostageRateResponse.Zone;
        console.log(zone);

        if(!zone) {
          // TODO possible error, atm silent log
          console.log(res.PostageRateResponse.ErrorMessage);
        }

        if(parseInt(zone) <= 4) {
          Router.go('drive.packTheBox', {slug: Router.current().params.slug});
        } else {
          Router.go('zone-not-accepted');
        }
      } else {
        console.log(err);
      }
    });
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
