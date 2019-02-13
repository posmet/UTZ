function PharmService($rootScope, $http) {

  return {
    pharmList: () => {
      return $http({
        method: 'GET',
        url: '/api/result'
      });
    }
  };
}

PharmService.$inject = ['$rootScope', '$http'];

export default PharmService;
