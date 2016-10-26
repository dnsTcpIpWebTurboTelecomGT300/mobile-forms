angular.module('app.controllers', [])
  .controller('loginCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('menuCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('quizesCtrl', ['$scope', '$stateParams', '$http', 'apiPrefix',
    function ($scope, $stateParams, $http, apiPrefix) {
      $scope.edit = $stateParams.edit;
      $scope.quizId = $stateParams.quizId;

      let url = "/quizes?$filter=userId eq '02c40968-e5a7-4c4d-be1b-471b6485c637'";
      $http({
          method: 'GET',
          url: apiPrefix+url
      }).then(function successCallback(response) {
            console.log(response);
            $scope.quizes = response.data.value;
          }, function errorCallback(response) {
            console.error(response);
          });
    }])

  .controller('quizDetailCtrl', ['$scope', '$stateParams', '$http', 'apiPrefix', '$filter', '$ionicPopover',
    function ($scope, $stateParams, $http, apiPrefix, $filter,$ionicPopover) {
      $scope.edit = $stateParams.edit;
      $scope.quizId = $stateParams.quizId;

      $ionicPopover.fromTemplateUrl('templates/popover/qd-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // Execute action on hidden popover
      $scope.$on('popover.hidden', function() {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        // Execute action
      });

      let url = "/quizes("+$stateParams.quizId+")";
      $http({
          method: 'GET',
          url: apiPrefix+url,
      }).then(function successCallback(response) {
            console.log(response);
            let data  = response.data;
            let date = new Date(data.creationDate);
            data.creationDateFormated = $filter('date')(date, "dd/MM/yyyy")
            $scope.quize = data;
            let url = "/users("+data.userId+")";
            $http({
                method: 'GET',
                url: apiPrefix+url,
            }).then(function successCallback(response) {
                  console.log(response);
                  let data  = response.data;
                  $scope.user = data;
                }, function errorCallback(response) {
                  console.error(response);
                });

          }, function errorCallback(response) {
            console.error(response);
          });
    }])

  .controller('quizInfoCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('questionEditCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('variantEditCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('quizProgressCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('questionAnswerCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }]);
