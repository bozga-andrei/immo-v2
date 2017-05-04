'use strict';

angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'ui.slimscroll',
  'angular-progress-button-styles',
  'BlurAdmin.theme',
  'BlurAdmin.pages'
]).run(initServiceWorker).run(initFirebaseNotification);


// Initialize serviceWorker
function initServiceWorker() {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);

      }).catch(function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    })
  }
}


function initFirebaseNotification() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCrkl7KL4b-stypFAOOU5ZYF4wKLeZJI6g",
    authDomain: "immoinvet.firebaseapp.com",
    databaseURL: "https://immoinvet.firebaseio.com",
    projectId: "immoinvet",
    storageBucket: "immoinvet.appspot.com",
    messagingSenderId: "486683404629"
  };
  firebase.initializeApp(config);

  //Initialize a service worker for firebase messaging
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then(function (registration) {
        // Registration was successful
        console.log('firebase-messaging-sw registration successful with scope: ', registration.scope);

        // Retrieve Firebase Messaging object.
        const messaging = firebase.messaging();

        messaging.useServiceWorker(registration);


        // [START refresh_token]
        // Callback fired if Instance ID token is updated.
        messaging.onTokenRefresh(function() {
          messaging.getToken()
            .then(function(refreshedToken) {
              console.log('Token refreshed.');
              // Indicate that the new Instance ID token has not yet been sent to the
              // app server.
              setTokenSentToServer(false);
              // Send Instance ID token to app server.
              sendTokenToServer(refreshedToken);
            })
            .catch(function(err) {
              console.log('Unable to retrieve refreshed token ', err);
            });
        });
        // [END refresh_token]

        messaging.requestPermission()
          .then(function () {
            console.log('Notification permission granted.');
            return messaging.getToken();
          })
          .then(function (token) {
            console.log(token);
            sendTokenToServer(token);
          })
          .catch(function (err) {
            console.log('Unable to get permission to notify.', err);
            setTokenSentToServer(false);
          });


        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a sevice worker
        //   `messaging.setBackgroundMessageHandler` handler.
        messaging.onMessage(function (payload) {
          console.log("Message received. ", payload);
          // ...
        });
      }).catch(function (err) {
      // registration failed :(
      console.log('firebase-messaging-sw registration failed: ', err);
    })
  }

}

// Send the Instance ID token to your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
      'unless it changes');
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') == 1;
}
function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}

