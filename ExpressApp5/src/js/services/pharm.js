function PharmService($rootScope, $http) {

  return {
    list: () => {
      return $http({
        method: 'GET',
        url: '/api/pharms'
      });
    },
    listByUser: () => {
      return $http({
        method: 'GET',
        url: '/api/result'
      });
    },
    listGroupCodes: (filter) => {
      return $http({
        method: 'POST',
        url: '/api/table/Gg_attr',
        data: {filter: filter || [], limit: 100}
      });
    },
    create: (pharm) => {
      return $http({
        method: 'POST',
        url: '/api/pharms/',
        data: pharm
      });
    },
    createByGroupCode: (pharmId, groupCode) => {
      return $http({
        method: 'GET',
        url: '/api/addmx/' + pharmId + "/" + groupCode
      });
    },
    update: (id, pharm) => {
      return $http({
        method: 'PUT',
        url: `/api/pharms/${id}`,
        data: pharm
      });
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
