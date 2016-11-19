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
      $scope.profile = authService.getCurrentUserProfile();
      $scope.logout = function () {
        authService.logout();
      };
      $scope.$on('user:updated', function (event, data) {
        $scope.profile = authService.getCurrentUserProfile();
      });
    }])

  .controller('quizesCtrl', ['$scope', '$stateParams', '$http',
    'apiPrefix', 'AuthService', '$ionicFilterBar',
    function ($scope, $stateParams, $http,
              apiPrefix, AuthService, $ionicFilterBar) {
      $scope.edit = $stateParams.edit;
      $scope.quizId = $stateParams.quizId;
      $scope.quizes = [];
      var skip = 0;
      var isOver = false;
      $scope.moreDataCanBeLoaded = function () {
        return !isOver;
      };
      $scope.loadMoreData = function () {
        let url = '/quizes?$top=5&$skip=' + skip + '&$filter=userId eq \'' +
          AuthService.currentUser().id + '\'';
        if ($scope.filterText) {
          url = url + ' and indexof(name,\'' + $scope.filterText + '\') ge 0';
        }
        skip = skip + 5;
        $http({
          method: 'GET',
          url: apiPrefix + url,
        }).then(function successCallback(response) {
          console.log(response);
          isOver = response.data.value.length == 0;
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
    'AuthService', '$ionicPopover', '$ionicHistory',
    function ($scope, $http, apiPrefix, AuthService,
              $ionicPopover, $ionicHistory) {
      var quiz = {
        userId: AuthService.currentUser().id,
        name: '',
        description: '',
        creationDate: new Date().toISOString(),
        isPublished: false,
      };
      $scope.quiz = quiz;

      $scope.save = function functionName() {
        console.log($scope.quiz);
        let url = '/quizes';
        $http({
          method: 'POST',
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
