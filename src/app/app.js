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
]).run(initServiceWorker);


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

