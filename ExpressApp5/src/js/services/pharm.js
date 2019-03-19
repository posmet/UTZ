function PharmService($rootScope, $http) {

  return {
    list: () => {
      return $http({
        method: 'GET',
        url: '/api/result'
      });
    },
    update: (pharm) => {
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
    delete: (pharm) => {
      return $http({
        method: 'DELETE',
        url: `/api/pharms/${pharm.Ph_ID}`
      });
    },
  };
}

PharmService.$inject = ['$rootScope', '$http'];

export default PharmService;
