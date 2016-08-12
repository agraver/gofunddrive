var uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);

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
  calculate_priority_rates_soap: function(weightOz, fromPostalCode) {
    var url = "https://LabelServer.Endicia.com/LabelService/EwsLabelService.asmx?WSDL";
    var args = {
      "PostageRateRequest" : {
        "MailClass": "Priority",
        "MailpieceShape": "Parcel",
        "WeightOz": weightOz,
        "RequesterID": "AaronRobbins",
        "CertifiedIntermediary": {
          "AccountID": "1128083",
          "PassPhrase": "ANTONISANOHIK"
        },
        "FromPostalCode": fromPostalCode,
        "ToPostalCode": 22150
      }
    };

    try {
      var client = Soap.createClient(url);
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
  calculate_parcel_select_rates_soap: function(weightOz, fromPostalCode) {
    var url = "https://LabelServer.Endicia.com/LabelService/EwsLabelService.asmx?WSDL";
    var args = {
      "PostageRateRequest" : {
        "MailClass": "ParcelSelect",
        "MailpieceShape": "Parcel",
        "WeightOz": weightOz,
        "RequesterID": "AaronRobbins",
        "CertifiedIntermediary": {
          "AccountID": "1128083",
          "PassPhrase": "ANTONISANOHIK"
        },
        "FromPostalCode": fromPostalCode,
        "ToPostalCode": 22150
      }
    };

    try {
      var client = Soap.createClient(url);
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
    var url = "https://LabelServer.Endicia.com/LabelService/EwsLabelService.asmx?WSDL";
    var parcel = params.parcel;
    var person = params.person;
    var args = {
     "LabelRequest" : {
       attributes: {
         "Test": "NO",
         "ImageFormat": "PDF",
         "LabelSize" : "4x6"
       },
       "MailpieceShape": 'Parcel',
       "MailClass": 'Priority',
       "WeightOz": parcel.weightOz,
       "RequesterID": "AaronRobbins",
       "AccountID": "1128083",
       "PassPhrase": "ANTONISANOHIK",
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
       "ToPostalCode": person.zip,
       "ToPhone": person.telnr,
       "PartnerCustomerID": '?',
       "PartnerTransactionID": '?'
    }
  };

    try {
      var client = Soap.createClient(url);
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
  generate_parcel_select_label_soap: function(params) {
    var url = "https://LabelServer.Endicia.com/LabelService/EwsLabelService.asmx?WSDL";
    var parcel = params.parcel;
    var person = params.person;
    var args = {
     "LabelRequest" : {
       attributes: {
         "Test": "NO",
         "ImageFormat": "PDF",
         "LabelSize" : "4x6"
       },
       "MailpieceShape": 'Parcel',
       "MailClass": 'ParcelSelect',
       "WeightOz": parcel.weightOz,
       "SortType": 'Nonpresorted',
       "EntryFacility": 'Other',
       "RequesterID": "AaronRobbins",
       "AccountID": "1128083",
       "PassPhrase": "ANTONISANOHIK",
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
       "ToPostalCode": person.zip,
       "ToPhone": person.telnr,
       "PartnerCustomerID": '?',
       "PartnerTransactionID": '?'
    }
  };

    try {
      var client = Soap.createClient(url);
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
    var url = "https://LabelServer.Endicia.com/LabelService/EwsLabelService.asmx?WSDL";
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
       "RequesterID": "AaronRobbins",
       "AccountID": "1128083",
       "PassPhrase": "ANTONISANOHIK",
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
      var client = Soap.createClient(url);
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
