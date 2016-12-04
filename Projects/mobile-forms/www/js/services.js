angular.module('app.services', [])

  .service('answerService', ['$http', 'apiPrefix', '$q', function ($http, apiPrefix, $q) {
    var url = "answers";

    function findOne(answerId) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: apiPrefix + url + '(' + answerId + ')',
        }).then(function (response) {
          resolve(response.data);
        }, function (error) {
          reject(error);
        })
      });
    }

    function remove(answerId) {
      return $http({
        method: 'DELETE',
        url: apiPrefix + url + '(' + answerId + ')',
      });
    }

    function removeAll(answers) {
      answers.forEach(function (item, i, arr) {
        remove(item.id);
      });
    }

    function findByQuizId(quizId) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: apiPrefix + url + '?$filter=quizId eq \'' + quizId + '\'',
        }).then(function (response) {
          resolve(response.data.value);
        }, function (error) {
          reject(error);
        })
      });
    }

    function findByQuestionId() {

    }

    function removeByQuizId(quizId) {
      findByQuizId(quizId).then(function (answers) {
        removeAll(answers)
      })
    }

    return {
      findOne: findOne,
      remove: remove,
      removeByQuizId: removeByQuizId,
      findByQuizId: findByQuizId
    }

  }])

  .service('questionService', ['$http', 'apiPrefix', '$q', function ($http, apiPrefix, $q) {
    var url = "questions";

    var currentQuestion;

    var addQuestion = function(question) {
        currentQuestion = question;
    };

    var getQuestion = function(){
        return currentQuestion;
    };

    function removeAll(questions) {
      questions.forEach(function (item, i, arr) {
        remove(item.id);
      });
    }

    function findOne(questionId) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: apiPrefix + url + '(' + questionId + ')',
        }).then(function (response) {
          resolve(response.data);
        }, function (error) {
          reject(error);
        })
      });
    }

    function findAll(quizId) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: apiPrefix + url + '?$filter=quizId eq \'' + quizId + '\'',
        }).then(function (response) {
          resolve(response.data.value);
        }, function (error) {
          reject(error);
        })
      });
    }

    function save(question) {
      return $q(function (resolve, reject) {
        if (question.id) {
          $http({
            method: 'PUT',
            url: apiPrefix + url + "(" + question.id + ")",
            data: question
          }).then(function (response) {
            resolve(response.data)
          }, function (error) {
            reject(error);
          })
        } else {
          $http({
            method: 'POST',
            url: apiPrefix + url,
            data: question
          }).then(function (response) {
            resolve(response.data)
          }, function (error) {
            reject(error);
          })
        }
      });
    }

    function remove(questionId) {
      return $http({
        method: 'DELETE',
        url: apiPrefix + url + '(' + questionId + ')',
      });
    }

    function removeByQuizId(quizId) {
      findAll(quizId).then(function (quizes) {
        removeAll(quizes);
      })
    }

    return {
      findAll: findAll,
      save: save,
      findOne: findOne,
      remove: remove,
      removeByQuizId: removeByQuizId,
      removeAll: removeAll,
      addQuestion: addQuestion,
      getQuestion: getQuestion
    }
  }])

  .service('userService', ['$http', 'apiPrefix', '$q', function ($http, apiPrefix, $q) {
    var url = "users";

    function findUserByToken(token) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: apiPrefix + url + '?$filter=token eq \'' + token + '\'',
        }).then(function (response) {
          resolve(response.data.value[0]);
        }, function (error) {
          reject(error);
        })
      });
    }

    function findUserByExternalId(externalId) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: apiPrefix + url + '?$filter=externalId eq \'' + externalId + '\'',
        }).then(function (response) {
          resolve(response.data.value[0]);
        }, function (error) {
          reject(error);
        })
      });
    }

    function findOne(id) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: apiPrefix + url + '(' + id + ')',
        }).then(function (response) {
          resolve(response.data);
        }, function (error) {
          reject(error);
        })
      });
    }

    function save(userObj) {
      return $q(function (resolve, reject) {
        if (userObj.id) {
          $http({
            method: 'PUT',
            url: apiPrefix + url + "(" + userObj.id + ")",
            data: userObj
          }).then(function (response) {
            resolve(response.data)
          }, function (error) {
            reject(error);
          })
        } else {
          $http({
            method: 'POST',
            url: apiPrefix + url,
            data: userObj
          }).then(function (response) {
            resolve(response.data)
          }, function (error) {
            reject(error);
          })
        }
      });
    }

    return {
      findUserByToken: findUserByToken,
      findUserByExternalId: findUserByExternalId,
      findOne: findOne,
      save: save
    }
  }])

  .service('quizService', ['$http', 'apiPrefix', '$q', 'questionService', 'answerService', 'userService',
    function ($http, apiPrefix, $q, questionService, answerService, userService) {
      var url = "quizes";
      var questionsUrl = "questions";

      function findOne(quizId) {
        return $q(function (resolve, reject) {
          $http({
            method: 'GET',
            url: apiPrefix + url + '(' + quizId + ')',
          }).then(function (response) {
            var quiz = response.data;
            userService.findOne(quiz.userId).then(function (user) {
              quiz.user = user;
              resolve(quiz)
            }, function (error) {
              reject(error);
            })
          }, function (error) {
            reject(error);
          })
        });
      }

      function findQuizes(userId, top, skip, containedText, orderBy) {
        var filters = [];
        var textFilter;
        var filter;
        var topStatement;
        var skipStatement;
        var orderByStatement;
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

        return $q(function (resolve, reject) {
          $http({
            method: 'GET',
            url: apiPrefix + url + "?" + [filter, topStatement, skipStatement, orderByStatement].join('&'),
          }).then(function (response) {
            resolve(response.data.value);
          }, function (error) {
            reject(error);
          })
        });
      }

      function save(quiz) {
        return $q(function (resolve, reject) {
          if (quiz.id) {
            $http({
              method: 'PUT',
              url: apiPrefix + url + '(' + quiz.id + ')',
              data: quiz,
            }).then(function (response) {
              resolve(response.data)
            }, function (error) {
              reject(error);
            })
          } else {
            $http({
              method: 'POST',
              url: apiPrefix + url,
              data: quiz,
            }).then(function (response) {
              resolve(response.data)
            }, function (error) {
              reject(error);
            })
          }
        });
      }

      function remove(quizId) {
        questionService.removeByQuizId(quizId);
        answerService.removeByQuizId(quizId);
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
        avatar: "img/anon.jpg",
        authType: ANON_AUTH
      };

      function loginAnonymous() {
        angularAuth0.login({
          email: "mineloveguitar@gmail.com",
          password: "anon_user",
          connection: 'Username-Password-Authentication',
          responseType: 'token',
          popup: true
        }, onAnonAuthenticated, null);
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

      function onAnonAuthenticated(error, authResult) {
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

          userProfile = anonProfile;
          userProfile.token = authResult.idToken;

          syncUserWithDatabase().then(function (synchronizedUser) {
            localStorage.setItem('profile', JSON.stringify(synchronizedUser));
            $rootScope.$broadcast('user:updated', ANON_AUTH, synchronizedUser);
            $state.go("app.quizes", {editable: false});
          }, function (error) {
            $ionicPopup.alert({
              title: 'Ошибка авторизации',
              template: error
            });
          });

        });

        console.log("Anon authentication success");
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
              userService.findUserByToken(token).then(function (user) {
                if (user) {
                  userProfile = user;
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
          if (userProfile.authType == ANON_AUTH) {
            userService.save(userProfile).then(function (user) {
              userProfile.id = user.id;
              resolve(userProfile);
            });
          } else if (userProfile.authType == VK_AUTH) {
            userService.findUserByExternalId(userProfile.externalId).then(function (user) {
              if (user != undefined) {
                userProfile.id = user.id;
              }
              userService.save(userProfile).then(function (user) {
                userProfile.id = user.id;
                resolve(userProfile);
              });
            }, function (error) {
              reject(error);
            });
          }
        });
      }

      function isAnonUser() {
        var currentUser = getCurrentUser();
        return currentUser.authType === ANON_AUTH;
      }

      return {
        getCurrentUser: getCurrentUser,
        loginAnonymous: loginAnonymous,
        logout: logout,
        loginWithVk: loginWithVk,
        checkAuthOnRefresh: checkAuthOnRefresh,
        authenticateAndGetProfile: authenticateAndGetProfile,
        isAnonUser: isAnonUser
      }

    }]);
