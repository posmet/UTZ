config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function config($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

  $httpProvider.interceptors.push('authHttpResponseInterceptor');

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $urlRouterProvider.otherwise('/view1');

  const views = [
    1, 3, 4, 7, 8, 11, 12, 13, 14, 15
  ];

  views.forEach(name => {
    $stateProvider
      .state(`app.view${name}`, {
        url: `/view${name}`,
        controller: `View${name}Ctrl as $ctrl`,
        template: require(`./controllers/view${name}/view${name}.html`),
        authentication: true
      })
  });

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