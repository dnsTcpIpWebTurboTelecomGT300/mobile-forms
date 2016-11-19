angular.module('app.services', [])

  .service('userService', ['$http', 'apiPrefix', '$q', function ($http, apiPrefix, $q) {
    var url = "/users";

    function findUserByExternalId(externalId) {
      return $http({
        method: 'GET',
        url: apiPrefix + url + '?$filter=externalId eq \'' + externalId + '\'',
      });
    }

    function findUserById(id) {
      return $http({
        method: 'GET',
        url: apiPrefix + url + '?$filter=id eq ' + id,
      });
    }

    function createUser(userObj) {
      return $http({
        method: 'POST',
        url: apiPrefix + url,
        data: userObj
      });
    }

    function updateUser(id, userObj) {
      return $http({
        method: 'PUT',
        url: apiPrefix + url + "(" + id + ")",
        data: userObj
      })
    }

    return {
      findUserByExternalId: findUserByExternalId,
      findUserById: findUserById,
      createUser: createUser,
      updateUser: updateUser
    }
  }])

  .service('authService', ['$rootScope', '$state', 'angularAuth0', 'authManager', 'jwtHelper', '$location', '$ionicPopup',
    'ANON_AUTH', 'VK_AUTH', 'userService',
    function ($rootScope, $state, angularAuth0, authManager, jwtHelper, $location, $ionicPopup, ANON_AUTH, VK_AUTH, userService) {
      var userProfile = {};

      var anonProfile = {
        firstName: "Гость",
        lastName: "",
        avatar: "img/anon.jpg"
      };

      function loginAnonymous() {
        console.log("Anonymous log in");
        userProfile = anonProfile;
        userProfile.authType = ANON_AUTH;
        authManager.authenticate();
        syncUserWithDatabase();
        localStorage.setItem('profile', JSON.stringify(anonProfile));
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
        localStorage.removeItem("profile");
        localStorage.removeItem("id_token");
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
        authManager.authenticate();

        angularAuth0.getProfile(authResult.idToken, function (error, profileData) {
          if (error) {
            return console.log(error);
          }

          userProfile = {
            authType: VK_AUTH,
            externalId: profileData.user_id,
            firstName: profileData.given_name,
            lastName: profileData.family_name,
            avatar: profileData.picture
          };

          localStorage.setItem('profile', JSON.stringify(userProfile));

          syncUserWithDatabase();

          $rootScope.$broadcast('user:updated', VK_AUTH, userProfile);
        });

        $state.go("app.quizes");
        console.log("Authentication success");
      }

      function checkAuthOnRefresh() {
        debugger;
        //Если есть токен проверяем его
        var token = localStorage.getItem('id_token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            if (!$rootScope.isAuthenticated) {
              authManager.authenticate();
            }
          }
        } else {
          authManager.redirect();
        }
      }

      function getCurrentUserProfile() {
        return JSON.parse(localStorage.getItem('profile'));
      }

      function syncUserWithDatabase() {
        if (userProfile.authType == ANON_AUTH) {
          userService.createUser(userProfile).then(function (response) {
            userProfile.id = response.data.id;
          });
        } else if (userProfile.authType == VK_AUTH) {
          userService.findUserByExternalId(getCurrentUserProfile().externalId).then(function (response) {
            var userObj = response.data.value[0];
            if (userObj == undefined) {
              userService.createUser(userProfile).then(function (response) {
                userProfile.id = response.data.id;
              });
            } else {
              userService.updateUser(userObj.id, userProfile).then(function (response) {
                userProfile.id = response.data.id;
              });
            }
          }, function (error) {
            $ionicPopup(error);
          });
        }

      }

      return {
        getCurrentUserProfile: getCurrentUserProfile,
        loginAnonymous: loginAnonymous,
        logout: logout,
        loginWithVk: loginWithVk,
        checkAuthOnRefresh: checkAuthOnRefresh,
        authenticateAndGetProfile: authenticateAndGetProfile
      }

    }]);


