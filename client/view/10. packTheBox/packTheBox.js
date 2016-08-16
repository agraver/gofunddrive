Template.packTheBox.events({
  'submit form': function(event){
    event.preventDefault();


    // Disable the form submit button
    $('#boxWeightForm').find('button[type="submit"]').attr('disabled','disabled');



    // extract parcel weight from the form
    var target = event.target;
    var weightLbs = target.weightLbs.value;
    // add 20% weight just in case

    function increaseWeight(multiplier, weight) {
      const maxWeight = 70;
      const minWeight = 0;
      if(weight > minWeight && weight<(maxWeight/multiplier)) {
        return weight * multiplier;
      } else if (weight >= (maxWeight/multiplier) && weight <= maxWeight) {
        return maxWeight;
      } else if (weight > maxWeight || weight <= minWeight) {
        alert('invalid weightLbs values');
        return;
      }
    }


    // transform weight units from lbs to oz
    var weightOz = weightLbs * 16;
    var increasedWeightOz = increaseWeight(1.2, weightLbs) * 16;
    var parcel = Session.get('parcel');
    parcel.weightOz = increasedWeightOz;
    Session.set('parcel', parcel);


    var zip = Session.get('personalDetails').zip;
    Meteor.call('calculate_priority_rates_soap', increasedWeightOz, zip, function(err, res) {
      if(res){
        // console.log(res);
        var rate = res.PostageRateResponse.Postage[0].Rate;
        Session.set('increasedPriorityRate', rate);
      } else {
        console.log(err);
      }
    });
    // calculate how much would the package cost without the additional 20%
    Meteor.call('calculate_priority_rates_soap', weightOz, zip, function(err, res) {
      if(res){
        // console.log(res);
        var rate = res.PostageRateResponse.Postage[0].Rate;
        Session.set('priorityRate', rate);
      } else {
        console.log(err);
      }
    });


    // Request Label
    var person = Session.get('personalDetails');
    var labelRequested = Session.get('labelRequested');

    if (typeof person != 'undefined' && !labelRequested) {
      var params = {
        'person': person,
        'parcel': parcel
      };
      Meteor.call("generate_priority_label_soap", params, function(err, res) {
        if(res){
          console.log(res);
          var pdfBase64 = res.LabelRequestResponse.Base64LabelImage;
          window.open("data:application/pdf;base64, " + pdfBase64);
        } else {
          console.log(err);
        }
      });
      Session.set('labelRequested', true);
    }

  }
});



Template.packTheBox.onRendered(function(){
    var instance = this;

    var parcel = Session.get('parcel');
    if (typeof parcel == 'undefined') {
      var parcel = {
        'mailpieceShape': 'Parcel',
        'weightOz' : undefined,
        'mailClass' : 'Priority'
      }
      Session.set('parcel', parcel);
    }

    instance.autorun(function() {
      var increasedPriorityRate = parseFloat(Session.get('increasedPriorityRate'));
      var priorityRate = parseFloat(Session.get('priorityRate'));

      if (increasedPriorityRate && priorityRate) {
        var increasedCost = increasedPriorityRate - priorityRate;
        Session.set('increasedCost', increasedCost);
      }

    });

    $('#boxWeightForm').validate({
      rules: {
        weightLbs: {
          required: true,
          min: 5,
          max: 70
        },
        confirmDimensions: {
          required: true
        }
      },
      messages: {
          weightLbs: {
            min: "Parcel is too light",
            max: "Parcel is too heavy"
          },
          confirmDimensions: {
              required: "Please confirm weight and dimensions!"
          }
      }
    });
});
