angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'ion-floating-menu'])
  .constant('apiPrefix', 'http://teemo-gu5b6kr5.cloudapp.net:3000/api/')
  .factory('AuthService', function() {
    var currentUser = {
      id: '02c40968-e5a7-4c4d-be1b-471b6485c637',
      authType: 'test',
      externalId: 0,
      firstName: 'currentUser',
      lastName: 'currentUser',
      avatar: null
    };

    return {
      currentUser: function() { return currentUser; }
    };
  })
  .config(function ($ionicConfigProvider) {

    $ionicConfigProvider.backButton.text('').previousTitleText(false);

  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  });
