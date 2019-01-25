AppCtrl.$inject = ['$state', 'UserService'];
function AppCtrl($state, UserService) {
  this.$state = $state;
  this.interface = UserService.nav();
}

export default AppCtrl;
