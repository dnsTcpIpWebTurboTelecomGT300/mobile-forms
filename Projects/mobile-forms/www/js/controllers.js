angular.module('app.controllers', [])

  .controller('loginCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('menuCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('quizesCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      $scope.edit = $stateParams.edit;
      $scope.quizId = $stateParams.quizId;
    }])

  .controller('quizDetailCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      $scope.edit = $stateParams.edit;
      $scope.quizId = $stateParams.quizId;
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
