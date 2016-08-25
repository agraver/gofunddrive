Template.schedulePickup.events({
  'submit form': function(event) {
    event.preventDefault();
      $('#schedulePickupForm').find('button[type="submit"]').attr('disabled','disabled');

    var person = Session.get('personalDetails');
    var parcel = Session.get('parcel');

    var target = event.target;
    parcel.packageLocation = target.packageLocation.value;
    parcel.specialInstructions = target.specialInstructions.value;

    Session.set('parcel', parcel);

    var params = {
      person: person,
      parcel: parcel
    };

    Meteor.call('schedule_pickup_soap', params, function(err, res) {
      alert('success')
      if(res){
        var response = res.PackagePickupResponse
        console.log(response)
      } else {
        console.log(err)
      }


      Session.set("finalResponse", response);
      $('#finalResponse').removeClass("hidden");
      $('#finalResponse').addClass("fade in");
    });
  }
})

Template.schedulePickup.helpers({
  getLabel: function() {
    return {"_id":Session.get('labelId')}
  },
  pickupDayOfWeek: function() {
    if (typeof Session.get('finalResponse') == 'undefined') {
      return Session.get('packagePickup').DayOfWeek;
    }
    return Session.get('finalResponse').PackagePickup.DayOfWeek;
  },
  pickupDate: function() {
    if (typeof Session.get('finalResponse') == 'undefined') {
      return Session.get('packagePickup').Date;
    }
    return Session.get('finalResponse').PackagePickup.Date;
  },
  confirmationNumber: function() {
    var finalResponse = Session.get('finalResponse');
    if (typeof finalResponse  != 'undefined'){
      return Session.get('finalResponse').ConfirmationNumber;
    }
  }
})
