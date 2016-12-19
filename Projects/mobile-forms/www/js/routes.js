angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
      })

      .state('app', {
        url: '/app',
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl',
        data: {
          requiresLogin: true
        }
      })

      .state('app.help', {
        url: '/help',
        cache: false,
        views: {
          'side-menu': {
            templateUrl: 'templates/help.html',
            controller: 'helpCtrl'
          }
        },
        controller: 'helpCtrl',
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizes', {
        url: '/quizes',
        cache: false,
        params: {
          editable: false
        },
        views: {
          'side-menu': {
            templateUrl: 'templates/quizes.html',
            controller: 'quizesCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizDetail', {
        url: '/quizes/:quizId',
        cache: false,
        params: {
          editable: false
        },
        views: {
          'side-menu': {
            templateUrl: 'templates/quiz-detail.html',
            controller: 'quizDetailCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizDetail.edit', {
        url: '/edit',
        cache: false,
        views: {
          'side-menu@app': {
            templateUrl: 'templates/quiz-edit-form.html',
            controller: 'quizDetailEditCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      // Прохождение оспроса: списковая форма вопросов
      .state('app.quizProgress', {
        url: '/quizProgress/:quizId',
        cache: false,
        views: {
          'side-menu@app': {
            templateUrl: 'templates/questions.html',
            controller: 'quizProgressListForm'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      // Прохождение оспроса: сам вопрос
      .state('app.quizProgress.question', {
        url: '/question/:questionId',
        cache: false,
        views: {
          'side-menu@app': {
            templateUrl: 'templates/question-progress.html',
            controller: 'quizProgressEditForm'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizDetail.new', {
        url: '/new',
        cache: false,
        views: {
          'side-menu@app': {
            templateUrl: 'templates/quiz-edit-form.html',
            controller: 'quizDetailEditCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizDetail.edit.questionDetail', {
        url: '/questions/:questionId',
        views: {
          'side-menu@app': {
            templateUrl: 'templates/question-edit.html',
            controller: 'questionEditCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizDetail.edit.questionDetail.new', {
        url: '/new',
        params: {
          quiz: {}
        },
        views: {
          'side-menu@app': {
            templateUrl: 'templates/question-edit.html',
            controller: 'questionEditCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizDetail.edit.questionDetail.variant', {
        url: '/variant/:variantIndex',
        parent: 'app.quizDetail.edit.questionDetail',
        views: {
          'side-menu@app': {
            templateUrl: 'templates/variant-edit.html',
            controller: 'variantEditCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

      .state('app.quizDetail.edit.questionDetail.variant.new', {
        url: '/new',
        parent: 'app.quizDetail.edit.questionDetail',
        views: {
          'side-menu@app': {
            templateUrl: 'templates/variant-edit.html',
            controller: 'variantEditCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      });

    $urlRouterProvider.otherwise('/login');
  });
