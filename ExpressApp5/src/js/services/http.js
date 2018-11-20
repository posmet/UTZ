function authHttpResponseInterceptor($q, $rootScope){
  return {
    request: function (config) {
      const token = $rootScope.getToken();
      config.headers.Authorization = 'Bearer ' + token;
      if (process.env.HOST && config.url.search(/api/ig) !== -1) {
        config.url = `${process.env.HOST}${config.url}`;
      }
      return config || $q.when(config);
    },

    response: function (response) {
      return response || $q.when(response);
    },

    responseError: function (rejection) {
      if (rejection.status === 401) {
        $rootScope.logout();
      }
      return $q.reject(rejection);
    }
  }
}

authHttpResponseInterceptor.$inject = ['$q', '$rootScope'];

export default authHttpResponseInterceptor;
