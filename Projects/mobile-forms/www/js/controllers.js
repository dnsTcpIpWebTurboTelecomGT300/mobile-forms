angular.module('app.controllers', [])
  .controller('loginCtrl', ['$scope', '$stateParams', 'authService',
    function ($scope, $stateParams, authService) {
      $scope.loginWithVk = function () {
        authService.loginWithVk();
      };
      $scope.loginAnonymous = function () {
        authService.loginAnonymous();
      }
    }])

  .controller('menuCtrl', ['$scope', '$stateParams', 'authService',
    function ($scope, $stateParams, authService) {
      $scope.profile = authService.getCurrentUser();
      $scope.logout = function () {
        authService.logout();
      };
      $scope.$on('user:updated', function (event, data) {
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
        quizService.findQuizes($scope.currentUser.id, 5, skip, $scope.filterText, true).then(function (quizes) {
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
    '$filter', '$ionicPopover', '$state', '$ionicPopup', '$ionicHistory', 'quizService',
    function ($scope, $stateParams, $http, apiPrefix, $filter, $ionicPopover, $state, $ionicPopup,
              $ionicHistory, quizService) {
      $scope.editable = $stateParams.editable;
      $scope.quizId = $stateParams.quizId;

      //Подгружаем данные опроса
      quizService.findOne($stateParams.quizId).then(function (quiz) {
        $scope.quiz = quiz;
      });

      //Действие редактирование
      $scope.edit = function () {
        $scope.popover.hide();
        $state.go('app.quizDetail.edit');
      };

      //Действие удаление
      $scope.delete = function () {
        $scope.popover.hide();
        var confirmPopup = $ionicPopup.confirm({
          title: 'Удаление опроса',
          template: 'Вы уверены что хотите удалить опрос?',
          cancelText: 'Нет',
          okText: 'Да',
        });
        confirmPopup.then(function (res) {
          if (res) {
            console.log('Удаление: ' + $stateParams.quizId);
            quizService.remove($stateParams.quizId).then(function () {
              $ionicHistory.goBack();
            }, function (error) {
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
      initPopover($ionicPopover, $scope, 'templates/popover/qd-popover.html');

    },])

  .controller('quizDetailEditCtrl', ['$scope', '$stateParams', '$http', 'apiPrefix',
    '$ionicPopover', '$ionicHistory', 'quizService', '$ionicPopup', 'authService', 'questionService',
    function ($scope, $stateParams, $http, apiPrefix, $ionicPopover,
              $ionicHistory, quizService, $ionicPopup, authService, questionService) {

      //Провреяем была ли открыта форма на редактирование существующего
      if ($stateParams.quizId) {

        //Подгружаем данные опроса
        quizService.findOne($stateParams.quizId).then(function (quiz) {
          console.log(quiz);

          //Подгружаем ответы
          questionService.findAll(quiz.id).then(function (questions) {
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
      $scope.save = function () {
        console.log($scope.quiz);
        quizService.save($scope.quiz).then(function (quiz) {
          console.log(quiz);
          $scope.quiz = quiz;
          $scope.popover.hide();
          $ionicHistory.goBack();
        }, function (error) {
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

      initPopover($ionicPopover, $scope, 'templates/popover/qd-popover.html');
    },])

  .controller('questionEditCtrl', ['$scope', '$stateParams', 'questionService', '$ionicPopover', '$ionicHistory', '$ionicPopup',
    function ($scope, $stateParams, questionService, $ionicPopover, $ionicHistory, $ionicPopup) {

      //Дейтсвие сохранения
      $scope.save = function () {
        console.log($scope.question);
        questionService.save($scope.question).then(function (question) {
          console.log(question);
          $scope.question = question;
          $scope.popover.hide();
          $ionicHistory.goBack();
        }, function (error) {
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

      //Проверяем если была открыта форма на редактирование, подгружаем вопрос
      if ($stateParams.questionId) {

        //Добавляем действие удаления
        $scope.delete = function () {
          $scope.popover.hide();
          var confirmPopup = $ionicPopup.confirm({
            title: 'Удаление вопроса',
            template: 'Вы уверены что хотите удалить вопрос?',
            cancelText: 'Нет',
            okText: 'Да',
          });
          confirmPopup.then(function (res) {
            if (res) {
              console.log('Удаление: ' + $stateParams.questionId);
              questionService.remove($stateParams.questionId).then(function () {
                $ionicHistory.goBack();
              }, function (error) {
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
        $scope.actions.push({
          text: 'Удалить',
          actionFunction: $scope.delete
        });

        //Подгружаем вопрос
        questionService.findOne($stateParams.questionId).then(function (question) {
          console.log(question);
          $scope.question = question;
        });

      } else {
        $scope.question = {
          quizId: $stateParams.quizId
        }
      }

      //Инициализируем поповер
      initPopover($ionicPopover, $scope, 'templates/popover/qd-popover.html');
    },])

  .controller('variantEditCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    },])

  .controller('quizProgressCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    },])

  .controller('questionAnswerCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    },]);

function initPopover($ionicPopover, $scope, templateUrl) {
  $ionicPopover.fromTemplateUrl(templateUrl, {
    scope: $scope,
  }).then(function (popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function ($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function () {
    $scope.popover.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.popover.remove();
  });
}
