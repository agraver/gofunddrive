var uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);

// Production
// var labelServerUrl = "https://LabelServer.Endicia.com/LabelService/EwsLabelService.asmx?WSDL";
// var requesterId = "AaronRobbins";
// var accountId = "1128083";
// var passPhrase = "ANTONISANOHIK";

// Test environment
var labelServerUrl = "https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx?WSDL";
var requesterId = "test_anton";
var accountId = "2508593";
var passPhrase = "CneltyN18,cdj,jlf";

// send an image URL to Cloudinary and get a URL in return
var uploadImageFromURL = function (imageUrl, drive_id) {
  try {
    var result = uploadSync(imageUrl, function(res){
      console.log(res);
      Drives.upsert({_id: drive_id},{$set:{image:res}});
      return res;
    });
    return result;
  } catch (error) {
    console.log("// Cloudinary upload failed for URL: "+imageUrl);
    console.log(error.stack);
  }
}

Meteor.methods({
  upload_by_url: function(imgUrl, drive_id) {
    var result = uploadImageFromURL(imgUrl, drive_id);
    console.log('hey man')
    console.log(result)
  },
  check_pickup_availability_soap: function(params) {
    var person = params.person;
    var args = {
      "PackagePickupAvailabilityRequest" : {
        "RequesterID": requesterId,
        "RequestID": "Pickup Availability Request",
        "CertifiedIntermediary": {
          "AccountID": accountId,
          "PassPhrase": passPhrase
        },
        "UseAddressOnFile": "NO",
        "PhysicalPickupAddress": {
          "FirstName": person.fname,
          "LastName": person.lname,
          "Address": person.streetAddr,
          "SuiteOrApt": person.aptSuite,
          "City": person.city,
          "State": person.state,
          "Zip5": person.zip5,
          "Zip4": person.zip4
        }
      }
    };

    try {
      var client = Soap.createClient(labelServerUrl);
      var services = client.describe();
      // console.log(services.EwsLabelService.EwsLabelServiceSoap.GetPostageLabel)
      var result = client.GetPackagePickupAvailability(args);
      // console.log(result);
      return result;
    }
    catch (err) {
        if(err.error === 'soap-creation') {
          console.log('SOAP Client creation failed');
          return {
            result: 'SOAP Client creation failed'
          };
        }
        else if (err.error === 'soap-method') {
          console.log(err)
          console.log('SOAP Method call failed');
          return {
            result: 'SOAP Method call failed'
          };
        }
        else {
          console.log(err);
        }
    }
  },
  schedule_pickup_soap: function(params) {
    var person = params.person;
    var parcel = params.parcel;

    console.log(person);
    console.log(parcel);

    if (typeof parcel.specialInstructions == 'undefined') {
      parcel.specialInstructions = "";
    }
    if (typeof person.zip4 == 'undefined') {
      person.zip4 = "";
    }
    if (typeof person.aptSuite == 'undefined') {
      person.aptSuite = "";
    }
    var args = {
      "PackagePickupRequest" : {
        "RequesterID": requesterId,
        "RequestID": "Pickup Request",
        "CertifiedIntermediary": {
          "AccountID": accountId,
          "PassPhrase": passPhrase
        },
        "UseAddressOnFile": "NO",
        "PhysicalPickupAddress": {
          "FirstName": person.fname,
          "LastName": person.lname,
          "Address": person.streetAddr,
          "SuiteOrApt": person.aptSuite,
          "City": person.city,
          "State": person.state,
          "Zip5": person.zip5,
          "Zip4": person.zip4,
          "Phone": person.telnr,
          "CostCenter": "",

        },
        "PriorityMailCount": 1,
        "EstimatedWeightLb": parseFloat('' + parcel.weightOz / 16),
        "PackageLocation": parcel.packageLocation,
        "SpecialInstructions": parcel.specialInstructions
      }
    };
    console.log(args);

    try {
      var client = Soap.createClient(labelServerUrl);
      var services = client.describe();
      // console.log(services.EwsLabelService.EwsLabelServiceSoap.GetPackagePickup)
      var result = client.GetPackagePickup(args);
      // console.log(result);
      return result;
    }
    catch (err) {
        if(err.error === 'soap-creation') {
          console.log('SOAP Client creation failed');
          return {
            result: 'SOAP Client creation failed'
          };
        }
        else if (err.error === 'soap-method') {
          console.log(err)
          console.log('SOAP Method call failed');
          return {
            result: 'SOAP Method call failed'
          };
        }
        else {
          console.log(err);
        }
    }
  },
  calculate_priority_rates_soap: function(weightOz, fromPostalCode) {
    var args = {
      "PostageRateRequest" : {
        "MailClass": "Priority",
        "MailpieceShape": "Parcel",
        "WeightOz": weightOz,
        "RequesterID": requesterId,
        "CertifiedIntermediary": {
          "AccountID": accountId,
          "PassPhrase": passPhrase
        },
        "FromPostalCode": fromPostalCode,
        "ToPostalCode": 22150
      }
    };

    try {
      var client = Soap.createClient(labelServerUrl);
      var services = client.describe();
      // console.log(services.EwsLabelService.EwsLabelServiceSoap.GetPostageLabel)
      var result = client.CalculatePostageRate(args);
      // console.log(result);
      return result;
    }
    catch (err) {
        if(err.error === 'soap-creation') {
          console.log('SOAP Client creation failed');
          return {
            result: 'SOAP Client creation failed'
          };
        }
        else if (err.error === 'soap-method') {
          console.log(err)
          console.log('SOAP Method call failed');
          return {
            result: 'SOAP Method call failed'
          };
        }
        else {
          console.log(err);
        }
    }
  },
  generate_priority_label_soap: function(params) {
    var parcel = params.parcel;
    var person = params.person;
    var args = {
     "LabelRequest" : {
       attributes: {
         "Test": "YES",
         "ImageFormat": "PDF",
         "LabelSize" : "4x6"
       },
       "MailpieceShape": 'Parcel',
       "MailClass": 'Priority',
       "WeightOz": parcel.weightOz,
       "RequesterID": requesterId,
       "AccountID": accountId,
       "PassPhrase": passPhrase,
       "ReplyPostage": "TRUE",
       "ShowReturnAddress": "TRUE",
       "Stealth": "TRUE",
       "ValidateAddress": "TRUE",
       "ContentsType": "ReturnedGoods",
       "RubberStamp1": "Drive Name",
       "RubberStamp2": "Drive ####",
       "RubberStamp3": "www.goodsFundDriver.com",
       "PrintScanBasedPaymentLabel": "FALSE",
       "FromCompany": "R E APPAREL",
       "ReturnAddress1": "7311 Highland St",
       "ReturnAddress2": "Door 1",
       "FromCity": "Washington",
       "FromState": "VA",
       "FromPostalCode": "22150",
       "ToName": person.fname + " " + person.lname,
       "ToAddress1": person.streetAddr,
       "ToAddress2": person.aptSuite,
       "ToCity": person.city,
       "ToState": person.state,
       "ToPostalCode": person.zip5,
       "ToPhone": person.telnr,
       "PartnerCustomerID": '?',
       "PartnerTransactionID": '?'
    }
  };

    try {
      var client = Soap.createClient(labelServerUrl);
      var services = client.describe();
      // console.log(services.EwsLabelService.EwsLabelServiceSoap.GetPostageLabel)
      var result = client.GetPostageLabel(args);
      // console.log(result);
      return result
    }
    catch (err) {
        if(err.error === 'soap-creation') {
          console.log('SOAP Client creation failed');
          return {
            result: 'SOAP Client creation failed'
          };
        }
        else if (err.error === 'soap-method') {
          console.log(err)
          console.log('SOAP Method call failed');
          return {
            result: 'SOAP Method call failed'
          };
        }
        else {
          console.log(err);
        }
    }
  },
  test_soap_request: function() {
    var args = {
     "LabelRequest" : {
       attributes: {
         "Test": "YES",
         "ImageFormat": "PDF",
         "LabelSize" : "4x6"
       },
       "MailpieceShape": "Parcel",
       "MailClass": "Priority",
       "WeightOz": "260",
       "RequesterID": requesterId,
       "AccountID": accountId,
       "PassPhrase": passPhrase,
       "ReplyPostage": "TRUE",
       "ShowReturnAddress": "TRUE",
       "Stealth": "TRUE",
       "ValidateAddress": "TRUE",
       "ContentsType": "ReturnedGoods",
       "PrintScanBasedPaymentLabel": "FALSE",
       "FromCompany": "R E APPAREL",
       "ReturnAddress1": "7311 Highland St",
       "ReturnAddress2": "Door 1",
       "FromCity": "Washington",
       "FromState": "VA",
       "FromPostalCode": "22150",
       "ToName": "Jason Mehta",
       "ToAddress1": "811 4th st NW",
       "ToAddress2": "1017",
       "ToCity": "Washington",
       "ToState": "DC",
       "ToPostalCode": "20001",
       "ToPhone": "2026396867",
       "PartnerCustomerID": '?',
       "PartnerTransactionID": '?'
    }
  };

    try {
      var client = Soap.createClient(labelServerUrl);
      var services = client.describe();
      // console.log(services.EwsLabelService.EwsLabelServiceSoap.GetPostageLabel)
      var result = client.GetPostageLabel(args);
      // console.log(result);
      return result
    }
    catch (err) {
        if(err.error === 'soap-creation') {
          console.log('SOAP Client creation failed');
          return {
            result: 'SOAP Client creation failed'
          };
        }
        else if (err.error === 'soap-method') {
          console.log(err)
          console.log('SOAP Method call failed');
          return {
            result: 'SOAP Method call failed'
          };
        }
        else {
          console.log(err);
        }
    }
  }
});
