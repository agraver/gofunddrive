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
  calculate_rates_soap: function(mailClass, weightOz, fromPostalCode) {
    var url = "https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx?WSDL";
    var args = {
      "PostageRateRequest" : {
        "MailClass": mailClass,
        "MailpieceShape": "Parcel",
        "WeightOz": weightOz,
        "CertifiedIntermediary": {
          "AccountID": "2508593",
          "PassPhrase": "CneltyN18,cdj,jlf"
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
  test_soap_request: function() {
    var url = "https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx?WSDL";
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
       "RequesterID": "test_anton",
       "AccountID": "2508593",
       "PassPhrase": "CneltyN18,cdj,jlf",
       "ReplyPostage": "TRUE",
       "ShowReturnAddress": "TRUE",
       "Stealth": "TRUE",
       "ValidateAddress": "TRUE",
       "ContentsType": "ReturnedGoods",
       "PrintScanBasedPaymentLabel": "FALSE",
       "FromCompany": "A E APPAREL",
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
