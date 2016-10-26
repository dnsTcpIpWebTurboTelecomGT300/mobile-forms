angular.module('app.services', [])

  .service('authService', ['$rootScope', '$state', 'angularAuth0', 'authManager', 'jwtHelper', '$location', '$ionicPopup',
    'ANON_AUTH', 'VK_AUTH',
    function ($rootScope, $state, angularAuth0, authManager, jwtHelper, $location, $ionicPopup, ANON_AUTH, VK_AUTH) {
      var userProfile = JSON.parse(localStorage.getItem('profile')) || {};

      var anonProfile = {
        "firstName": "Гость"
      };

      function loginAnonymous() {
        localStorage.setItem("authType", ANON_AUTH);
        localStorage.setItem("profile", anonProfile);
        console.log("Anonymous log in");
        $rootScope.$broadcast('user:updated', ANON_AUTH, anonProfile);
        $state.go("app.quizes");
      }

      function loginWithVk() {
        angularAuth0.login({
          connection: 'vkontakte',
          responseType: 'token',
          popup: true
        }, onAuthenticated, null);
      }

      function logout() {
        $state.go("login", {}, {reload: true});
        authManager.unauthenticate();
        userProfile = {};
        console.log("Logged out");
      }

      function authenticateAndGetProfile() {
        var result = angularAuth0.parseHash(window.location.hash);

        if (result && result.idToken) {
          onAuthenticated(null, result);
        } else if (result && result.error) {
          onAuthenticated(result.error);
        }
      }

      function onAuthenticated(error, authResult) {
        if (error) {
          console.log("Authentication error");
          return $ionicPopup.alert({
            title: 'Ошибка авторизации!',
            template: 'Повторите попытку авторизации!'
          });
        }
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem("authType", VK_AUTH);
        authManager.authenticate();

        angularAuth0.getProfile(authResult.idToken, function (error, profileData) {
          if (error) {
            return console.log(error);
          }

          localStorage.setItem('profile', JSON.stringify(profileData));
          userProfile = profileData;

          $rootScope.$broadcast('user:updated', VK_AUTH, userProfile);
        });

        $state.go("app.quizes");
        console.log("Authentication success");
      }

      function checkAuthOnRefresh() {
        var token = localStorage.getItem('id_token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            if (!$rootScope.isAuthenticated) {
              authManager.authenticate();
            }
          }
        } else if (localStorage.getItem('authType') === 'anonymous') {
          if (!$rootScope.isAuthenticated) {
            authManager.authenticate();
          }
        }
        $state.go("login", {}, {reload: true});
      }

      function getCurrentUserProfile() {
        return JSON.parse(localStorage.getItem('profile'));
      }

      function getAuthType() {
        return localStorage.getItem('authType');
      }

      return {
        getAuthType: getAuthType,
        getCurrentUserProfile: getCurrentUserProfile,
        loginAnonymous: loginAnonymous,
        logout: logout,
        loginWithVk: loginWithVk,
        checkAuthOnRefresh: checkAuthOnRefresh,
        authenticateAndGetProfile: authenticateAndGetProfile
      }
    }]);
