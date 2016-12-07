angular.module('app.controllers', [])
  .controller('loginCtrl', ['$scope', '$stateParams', 'authService',
    function($scope, $stateParams, authService) {
      $scope.loginWithVk = function() {
        authService.loginWithVk();
      };
      $scope.loginAnonymous = function() {
        authService.loginAnonymous();
      };
    }])

  .controller('menuCtrl', ['$scope', '$stateParams', 'authService',
    function($scope, $stateParams, authService) {
      $scope.profile = authService.getCurrentUser();
      $scope.logout = function() {
        authService.logout();
      };
      $scope.$on('user:updated', function(event, data) {
        $scope.profile = authService.getCurrentUser();
      });
    }])

    .controller('quizesCtrl', ['$scope', '$stateParams', '$http',
        'apiPrefix', 'quizService', '$ionicFilterBar', 'authService',
        function ($scope, $stateParams, $http, apiPrefix, quizService, $ionicFilterBar, authService) {
          $scope.editable = $stateParams.editable;
          $scope.quizId = $stateParams.quizId;
          $scope.quizes = [];
          $scope.moreDataCanBeLoaded = false;
          $scope.currentUser = authService.getCurrentUser();

          var skip = 0;
          $scope.loadMoreData = function () {
            var userId;
            if ($scope.editable) {
              userId = $scope.currentUser.id;
            }
            quizService.findQuizes(userId, 5, skip, $scope.filterText, true).then(function (quizes) {
              console.log(quizes);
              skip = skip + quizes.length;
              $scope.moreDataCanBeLoaded = quizes.length > 0;
              $scope.quizes = $scope.quizes.concat(quizes);
            }, function errorCallback(response) {
              console.error(response);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
          };

          $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMoreData();
          });

          $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
              items: [],
              cancel: function () {
                $scope.filterText = null;
              },
              update: function (filteredItems, filterText) {
                skip = 0;
                $scope.quizes = [];
                $scope.filterText = filterText;
                $scope.loadMoreData();
              },
              filterProperties: 'description'
            });
          };

        },])

  .controller('quizDetailCtrl', ['$scope', '$stateParams', '$http', 'apiPrefix',
    '$filter', '$ionicPopover', '$state', '$ionicPopup', '$ionicHistory',
     'quizService',
    function($scope, $stateParams, $http, apiPrefix,
      $filter, $ionicPopover, $state, $ionicPopup, $ionicHistory,
      quizService) {
      $scope.editable = $stateParams.editable;
      $scope.quizId = $stateParams.quizId;

      //Подгружаем данные опроса
      quizService.findOne($stateParams.quizId).then(function(quiz) {
        $scope.quiz = quiz;
      });

      //Действие редактирование
      $scope.edit = function() {
        $scope.popover.hide();
        $state.go('.edit');
      };

      //Действие удаление
      $scope.delete = function() {
        $scope.popover.hide();
        var confirmPopup = $ionicPopup.confirm({
          title: 'Удаление опроса',
          template: 'Вы уверены что хотите удалить опрос?',
          cancelText: 'Нет',
          okText: 'Да',
        });
        confirmPopup.then(function(res) {
          if (res) {
            console.log('Удаление: ' + $stateParams.quizId);
            quizService.remove($stateParams.quizId).then(function() {
              $ionicHistory.goBack();
            }, function(error) {
              $ionicPopup.alert({
                title: 'Ошибка удаления',
                template: error
              });
            });
          } else {
            console.log('Отмена удаления');
          }
        });
      };

      //Доступные действия - редактировать, удалить
      $scope.actions = [
        {
          text: 'Редактировать',
          actionFunction: $scope.edit
        },
        {
          text: 'Удалить',
          actionFunction: $scope.delete
        }
      ];

      //Инициализируем поповер
      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });

    },])

  .controller('quizDetailEditCtrl', ['$scope', '$stateParams', '$http',
  'apiPrefix', '$ionicPopover', '$ionicHistory', 'quizService', '$ionicPopup', 'authService', 'questionService', '$state',
    function($scope, $stateParams, $http, apiPrefix, $ionicPopover,
              $ionicHistory, quizService, $ionicPopup, authService, questionService, $state) {
      //Провреяем была ли открыта форма на редактирование существующего
      if ($stateParams.quizId) {

        //Подгружаем данные опроса
        quizService.findOne($stateParams.quizId).then(function(quiz) {
          console.log(quiz);

          //Подгружаем ответы
          questionService.findAll(quiz.id).then(function(questions) {
            console.log(questions);
            $scope.quiz = quiz;
            $scope.quiz.questions = questions;
          });

        });
      } else {
        $scope.quiz = {
          userId: authService.getCurrentUser().id,
          isPublished: false,
          creationDate: new Date().toISOString()
        };
      }

      //Дейтсвтие сохранения
      $scope.save = function() {
        console.log($scope.quiz);
        quizService.save($scope.quiz).then(function(quiz) {
          console.log(quiz);
          $scope.quiz = quiz;
          $scope.popover.hide();
          $ionicHistory.goBack();
        }, function(error) {
          $ionicPopup.alert({
            title: 'Ошибка сохранения',
            template: error
          });
        });
      };
      $scope.actions = [
        {
          text: 'Сохранить',
          actionFunction: $scope.save
        }
      ];

      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
    },])

  .controller('questionEditCtrl', ['$scope', '$stateParams', 'questionService',
   '$ionicPopover', '$ionicHistory', '$ionicPopup', '$state',
    function($scope, $stateParams, questionService,
      $ionicPopover, $ionicHistory, $ionicPopup, $state) {

        $scope.takeFoto = function takeFoto() {
          var successCallback = function(imageData) {
            $scope.variant.imageValue = "data:image/jpeg;base64," + imageData;
          }
          var errorCallback = function functionName(message) {
            console.log("Error: " + message);
          };
          var options = {
            quality: 25,
            destinationType: Camera.DestinationType.DATA_URL
          };
          navigator.camera.getPicture(successCallback, errorCallback, options)
        }

        $scope.takeGeo = function takeGeo() {
          var map;
          var _marker;
          document.addEventListener("deviceready", function() {
            // Initialize the map view
            map = plugin.google.maps.Map.getMap();

            // Wait until the map is ready status.
            map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

          }, false);


          map.on(plugin.google.maps.event.MAP_CLICK, function(latLng) {
            map.clear();
            marker = map.addMarker({
              'position': latLng,
              'draggable': true,
              'title': latLng.toUrlValue()
            }, function(marker) {
              marker.getPosition(function(latLng) {
                $scope.variant.geoValue = latLng.toUrlValue();
              });
              marker.showInfoWindow();
              marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                marker.getPosition(function(latLng) {
                  $scope.variant.geoValue = latLng.toUrlValue();
                  marker.setTitle(latLng.toUrlValue());
                  marker.showInfoWindow();
                });
              });
            });
          });

          function onMapReady() {
            map.clear();
            map.showDialog();
            if ($scope.variant.geoValue) {
              var lat = $scope.variant.geoValue.split(',')[0];
              var lng = $scope.variant.geoValue.split(',')[1];
              marker = map.addMarker({
                'position': new plugin.google.maps.LatLng(lat,lng),
                'draggable': true,
                'title': $scope.variant.geoValue
              }, function(marker) {
                marker.showInfoWindow();
                marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                  marker.getPosition(function(latLng) {
                    $scope.variant.geoValue = latLng.toUrlValue();
                    marker.setTitle(latLng.toUrlValue());
                    marker.showInfoWindow();
                  });
                });
              });
            }
          }
        }

        if(questionService.getQuestion()){
          $scope.question = questionService.getQuestion();
        }

      //Дейтсвие сохранения вопроса
      $scope.saveQuestion = function() {
        console.log($scope.question);

        questionService.save($scope.question).then(function(question) {
          console.log(question);
          $scope.question = question;
          $scope.questionPopover.hide();
          $ionicHistory.goBack();
          questionService.addQuestion(null);
          return question;
        }, function(error) {
          $ionicPopup.alert({
            title: 'Ошибка сохранения',
            template: error
          });
        });
      };

      $scope.goToVariant = function goToVariant(index) {
        questionService.addQuestion($scope.question);
        if (index !== undefined) {
          $state.go('app.quizDetail.edit.questionDetail.variant',
          {
            variantIndex:index,
            question:$scope.question
          });
          return
        }
        $state.go('app.quizDetail.edit.questionDetail.variant.new');
      }

      //Добавляем действие удаления вопроса
      $scope.deleteQuestion = function() {
        $scope.questionPopover.hide();
        var confirmPopup = $ionicPopup.confirm({
          title: 'Удаление вопроса',
          template: 'Вы уверены что хотите удалить вопрос?',
          cancelText: 'Нет',
          okText: 'Да',
        });
        confirmPopup.then(function(res) {
          if (res) {
            console.log('Удаление: ' + $stateParams.questionId);
            questionService.remove($stateParams.questionId).then(function() {
              $ionicHistory.goBack();
            }, function(error) {
              $ionicPopup.alert({
                title: 'Ошибка удаления',
                template: error
              });
            });
          } else {
            console.log('Отмена удаления');
          }
        });
      };

      //Дейтсвие сохранения варианта
      $scope.saveVariant = function() {
        var question = questionService.getQuestion();
        if (!question.variants) {
          question.variants = [];
        }
        if ($stateParams.variantIndex) {
          question.variants[$stateParams.variantIndex] = $scope.variant;
        } else {
          question.variants.push($scope.variant);
        }

        questionService.addQuestion(question);

        $scope.variantPopover.hide();
        $ionicHistory.goBack();
      };



      //Дейтсвие удаления варианта
      $scope.deleteVariant = function() {
        $scope.variantPopover.hide();
        var confirmPopup = $ionicPopup.confirm({
          title: 'Удаление варианта',
          template: 'Вы уверены что хотите удалить вариант?',
          cancelText: 'Нет',
          okText: 'Да',
        });
        confirmPopup.then(function(res) {
          if (res) {
            $scope.question.variants.splice($stateParams.variantIndex, 1);
            $scope.variantPopover.hide();
            $ionicHistory.goBack();
          } else {
            console.log('Отмена удаления');
          }
        });
      };




      //Проверяем если была открыта форма на редактирование, подгружаем вопрос
      if ($stateParams.questionId) {

        //Подгружаем вопрос
        questionService.findOne($stateParams.questionId).then(function (question) {
          console.log(question);
          $scope.question = question;
        });

        //Действия для вопросов
        var questionActions = [{
          text: 'Сохранить',
          actionFunction: $scope.saveQuestion
        }, {
          text: 'Удалить',
          actionFunction: $scope.deleteQuestion
        }];


      } else {
        $scope.question = {
          quizId: $stateParams.quizId
        };

        //Действия для вопросов
        var questionActions = [{
          text: 'Сохранить',
          actionFunction: $scope.saveQuestion
        }];

        //Действия для опросов
        var variantActions = [{
          text: 'Сохранить',
          actionFunction: $scope.saveVariant
        }];

      }

      //Если было открыто редактирование варианта
      if ($stateParams.variantIndex) {
        $scope.variant = $scope.question.variants[$stateParams.variantIndex];

        //Действия для вариантов
        var variantActions = [{
          text: 'Сохранить',
          actionFunction: $scope.saveVariant
        }, {
          text: 'Удалить',
          actionFunction: $scope.deleteVariant
        }];

      } else {
        $scope.variant = {};

        //Действия для вариантов
        var variantActions = [{
          text: 'Сохранить',
          actionFunction: $scope.saveVariant
        }];
      }

      //Инициализируем поповер
      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope,
      }).then(function (popover) {
        $scope.questionPopover = popover;
      });
      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope,
      }).then(function (popover) {
        $scope.variantPopover = popover;
      });

      $scope.openPopover = function ($event) {
        switch ($event.target.id) {
          case "question-popover":
            $scope.actions = questionActions;
            $scope.questionPopover.show($event);
            break;
          case "variant-popover":
            $scope.actions = variantActions;
            $scope.variantPopover.show($event);
            break;
        }
      };
      $scope.closePopover = function ($event) {
        switch ($event.target.id) {
          case "question-popover":
            $scope.questionPopover.hide();
            break;
          case "variant-popover":
            $scope.variantPopover.hide();
            break;
        }
      };
      $scope.$on('$destroy', function () {
        $scope.questionPopover.remove();
        $scope.variantPopover.remove();
      });
    },])

  .controller('variantEditCtrl', ['$scope', '$stateParams', '$ionicPopover', '$ionicHistory', '$ionicPopup',
    function ($scope, $stateParams, $ionicPopover, $ionicHistory, $ionicPopup) {
      //Если был передан индекс варианта
      if ($stateParams.variantIndex) {
        $scope.variant = $stateParams.question.variants[$stateParams.variantIndex];

        //Дейтсвие сохранения
        $scope.save = function () {
          $stateParams.question.variants[$stateParams.variantIndex] = $scope.variant;
          $scope.$apply();
          $scope.popover.hide();
          $ionicHistory.goBack();
        };

        //Дейтсвие удаления
        $scope.delete = function () {
          $scope.popover.hide();
          var confirmPopup = $ionicPopup.confirm({
            title: 'Удаление варианта',
            template: 'Вы уверены что хотите удалить вариант?',
            cancelText: 'Нет',
            okText: 'Да',
          });
          confirmPopup.then(function (res) {
            if (res) {
              $stateParams.variant.splice($stateParams.variantIndex, 1);
              $scope.$apply();
              $scope.popover.hide();
              $ionicHistory.goBack();
            } else {
              console.log('Отмена удаления');
            }
          });
        };

        //Доступные действия - сохранить, удалить
        $scope.actions = [
          {
            text: 'Сохранить',
            actionFunction: $scope.save
          },
          {
            text: 'Удалить',
            actionFunction: $scope.delete
          }
        ];

      } else {
        $scope.variant = {};

        //Дейтсвие сохранения
        $scope.save = function () {
          $stateParams.question.variants.push($scope.variant);
          $scope.$apply();
          $scope.popover.hide();
          $ionicHistory.goBack();
        };

        $scope.actions = [
          {
            text: 'Сохранить',
            actionFunction: $scope.save
          }
        ];
      }

      //Инициализируем поповер
      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope,
      }).then(function (popover) {
        $scope.questionPopover = popover;
      });
      $scope.openPopover = function ($event) {
        switch ($event.target.id) {
          case "question-popover":
            break;
          case "variant-popover":
            break;
        }
        $scope.popover.show($event);
      };
      $scope.closePopover = function ($event) {
        $scope.popover.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });
    },])

  .controller('quizProgressCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    },])

  .controller('questionAnswerCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    },]);
