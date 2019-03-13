function PharmService($rootScope, $http) {

  return {
    pharmList: () => {
      return $http({
        method: 'GET',
        url: '/api/result'
      });
    },
    pharmUpdate: (pharm) => {
      const opts = pharm.Ph_ID ? {
        method: 'PUT',
        url: `/api/pharms/${pharm.Ph_ID}`,
        data: pharm
      } : {
        method: 'POST',
        url: `/api/pharms`,
        data: pharm
      };
      return $http(opts)
    },
    pharmDelete: (pharm) => {
      return $http({
        method: 'DELETE',
        url: `/api/pharms/${pharm.Ph_ID}`
      });
    },
  };
}

PharmService.$inject = ['$rootScope', '$http'];

export default PharmService;
