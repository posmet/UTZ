function Ctrl($http, $notify, exchange, $state) {
  this.clickph = (pharm, $index) => {
    exchange.pharmid = this.pharms[$index].Ph_ID;
    exchange.phname = this.pharms[$index].Ph_Name;
    exchange.filial = this.pharms[$index].Filial;
    $state.go('app.view4');
  };
  $http({
    method: 'GET',
    url: '/api/result'
  })
  .then((response) => {
    this.pharms = response.data;
    exchange.filial = this.pharms[0].Filial;
  }, (err) => {
    $notify.errors(err);
  });
}

Ctrl.$inject = ['$http', '$notify', 'exchange', '$state'];

export default Ctrl;
