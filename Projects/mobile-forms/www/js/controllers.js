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
      $scope.edit = $stateParams.edit;
      $scope.quizId = $stateParams.quizId;
      $scope.quizes = [];
      $scope.moreDataCanBeLoaded = false;
      $scope.currentUser = authService.getCurrentUser();

      var skip = 0;
      $scope.loadMoreData = function () {
        quizService.findQuizes($scope.currentUser.id, 5, skip, $scope.filterText, true).then(function (response) {
          console.log(response);
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
          cancel: function functionName() {
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

  .controller('quizesNewCtrl', ['$scope', '$http', 'apiPrefix',
    'authService', '$ionicPopover', '$ionicHistory', 'quizService', '$ionicPopup',
    function ($scope, $http, apiPrefix, authService,
              $ionicPopover, $ionicHistory, quizService, $ionicPopup) {
      $scope.quiz = {
        userId: authService.getCurrentUser().id,
        name: '',
        description: '',
        isPublished: false,
      };

      $scope.save = function () {
        $scope.quiz.creationDate = new Date().toISOString();
        quizService.save($scope.quiz).then(function (response){
          console.log(response);
          $scope.quiz = response.data;
          $scope.popover.hide();
          $ionicHistory.goBack();
        }, function (error) {
          $ionicPopup.alert({
            title: 'Ошибка',
            template: error
          });
        });
      };

      $ionicPopover
        .fromTemplateUrl('templates/popover/qd-popover-save.html', {
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

  .controller('quizDetailCtrl', ['$scope', '$stateParams', '$http', 'apiPrefix',
    '$filter', '$ionicPopover', '$state', '$ionicPopup', '$ionicHistory',
    function ($scope, $stateParams, $http, apiPrefix, $filter,
              $ionicPopover, $state, $ionicPopup, $ionicHistory) {
      $scope.edit = $stateParams.edit;
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
            let url = '/quizes(' + $stateParams.quizId + ')';
            $http({
              method: 'DELETE',
              url: apiPrefix + url,
            }).then(function successCallback(response) {
              console.log(response);
              $ionicHistory.goBack();
            }, function errorCallback(response) {
              console.error(response);
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

      // Execute action on hidden popover
      $scope.$on('popover.hidden', function () {
        // Execute action
      });

      // Execute action on remove popover
      $scope.$on('popover.removed', function () {
        // Execute action
      });

      let url = '/quizes(' + $stateParams.quizId + ')';
      $http({
        method: 'GET',
        url: apiPrefix + url,
      }).then(function successCallback(response) {
        console.log(response);
        let data = response.data;
        let date = new Date(data.creationDate);
        data.creationDateFormated = $filter('date')(date, 'dd/MM/yyyy');
        $scope.quize = data;
        let url = '/users(' + data.userId + ')';
        $http({
          method: 'GET',
          url: apiPrefix + url,
        }).then(function successCallback(response) {
          console.log(response);
          let data = response.data;
          $scope.user = data;
        }, function errorCallback(response) {

          console.error(response);
        });

      }, function errorCallback(response) {

        console.error(response);
      });
    },])

  .controller('quizDetailEditCtrl', ['$scope', '$stateParams',
    '$http', 'apiPrefix', '$ionicPopover', '$ionicHistory',
    function ($scope, $stateParams, $http,
              apiPrefix, $ionicPopover, $ionicHistory) {

      let url = '/quizes(' + $stateParams.quizId + ')';
      $http({
        method: 'GET',
        url: apiPrefix + url,
      }).then(function successCallback(response) {
        console.log(response);
        $scope.quiz = response.data;
      }, function errorCallback(response) {

        console.error(response);
      });

      $scope.save = function functionName() {
        console.log($scope.quiz);
        $http({
          method: 'PUT',
          url: apiPrefix + url,
          data: $scope.quiz,
        }).then(function successCallback(response) {
          console.log(response);
          $scope.quiz = response.data;
          $scope.popover.hide();
          $ionicHistory.goBack();
        }, function errorCallback(response) {

          console.error(response);
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

  .controller('quizInfoCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

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
