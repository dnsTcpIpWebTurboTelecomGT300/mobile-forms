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
        quizService.findQuizes($scope.currentUser.id, 5, skip, $scope.filterText, true).then(function (response) {
          console.log(response.data);
          skip = skip + response.data.value.length;
          $scope.moreDataCanBeLoaded = response.data.value.length > 0;
          $scope.quizes = $scope.quizes.concat(response.data.value);
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
    '$filter', '$ionicPopover', '$state', '$ionicPopup', '$ionicHistory', 'quizService', 'userService',
    function ($scope, $stateParams, $http, apiPrefix, $filter, $ionicPopover, $state, $ionicPopup,
              $ionicHistory, quizService, userService) {
      $scope.editable = $stateParams.editable;
      $scope.quizId = $stateParams.quizId;

      $scope.edit = function () {
        $scope.popover.hide();
        $state.go('app.quizDetail.edit');
      };

      $scope.delete = function () {
        $scope.popover.hide();
        var confirmPopup = $ionicPopup.confirm({
          title: 'Удаление вопроса',
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

      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover-edit.html', {
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

      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });

      quizService.findOne($stateParams.quizId).then(function (response) {
        console.log(response.data);
        let quiz = response.data;
        quiz.creationDateFormated = $filter('date')(new Date(quiz.creationDate), 'dd/MM/yyyy');
        userService.findOne(quiz.userId).then(function (response) {
          console.log(response.data);
          $scope.quiz.user = response.data;
        })
        $scope.quiz = quiz;
      });
    },])

  .controller('quizDetailEditCtrl', ['$scope', '$stateParams', '$http', 'apiPrefix',
    '$ionicPopover', '$ionicHistory', 'quizService', '$ionicPopup', 'authService',
    function ($scope, $stateParams, $http, apiPrefix, $ionicPopover,
              $ionicHistory, quizService, $ionicPopup, authService) {
      if ($stateParams.quizId) {
        quizService.findOne($stateParams.quizId).then(function (response) {
          console.log(response.data);
          $scope.quiz = response.data;
        });
      } else {
        $scope.quiz = {
          userId: authService.getCurrentUser().id,
          name: '',
          description: '',
          isPublished: false,
          creationDate: new Date().toISOString()
        };
      }

      $scope.save = function () {
        console.log($scope.quiz);
        quizService.save($scope.quiz).then(function (response) {
          console.log(response.data);
          $scope.quiz = response.data;
          $scope.popover.hide();
          $ionicHistory.goBack();
        }, function (error) {
          $ionicPopup.alert({
            title: 'Ошибка сохранения',
            template: error
          });
        });
      };

      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover-save.html', {
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
    },])

  .controller('questionEditCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

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
