angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services',
  'ion-floating-menu', 'auth0.auth0', 'angular-jwt', 'jett.ionic.filter.bar'])
  
  .constant('apiPrefix', 'http://teemo-gu5b6kr5.cloudapp.net:3000/api/')
  .constant("AUTH0_DOMAIN", "mobile-forms.eu.auth0.com")
  .constant("AUTH0_APP_ID", "JJmxtVcCorumFXQIKRkZxX0HyuAl0EA9")
  .constant("ANON_AUTH", "anonymous")
  .constant("VK_AUTH", "vk")

  .factory('AuthService', function () {
    var currentUser = {
      id: '02c40968-e5a7-4c4d-be1b-471b6485c637',
      authType: 'test',
      externalId: 0,
      firstName: 'currentUser',
      lastName: 'currentUser',
      avatar: null
    };

    return {
      currentUser: function () {
        return currentUser;
      }
    };
  })
  
  .config(function ($ionicConfigProvider, angularAuth0Provider, AUTH0_DOMAIN, AUTH0_APP_ID, ANON_AUTH, VK_AUTH) {
    $ionicConfigProvider.backButton.text('').previousTitleText(false);

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_APP_ID,
      domain: AUTH0_DOMAIN
    });
  })

  .run(function ($rootScope, $ionicPlatform, authService, ANON_AUTH, VK_AUTH) {
    $rootScope.ANON_AUTH = ANON_AUTH;
    $rootScope.VK_AUTH = VK_AUTH;

    // Process the auth token if it exists and fetch the profile
    authService.authenticateAndGetProfile();

    // Check is the user authenticated before Ionic platform is ready
    authService.checkAuthOnRefresh();

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

      // Use the authManager from angular-jwt to check for
      // the user's authentication state when the page is
      // refreshed and maintain authentication
      authService.checkAuthOnRefresh();
    });
  });
