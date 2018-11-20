config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function config($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

  $httpProvider.interceptors.push('authHttpResponseInterceptor');

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $urlRouterProvider.otherwise('/view1');

  $stateProvider
    .state('app', {
      abstract: true,
      url: '',
      template: require('./controllers/main.html'),
      controller: 'AppCtrl as $ctrl',
      authentication: true,
      resolve: {
        settings: ['$q', '$rootScope', function($q, $rootScope) {
          if (!$rootScope.isAuthorized()) {
            return $rootScope.redirectToLogin();
          }
          let defer = $q.defer();
          if (!$rootScope.currentUser) {
            $rootScope.getCurrentUser()
              .catch(() => {
                $rootScope.redirectToLogin();
              })
              .then(() => {
                defer.resolve();
              })
          } else {
            defer.resolve();
          }
          return defer.promise;
        }]
      }
    })
    .state('app.view1', {
      url: '/view1',
      controller: 'View1Ctrl as $ctrl',
      template: require('./controllers/view1/view1.html'),
      authentication: true
    })
    .state('app.view4', {
      url: '/view4',
      controller: 'View4Ctrl as $ctrl',
      template: require('./controllers/view4/view4.html'),
      authentication: true
    })
    .state('access', {
      url: '',
      abstract: true,
      template: '<div ui-view></div>',
      authentication: false
    })
    .state('access.login', {
      url: '/login',
      controller: 'LoginCtrl as $ctrl',
      template: require('./controllers/login/login.html'),
      authentication: false,
      title: 'Авторизация'
    });

}