// exports.handler = function(event, context) {
//     console.log("Hello, Cloudwatch!");
//     context.succeed("Hello, World!");
//    };

var opn = require('opn');
var google = require('googleapis');
const VIEW_ID = 'ga:139822590';
var private_key = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC48/u7pUujCPTT\nwm4ujHk2wubJTSq+O1tZnft2Fom5zHiLp+Z6wRGvpV8TKACL7/YuorcbYYhleexC\nrX2Q36KdRh6hYrdAFFisKGNEhX5H9C1sHzVAT7wVguJGk380MC8UJ9sEyW22kvhO\nR5y1MZX79QKwJpApxjbybFQgAANuNSZdjz1bIdq7KcPO3gFrEzJS8Yn7rItIKRde\nzg+mQ62W0sQ0bRYazuJbKh7j6zqKVSywm6X25NoQtfIe5R5nit+45WM4oGen1Akq\n+2g/2ZMQAXWqFgygdZ3OnV4O4i17f8xi1M6u04t/kKWfOOf20BMf6hEbJJlKa5H0\nKA6nwcPpAgMBAAECggEAKePc2rnMAU+ogAPUB8f6Nkx7kBFhwndYL9qH102wgPwO\nO3daTOhItLMsbv7K7Ob7J8Hj3hg/l9g/CjUYMQVt49g7XMsqfSF+mfOF1EG2Ad8M\noKYK3heRHoAn9ts2XuAg8Zw7T4C90DHGephepm1mLoxmQPZjBYsm685cWWkXXdDZ\n1QMkotvxIKMaOJ/G8wa9QvuYGu6cbAukjpnBmVYCM7IEtwQfTZD+wG2JGrioryyo\nPjRCFltcwMK2GoA+r2wCXj8PZnvxRlNe9ZG1bcVBfPfpti9sxw7H6nCb+ZSqsxuP\n3O18DablmZjwPL/0pOv6Aa8XGIVH/qbYmLz8+Y7xRwKBgQDxovAmb6QVptcBwA8/\nWaRu/9p61guJ1wWOZUT/tYMrrUwK5ksSJTp45FXilu25T+6wvHE74A1hxt3pevjK\n0fGvvmEdgwWGXVaqAxJ1OMTYifJPpwtM5osYYF3+iMEED6IMwdU7vl004ayfR1l1\nBNSz88Rc16iuS+Vb4C36yb8oNwKBgQDD8nmZ+hA2BHYHoHJXQ2SQtegwo7Ko+QhG\naEMHa0Uf5W9dZ/Qvi/2pmwq+LjWKZ/xgOT83qH15phi6Zb49iB3nVxAu0FKcv5MN\n7OgLPgRQYloOVtdEuUbnMqbG0bgOX7qMecPSzRcfxcx4APbAQVlFq6rBxArZU4Su\nPggAJRok3wKBgFMRksGD68LNwmiFoDhFFvRZ3MARyZGva+eSBPBrdBaV0uiEVxZ7\n2egphyUIgd0ND5+OiNbupWsRtMRJVDJVjmK+biB5JHMWr25u8+98fp96fOTJJmdf\ncj4FEwsn9ELzJOCB2k5ZmS1Oz8tJ+gTyjjT2/nB0azbQPJ8jKGto4+BtAoGAFURW\n8GBUrBg120QNxOzamF418jmCJZbJ0CJ2y/JXkUusl521wgdWo7bhJp0LUJdSq/rq\nopbV74MYgfqS+Eiyvi4T4pDXto2QX12MHdRAUZ0rGw1P1fSp/mPf+ApBCMZZD/AT\nUejSjq9ALvIj1eAB2W71XIxzhPzslKDE64cbXE8CgYEAnV1wRqohh6XUQAP+B69x\nZzMTyOZuq0xTPUfo9U0K9CxxkITg8sWIBd7rGCsZ0QdkFW+/c3Rs9TYl4F7pLEJ0\nomSpVS00xG3+Wi58fmFXmjsM549SabLdXY1QStsxiHya/bjVmNubVQIFmkddyUA+\n5jG0Rq7BfKM4Z1Hp2PN1Z5U=\n-----END PRIVATE KEY-----\n';
var client_email = 'app-engine-service-account@scbconnect-1498621196340.iam.gserviceaccount.com';


exports.handler = function (event, context) {
    //context.done(null, 'link-scraper complete.');
    let jwtClient = new google.auth.JWT(
        client_email, null, private_key,
        ['https://www.googleapis.com/auth/analytics.readonly'], null);
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.log(err);
          return;
        }
        let analytics = google.analytics('v3');
        queryData(analytics);
      });

      function queryData(analytics) {
        analytics.data.realtime.get({
          'auth': jwtClient,
          'ids': VIEW_ID,
          'metrics': 'rt:activeUsers',
        }, function (err, response) {
          if (err) {
            console.log(err);
            return;
          }
          let currentActiveUser = response.rows[0];
          console.log("Current sctive user : "+currentActiveUser);
          if(currentActiveUser > 200){
            console.log('Current active user more than 200');
            opn('http://www.scb.co.th/th/home').then(function(cp) {
              console.log('opened');
            }).catch(function(err) { 
              console.error(err);
            });
          }
          else{
            console.log('Current active user less than 200');
            opn('http://www.scb.co.th/scbconnect/index.html').then(function(cp) {
              console.log('opened');
            }).catch(function(err) {
              console.error(err);
            });
          }
          context.done(null, 'executed complete.');
        });  
      }
};