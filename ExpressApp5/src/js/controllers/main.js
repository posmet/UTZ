function AppCtrl($scope, $http, $notify) {
  this.roles = {
    1: 'Аптека',
    2: 'Маркетолог',
    3: 'Техподежка',
    4: 'Директор филиала'
  };
}

AppCtrl.$inject = ['$scope', '$http', '$notify'];

export default AppCtrl;
