angular.module('app.services', [])

  .service('userService', ['$http', 'apiPrefix', function ($http, apiPrefix) {
    var url = "users";

    function findUserByToken(token) {
      return $http({
        method: 'GET',
        url: apiPrefix + url + '?$filter=token eq \'' + token + '\'',
      });
    }

    function findUserByExternalId(externalId) {
      return $http({
        method: 'GET',
        url: apiPrefix + url + '?$filter=externalId eq \'' + externalId + '\'',
      });
    }

    function findOne(id) {
      return $http({
        method: 'GET',
        url: apiPrefix + url + '(' + id + ')',
      });
    }

    function save(userObj) {
      if (userObj.id) {
        return $http({
          method: 'PUT',
          url: apiPrefix + url + "(" + userObj.id + ")",
          data: userObj
        });
      } else {
        return $http({
          method: 'POST',
          url: apiPrefix + url,
          data: userObj
        });
      }
    }

    return {
      findUserByToken: findUserByToken,
      findUserByExternalId: findUserByExternalId,
      findOne: findOne,
      save: save
    }
  }])

  .service('quizService', ['$http', 'apiPrefix', function ($http, apiPrefix) {
    var url = "quizes";

    function findOne(quizId) {
      return $http({
        method: 'GET',
        url: apiPrefix + url + '(' + quizId + ')',
      });
    }

    function findQuizes(userId, top, skip, containedText, orderBy) {
      let filters = [], textFilter, filter, topStatement, skipStatement, orderByStatement;
      if (userId) {
        filters.push("userId eq \'" + userId + "\'");
      }
      if (containedText) {
        filters.push('indexof(name,\'' + containedText.toLowerCase() + '\') ge 0');
      }
      filter = "$filter=" + filters.join(" and ");

      if (top) {
        topStatement = "$top=" + top;
      }
      if (skip) {
        skipStatement = "$skip=" + skip;
      }
      if (orderBy) {
        orderByStatement = '$orderby=' + "creationDate " + "desc, name asc"
      }

      return $http({
        method: 'GET',
        url: apiPrefix + url + "?" + [filter, topStatement, skipStatement, orderByStatement].join('&'),
      })
    }

    function save(quiz) {
      if (quiz.id) {
        return $http({
          method: 'PUT',
          url: apiPrefix + url + '(' + quiz.id + ')',
          data: quiz,
        });
      } else {
        return $http({
          method: 'POST',
          url: apiPrefix + url,
          data: quiz,
        });
      }
    }

    function remove(quizId) {
      return $http({
        method: 'DELETE',
        url: apiPrefix + url + '(' + quizId + ')',
      });
    }

    return {
      findQuizes: findQuizes,
      save: save,
      remove: remove,
      findOne: findOne
    }

  }])

  .service('authService', ['$rootScope', '$state', 'angularAuth0', 'authManager', 'jwtHelper', '$location', '$ionicPopup',
    'ANON_AUTH', 'VK_AUTH', 'userService', '$q',
    function ($rootScope, $state, angularAuth0, authManager, jwtHelper,
              $location, $ionicPopup, ANON_AUTH, VK_AUTH, userService, $q) {

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
        syncUserWithDatabase().then(function (synchronizedUser) {
          localStorage.setItem('profile', JSON.stringify(synchronizedUser));
          $rootScope.$broadcast('user:updated', ANON_AUTH, synchronizedUser);
          $state.go("app.quizes");
        });
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
            token: authResult.idToken,
            externalId: profileData.user_id,
            firstName: profileData.given_name,
            lastName: profileData.family_name,
            avatar: profileData.picture
          };

          syncUserWithDatabase().then(function (synchronizedUser) {
            localStorage.setItem('profile', JSON.stringify(synchronizedUser));
            $rootScope.$broadcast('user:updated', VK_AUTH, synchronizedUser);
            $state.go("app.quizes", {editable: true});
          }, function (error) {
            $ionicPopup.alert({
              title: 'Ошибка авторизации',
              template: error
            });
          });

        });

        console.log("Authentication success");
      }

      function checkAuthOnRefresh() {
        //Если есть токен проверяем его
        var token = localStorage.getItem('id_token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            if (!$rootScope.isAuthenticated) {
              authManager.authenticate();

              //Подгружаем пользовательские данные по токену
              userService.findUserByToken(token).then(function (response) {
                if (response.data.value.length > 0) {
                  userProfile = response.data.value[0];
                  localStorage.setItem('profile', JSON.stringify(userProfile));
                  $rootScope.$broadcast('user:updated', VK_AUTH, userProfile);
                } else {
                  $ionicPopup.alert({
                    title: 'Ошибка авторизации',
                    template: "Повторите авторизацию"
                  });
                  logout();
                }
              });
            }
          }
        } else {
          authManager.redirect();
        }
      }

      function getCurrentUser() {
        return JSON.parse(localStorage.getItem('profile'));
      }

      function syncUserWithDatabase() {
        return $q(function (resolve, reject) {
          debugger;
          if (userProfile.authType == ANON_AUTH) {
            userService.save(userProfile).then(function (response) {
              userProfile.id = response.data.id;
              resolve(userProfile);
            });
          } else if (userProfile.authType == VK_AUTH) {
            userService.findUserByExternalId(userProfile.externalId).then(function (response) {
              debugger;
              var userObj = response.data.value[0];
              if (userObj != undefined) {
                userProfile.id = userObj.id;
              }
              userService.save(userProfile).then(function (response) {
                userProfile.id = response.data.id;
                resolve(userProfile);
              });
            }, function (error) {
              reject(error);
            });
          }
        });
      }

      return {
        getCurrentUser: getCurrentUser,
        loginAnonymous: loginAnonymous,
        logout: logout,
        loginWithVk: loginWithVk,
        checkAuthOnRefresh: checkAuthOnRefresh,
        authenticateAndGetProfile: authenticateAndGetProfile
      }

    }]);


