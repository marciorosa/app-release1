(function() {
  'use strict';

  angular
    .module('ionicPushwooshSample.services', ['ionicPushwooshSample.configs'])
    .factory("Pushwoosh", Pushwoosh);

    Pushwoosh.$inject = ['PUSHWOOSH_CONFIG', "$state"];

    function Pushwoosh(PUSHWOOSH_CONFIG, $state){
      var PW_APP_ID = PUSHWOOSH_CONFIG.PW_APP_ID;
      var GOOGLE_PROJECT_NUMBER = PUSHWOOSH_CONFIG.GOOGLE_PROJECT_NUMBER;
      var pushNotification;

      return {
        init             : init,
        initializePlugin : initializePlugin,
        registerDevice   : registerDevice,
        setAlias         : setAlias,
        resetApplicationIconBadgeNumber  :   resetApplicationIconBadgeNumber
      }

      function init(){
        if (window.plugins && window.plugins.pushNotification){
          pushNotification = window.plugins.pushNotification;
        } else {
          console.log("Push Notification not enabled.");
          return;
        }
        //set push notification callback before we initialize the plugin
        document.addEventListener('push-notification', function(event) {
          //get the notification payload
          var notification = event.notification;
          //handle notification
          notificationHandler(notification);
          //clear the app badge
          resetApplicationIconBadgeNumber();
        });

        registerDevice();
        initializePlugin();
        resetApplicationIconBadgeNumber();
      }

      //initialize the plugin
      function initializePlugin(){
        console.log("init pushwoosh plugin...");
        if (ionic.Platform.isIOS()) {
          pushNotification.onDeviceReady({ pw_appid: PW_APP_ID});
        }

        if (ionic.Platform.isAndroid()) {
          pushNotification.onDeviceReady({ projectid: GOOGLE_PROJECT_NUMBER, appid: PW_APP_ID });
        }
      }

      function registerDevice(){
        //register for pushes
        console.log("register device...")
        pushNotification.registerDevice(function(status) {
          var deviceToken = ionic.Platform.isIOS() ? status.deviceToken : status;
          console.log('registerDevice: ' + deviceToken);
        }, function(status) {
          var errorStr = JSON.stringify(status)
          console.warn('failed to register : ' + errorStr);
          // if the request is timeout then retry
          if(errorStr.search("The request timed out") != -1){
            registerDevice();
          }
        });
      }

      function setAlias(aliasValue) {
        console.log("set alias: " + aliasValue);
        if(pushNotification){
          pushNotification.setTags({
            Alias: aliasValue
          },function(status) {
            console.log("Pushwoosh setAlias success");
          },
          function(status) {
            console.log(status);
            console.log("Pushwoosh setAlias failed");
          });
        }
      }

      function resetApplicationIconBadgeNumber() {
        if(pushNotification){
          //reset badges on app start
          pushNotification.setApplicationIconBadgeNumber(0);
        }
      }

      function formatPushData(notification){
        /********************* ios push data structure ************************************
        event = {
          ...
          notification: {
            onStart: true,
            aps: {
              alert: "Nice to meet you",
              badge: 1,
              sound: "default"
            },
            custom: {
              type: "message"
            },
          }
        }
        ******************************************************************************/

        /**************** android push data structure*****************************************
        event = {
          notification: {
            alert: "[xx] match with you",
            collapse_key: "do_not_collapse",
            custom: "{"type":"dop"}",
            foreground: false,
          }
        }
        ******************************************************************************/
        var notification = ionic.Platform.isIOS() ? notification.userdata : JSON.parse(notification.userdata);
        return notification;
      }

      function notificationHandler(notification){
        var formatNotification = formatPushData(notification);
        var messageType = formatNotification.type;

        // onStart is true means the app is not active
        // the user click in notification center
        if(notification.onStart || !notification.foreground){
          // app wake up from notification center,
          // do something what you like, for example:
          // $state.go("home");
        } else {
          // do something what you need
        }
      }
    }
})();
