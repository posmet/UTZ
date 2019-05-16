AppCtrl.$inject = ['$state', 'UserService', 'exchange'];
function AppCtrl($state, UserService, exchange) {
  this.$state = $state;
  this.exchange = exchange;
  this.interface = UserService.nav();
}

export default AppCtrl;
