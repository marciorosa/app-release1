angular.module('ionicPushwooshSample', [
  'ionic',
  'ionicPushwooshSample.services'
])

.run(function($ionicPlatform, Pushwoosh) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // init the Pushwoosh
    Pushwoosh.init();
    var ref = cordova.InAppBrowser.open('http://www.falaauto.com.br', '_parent', 'location=no','toolbar=no');
    // set alias in pushwoosh center, can be your user id etc..
    // Pushwoosh.setAlias();
  });
})
