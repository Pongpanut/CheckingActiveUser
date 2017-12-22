import google from 'googleapis';
import key from 'SCBConnect-6fa1aded75c3.json';
var opn = require('opn');
const VIEW_ID = 'ga:139822590';

let jwtClient = new google.auth.JWT(
    key.client_email, null, key.private_key,
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
      console.log(currentActiveUser);
      if(currentActiveUser > 200){
        console.log('Current active user more than 200');
        opn('hhttp://www.scb.co.th/th/home').then(function(cp) {
          console.log('opened');
        }).catch(function(err) {
          console.error(err);
        });
        process.exit();
      }
      else{
        console.log('Current active user less than 200');
        opn('http://www.scb.co.th/scbconnect/index.html').then(function(cp) {
          console.log('opened');
        }).catch(function(err) {
          console.error(err);
        });
        process.exit();
      }
    });  
  }
  