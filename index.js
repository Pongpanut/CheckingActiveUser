var http	= require("http");
var google = require('googleapis');
var scbconnect = require('./SCBConnect-6fa1aded75c3.json');
const VIEW_ID = 'ga:139822590';
const METRICS_NAME ='rt:activeUsers';

exports.handler = function (event, context, callback) {
    let jwtClient = new google.auth.JWT(
      scbconnect.client_email, null, scbconnect.private_key,
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
          'metrics': METRICS_NAME,
        }, function (err, response) {
          if (err) {
            console.log(err);
            return;
          }
          let currentActiveUser = response.rows[0];
          console.log("Current sctive user : "+currentActiveUser);
          if(currentActiveUser > 200){
            console.log('Current active user more than 200');
            context.succeed({
              location : "https://www.google.com"
            });
          }
          else{
            console.log('Current active user less than 200');
            context.succeed({
              location : "http://bit.ly/2l9BM7d"
            });
          }
      });  
    }
};