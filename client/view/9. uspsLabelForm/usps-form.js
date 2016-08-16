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
        // console.log(zone);

        if(!zone) {
          // TODO possible error, atm silent log
          alert(res.PostageRateResponse.ErrorMessage);
        }

        if(parseInt(zone) <= 4) {
          Session.set('zoneAllowed', true);
        } else {
          // Router.go('zone-not-accepted');
          alert('zone too far away from warehouse')
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
    var instance = this;
    $('#uspsForm').validate();

    this.autorun(function(){
      var personalDetails = Session.get('personalDetails');
      var zoneAllowed = Session.get('zoneAllowed');
      var pickupLocationValid = Session.get('pickupLocationValid');

      if (personalDetails && zoneAllowed) {
        console.log('here mate');
        var params = {person: personalDetails};
        Meteor.call('check_pickup_availability_soap', params, function(err, res){
          if (res){
            // TODO result/error code cases
            console.log(res);
            var response = res.PackagePickupAvailabilityResponse;
            var status = response.Status;

            if(status != 0) {
              $('#uspsForm').find('button[type="submit"]').removeAttr('disabled');
            }

            if(status == 0) {
              //success
              var packagePickup = response.PackagePickup;
              Session.set('packagePickup', packagePickup);
              Session.set('pickupLocationValid', true);
            } else if(status == 16000) {
              var errorMessage = res.PackagePickupAvailabilityResponse.ErrorMessage;
              alert(errorMessage);
            }
          } else {
            console.log(err);
          }
        });
      }

      if (pickupLocationValid) {
        Router.go('drive.packTheBox', {slug: Router.current().params.slug});
      }
    });
});

Template.uspsForm.onDestroyed(function(){
    console.log("The 'uspsForm' template was just destroyed.");
});
