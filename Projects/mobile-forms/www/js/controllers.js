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

  .controller('quizProgressListForm', ['$scope', '$stateParams', 'authService',
    'questionService', '$ionicPopover', 'answerService', '$ionicHistory',
      function($scope, $stateParams, authService,
      questionService, $ionicPopover, answerService, $ionicHistory) {

        if (questionService.getQuestionsList() && questionService.getQuestionsList().length) {
          $scope.questions = questionService.getQuestionsList();
        } else {
          questionService.findAll($stateParams.quizId).then(function(questions) {
            console.log(questions);
            questionService.setQuestionsList(questions);
            $scope.questions = questions;
          });
        }

        $scope.save = function functionName() {
          var answer={
            quizId: $stateParams.quizId,
            userId: authService.getCurrentUser().id,
            date: new Date(),
            answers: []
          };
          $scope.questions.forEach(function(item, i, arr) {
            if (item.aText || item.aDate || item.aNumber || item.answer || item.aId) {
              var qAnswer = {};
              qAnswer.questionId = item.id;
              qAnswer.textValue = item.aText;
              qAnswer.dateValue = item.aDate;
              qAnswer.numericValue = item.aNumeric;
              // qAnswer.geoValue = item.aGeoValue;
              // qAnswer.imageValue = item.aImageValue;
              if (item.isMulti) {
                qAnswer.variants = item.answer.filter(function functionName(a) {
                  return a.cheked;
                }).map(function functionName(a) {
                  return {variantId : a.aId};
                });
              }else if(item.aId){
                qAnswer.variants = [{variantId : item.aId}];
              }
              answer.answers.push(qAnswer);
            }
          });
          answerService.save(answer);
          questionService.clear();
          $ionicHistory.goBack();
        };

        $scope.actions = [
          {
            text: 'Сохранить',
            actionFunction: $scope.save
          }];

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
      }])

  .controller('quizProgressEditForm', ['$scope', '$stateParams', 'authService',
    'questionService', '$ionicScrollDelegate',
      function($scope, $stateParams, authService, questionService, $ionicScrollDelegate) {

        var ifMulti = function functionName() {
          if ($scope.question.isMulti) {
            $scope.question.answer = $scope.question.variants
          }
        };

        $scope.viewGeo = function (coord) {
          if (coord) {
            var map;
            var _marker;
            document.addEventListener("deviceready", function() {
              // Initialize the map view
              map = plugin.google.maps.Map.getMap();

              // Wait until the map is ready status.
              map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

            }, false);

            map.on(plugin.google.maps.event.MAP_CLICK, function() {
              var lat = coord.split(',')[0];
              var lng = coord.split(',')[1];
              marker = map.addMarker({
                'position': new plugin.google.maps.LatLng(lat,lng),
                'draggable': false,
                'title': coord
              }, function(marker) {
                marker.showInfoWindow();
              });
            });

            function onMapReady() {
              map.clear();
              map.showDialog();
              var lat = coord.split(',')[0];
              var lng = coord.split(',')[1];
              marker = map.addMarker({
                'position': new plugin.google.maps.LatLng(lat,lng),
                'draggable': false,
                'title': coord
              }, function(marker) {
                marker.showInfoWindow();
              });
            }
          }
        };

        if (questionService.getQuestionsList() && questionService.getQuestionsList().length) {
          $scope.questions = questionService.getQuestionsList();
          var current = $scope.questions.filter(function (question) {
            return question.id === $stateParams.questionId;
          })[0];
          questionService.setCurrentQuestion(current);
          $scope.question = current;
          $scope.isPrevExists = questionService.getPrev(true);
          $scope.isNextExists = questionService.getNext(true);
          ifMulti();
        } else {
          questionService.findAll($stateParams.quizId).then(function(questions) {
            console.log(questions);
            questionService.setQuestionsList(questions);
            $scope.questions = questions;
            var current = questions.filter(function (question) {
              return question.id === $stateParams.questionId;
            })[0];
            questionService.setCurrentQuestion(current);
            $scope.question = current;
            $scope.isPrevExists = questionService.getPrev(true);
            $scope.isNextExists = questionService.getNext(true);
            ifMulti();
          });
        }

        $scope.goPrev = function functionName() {
          questionService.update($scope.question);
          $scope.question = questionService.getPrev();
          $scope.isPrevExists = questionService.getPrev(true);
          $scope.isNextExists = questionService.getNext(true);
          ifMulti();
          $ionicScrollDelegate.scrollTop(true);
        };
        $scope.goNext = function functionName() {
          questionService.update($scope.question);
          $scope.question = questionService.getNext();
          $scope.isPrevExists = questionService.getPrev(true);
          $scope.isNextExists = questionService.getNext(true);
          ifMulti();
          $ionicScrollDelegate.scrollTop(true);
        };
        $scope.$on('$destroy', function() {
            questionService.update($scope.question);
        });
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
            var published = true;
            if ($scope.editable) {
              userId = $scope.currentUser.id;
              published = false;
            }
            quizService.findQuizes(userId, 5, skip, $scope.filterText, true, published).then(function (quizes) {
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
  'apiPrefix', '$ionicPopover', '$ionicHistory', 'quizService', '$ionicPopup',
    'authService', 'questionService', '$state',
    function($scope, $stateParams, $http, apiPrefix, $ionicPopover,
              $ionicHistory, quizService, $ionicPopup, authService, questionService, $state) {
      if (quizService.getCurrentQuiz()) {
        $scope.quiz = quizService.getCurrentQuiz()
      } else {
        if ($stateParams.quizId) {
          quizService.findOne($stateParams.quizId).then(function(quiz) {
            console.log(quiz);
            questionService.findAll(quiz.id).then(function(questions) {
              console.log(questions);
              $scope.quiz = quiz;
              $scope.quiz.questions = questions;
              quizService.setCurrentQuiz($scope.quiz);
            });
          });
        } else {
          $scope.quiz = {
            userId: authService.getCurrentUser().id,
            isPublished: false,
            creationDate: new Date().toISOString(),
            questions: []
          };
          quizService.setCurrentQuiz($scope.quiz);
        }
      }

      //Дейтсвтие сохранения
      $scope.save = function() {
        quizService.save($scope.quiz).then(function(quiz) {
          console.log(quiz);
          $scope.popover.hide();
          quizService.setCurrentQuiz(null);
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
   '$ionicPopover', '$ionicHistory', '$ionicPopup', '$state', 'quizService',
    function($scope, $stateParams, questionService,
      $ionicPopover, $ionicHistory, $ionicPopup, $state, quizService) {

      $scope.quiz = quizService.getCurrentQuiz();
      if(questionService.getCurrentQuestion()){
        $scope.question = questionService.getCurrentQuestion();
      } else {
        if ($stateParams.questionId) {
          questionService.findOne($stateParams.questionId).then(function (question) {
            $scope.question = question;
            questionService.setCurrentQuestion($scope.question);
          });
        } else {
          $scope.question = {
            quizId: $scope.quiz.id,
            variants : []
          };
          questionService.setCurrentQuestion($scope.question);
        }
      }

      //Дейтсвие сохранения вопроса
      $scope.saveQuestion = function() {
        questionService.save($scope.question).then(function(question) {
          console.log(question);
          if (!$scope.question.id) {
            $scope.quiz.questions.push(question);
          } else {
            var result = $scope.quiz.questions.filter(function (q) {
              return q.id == question.id;
            });
            var index = $scope.quiz.questions.indexOf(result[0]);
            $scope.quiz.questions[index] = question;
          }
          $scope.popover.hide();
          questionService.setCurrentQuestion(null);
          $ionicHistory.goBack();
          return question;
        }, function(error) {
          $ionicPopup.alert({
            title: 'Ошибка сохранения',
            template: error
          });
        });
      };

      //Добавляем действие удаления вопроса
      $scope.deleteQuestion = function() {
        $scope.popover.hide();
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
              if ($scope.question.id) {
                var result = $scope.quiz.questions.filter(function (question) {
                  return question.id == $scope.question.id;
                });
                var index = $scope.quiz.questions.indexOf(result[0]);
                $scope.quiz.questions.splice(index, 1);
              }
              questionService.setCurrentQuestion(null);
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

      if ($stateParams.questionId) {
        $scope.actions = [{
          text: 'Сохранить',
          actionFunction: $scope.saveQuestion
        }, {
          text: 'Удалить',
          actionFunction: $scope.deleteQuestion
        }];
      } else {
        $scope.actions = [{
          text: 'Сохранить',
          actionFunction: $scope.saveQuestion
        }];
      }

      $scope.goToVariant = function(event) {
        questionService.setCurrentQuestion($scope.question);
        $state.go('app.quizDetail.edit.questionDetail.variant', {variantIndex: event.variantIndex});
      };

      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope,
      }).then(function (popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function ($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function ($event) {
        $scope.popover.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });


      $scope.takeFoto = function takeFoto() {
        var successCallback = function(imageData) {
          $scope.question.imageValue = "data:image/jpeg;base64," + imageData;
          $scope.$apply();
        };
        var errorCallback = function functionName(message) {
          console.log("Error: " + message);
        };
        var options = {
          quality: 25,
          destinationType: Camera.DestinationType.DATA_URL
        };
        navigator.camera.getPicture(successCallback, errorCallback, options)
      };

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
          if (!latLng.toUrlValue) {
            latLng=new plugin.google.maps.LatLng(latLng.lat,latLng.lng);
          }
          marker = map.addMarker({
            'position': latLng,
            'draggable': true,
            'title': latLng.toUrlValue()
          }, function(marker) {
            marker.getPosition(function(latLng) {
              $scope.question.geoValue = latLng.toUrlValue();
              $scope.$apply();
            });
            marker.showInfoWindow();
            marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
              marker.getPosition(function(latLng) {
                $scope.question.geoValue = latLng.toUrlValue();
                marker.setTitle(latLng.toUrlValue());
                marker.showInfoWindow();
              });
            });
          });
        });

        function onMapReady() {
          map.clear();
          map.showDialog();
          if ($scope.question.geoValue) {
            var lat = $scope.question.geoValue.split(',')[0];
            var lng = $scope.question.geoValue.split(',')[1];
            marker = map.addMarker({
              'position': new plugin.google.maps.LatLng(lat,lng),
              'draggable': true,
              'title': $scope.question.geoValue
            }, function(marker) {
              marker.showInfoWindow();
              marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                marker.getPosition(function(latLng) {
                  $scope.question.geoValue = latLng.toUrlValue();
                  marker.setTitle(latLng.toUrlValue());
                  marker.showInfoWindow();
                });
              });
            });
          }
        }
      };

    },])

  .controller('variantEditCtrl', ['$scope', '$stateParams', '$ionicPopover', '$ionicHistory',
    '$ionicPopup', 'questionService',
    function ($scope, $stateParams, $ionicPopover, $ionicHistory, $ionicPopup, questionService) {

      $scope.question = questionService.getCurrentQuestion();

     $scope.takeFoto = function takeFoto() {
        var successCallback = function(imageData) {
          $scope.variant.imageValue = "data:image/jpeg;base64," + imageData;
          $scope.$apply();
        };
        var errorCallback = function functionName(message) {
          console.log("Error: " + message);
        };
        var options = {
          quality: 25,
          destinationType: Camera.DestinationType.DATA_URL
        };
        navigator.camera.getPicture(successCallback, errorCallback, options)
      };

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
          if (!latLng.toUrlValue) {
            latLng=new plugin.google.maps.LatLng(latLng.lat,latLng.lng);
          }
          marker = map.addMarker({
            'position': latLng,
            'draggable': true,
            'title': latLng.toUrlValue()
          }, function(marker) {
            marker.getPosition(function(latLng) {
              $scope.variant.geoValue = latLng.toUrlValue();
              $scope.$apply();
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
      };

      //Если был передан индекс варианта
      if ($stateParams.variantIndex) {
        $scope.variant = $scope.question.variants[$stateParams.variantIndex];

        $scope.save = function () {
          $scope.question.variants[$stateParams.variantIndex] = $scope.variant;
          $scope.popover.hide();
          $ionicHistory.goBack();
        };

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
              $scope.question.variants.splice($stateParams.variantIndex, 1);
              $scope.popover.hide();
              $ionicHistory.goBack();
            } else {
              console.log('Отмена удаления');
            }
          });
        };

        $scope.actions = [{
            text: 'Сохранить',
            actionFunction: $scope.save
          }, {
            text: 'Удалить',
            actionFunction: $scope.delete
          }
        ];

      } else {
        $scope.variant = {};

        $scope.save = function () {
          $scope.question.variants.push($scope.variant);
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

      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope,
      }).then(function (popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function ($event) {
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
