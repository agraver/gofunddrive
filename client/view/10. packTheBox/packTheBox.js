Template.packTheBox.events({
  'submit form': function(event){
    event.preventDefault();
    console.log('Weight form submitted, mates!');
    $('#boxWeightForm').find('button[type="submit"]').attr('disabled','disabled');

    var target = event.target;

    var weightLbs = target.weightLbs.value;

    if(weightLbs > 0 && weightLbs<(70/1.2)) {
      weightLbs *= 1.2
    } else {
      alert('error with weightLbs');
    }

    var weightOz = weightLbs * 16;




    var zip = Session.get('personalDetails').zip;

    var parcel = Session.get('parcel');
    parcel.weightOz = weightOz;
    Session.set('parcel', parcel);

    Meteor.call('calculate_priority_rates_soap', weightOz, zip, function(err, res) {
      if(res){
        // console.log(res);
        var rate = res.PostageRateResponse.Postage[0].Rate;
        Session.set('priorityRate', rate);
      } else {
        console.log(err);
      }
    });

    Meteor.call('calculate_parcel_select_rates_soap', weightOz, zip, function(err, res) {
      if(res){
        // console.log(res);
        var rate = res.PostageRateResponse.Postage[0].Rate;
        Session.set('parcelSelectRate', rate);
      } else {
        console.log(err);
      }
    });

  }
});



Template.packTheBox.onRendered(function(){
    var instance = this;

    var parcel = Session.get('parcel');
    if (typeof parcel == 'undefined') {
      var parcel = {
        'mailpieceShape': 'Parcel',
        'weightOz' : undefined,
        'mailClass' : undefined
      }
      Session.set('parcel', parcel);
    }

    instance.autorun(function() {

      // console.log('autorun triggered')
      // console.log('parcelSelectRate: ' + parcelSelectRate);
      // console.log('priorityRate: ' + priorityRate);

      var labelRequested = Session.get('labelRequested');
      var parcel = Session.get('parcel');
      var parcelSelectRate = Session.get('parcelSelectRate');
      var priorityRate = Session.get('priorityRate');

      if (typeof parcelSelectRate != 'undefined' && typeof priorityRate != 'undefined') {
        console.log('we have both rates now!')
        var mailClass;
        if(typeof parcel.mailClass == 'undefined') {
          if(parcelSelectRate < priorityRate) {
            console.log('parcelSelect is cheaper! cost: ' + parcelSelectRate + ' (vs PriorityRate ' + priorityRate+ ')');
            mailClass = 'ParcelSelect';
          } else {
            console.log('choosing Priority! cost: ' + priorityRate + ' (vs ParcelSelect ' + parcelSelectRate + ')');
            mailClass = 'Priority';
          }
          parcel.mailClass = mailClass;
          Session.set('parcel', parcel);
        }
      }

      if (typeof parcel.weightOz != 'undefined' && typeof parcel.mailClass != 'undefined') {
        console.log('got to the final step');
        var person = Session.get('personalDetails');
        if (typeof person != 'undefined' && !labelRequested) {
          // Generate PDF label

          Session.set('labelRequested', true);
          var params = {
            'person': person,
            'parcel': parcel
          };

          console.log(params);

          // TODO check if PDF has already been generated
          if (params.parcel.mailClass == 'Priority') {
            Meteor.call("generate_priority_label_soap", params, function(err, res) {
              if(res){
                console.log(res);
                var pdfBase64 = res.LabelRequestResponse.Base64LabelImage;
                window.open("data:application/pdf;base64, " + pdfBase64);
              } else {
                console.log(err);
              }
            });
          } else {
            Meteor.call("generate_parcel_select_label_soap", params, function(err, res) {
              if(res){
                var pdfBase64 = res.LabelRequestResponse.Base64LabelImage;
                window.open("data:application/pdf;base64, " + pdfBase64, "_self");
              } else {
                console.log(err);
              }
            });
          }

        }
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
