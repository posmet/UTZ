export const otherwise = 'view1';
config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function config($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

  $httpProvider.interceptors.push('authHttpResponseInterceptor');

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $urlRouterProvider.otherwise(`/${otherwise}`);

  const views = [
    {id: 1, roles: []},
    {id: 3, roles: [1, 8]},
    {id: 4, roles: []},
    {id: 7, roles: [1, 8]},
    {id: 8, roles: [8]},
    {id: 11, roles: [2, 4, 8]},
    {id: 12, roles: [2, 4, 8]},
    {id: 13, roles: [2, 4, 8]},
    {id: 14, roles: [2, 4, 8]},
    {id: 15, roles: [2, 4, 8]},
  ];

  views.forEach(view => {
    $stateProvider
      .state(`app.view${view.id}`, {
        url: `/view${view.id}`,
        controller: `View${view.id}Ctrl as $ctrl`,
        template: require(`./controllers/view${view.id}/view${view.id}.html`),
        authentication: true,
        roles: view.roles
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