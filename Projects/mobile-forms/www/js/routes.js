angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('app', {
        url: '/app',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
      })

      .state('app.quizes', {
        url: '/quizes',
        params: {
          edit: false
        },
        views: {
          'side-menu': {
            templateUrl: 'templates/quizes.html',
            controller: 'quizesCtrl'
          }
        }
      })

      .state('app.quizes.new', {
        url: '/new',
        views: {
          'side-menu@app': {
            templateUrl: 'templates/quiz-edit-form.html',
            controller: 'quizesCtrl'
          }
        }
      })

      .state('app.quizDetail', {
        url: '/quizes/:quizId',
        params: {
          edit: false
        },
        views: {
          'side-menu': {
            templateUrl: 'templates/quiz-detail.html',
            controller: 'quizDetailCtrl'
          }
        }
      })

      .state('app.quizDetail.edit', {
        url: '/quizes/:quizId/edit',
        views: {
          'quiz-edit-tab': {
            templateUrl: 'templates/quiz-edit.html'
          }
        }
      })

      .state('app.quizDetail.info', {
        url: '/quizes/:quizId/info',
        views: {
          'quiz-info-tab': {
            templateUrl: 'templates/quiz-info.html'
          }
        }
      })

      .state('app.quizDetail.answers', {
        url: '/quizes/:quizId/answers',
        views: {
          'quiz-answers-tab': {
            templateUrl: 'templates/quiz-answers.html'
          }
        }
      });


    $urlRouterProvider.otherwise('/login');

  });
