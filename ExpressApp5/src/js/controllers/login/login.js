LoginCtrl.$inject = ['$rootScope', '$http', '$notify', '$state'];
function LoginCtrl($rootScope, $http, $notify, $state) {
  this.login = (username, password) => {
    let message = null;
    if (!username) {
      message = 'Введите имя пользователя';
    } else if (!password) {
      message = 'Введите пароль';
    }
    if (message) {
      return $notify.warning(message);
    }
    $rootScope.globalBusy = true;
    $http({
      method: 'POST',
      url: '/api/auth',
      data: { username, password }
    }).
    then(function (response) {
      $rootScope.login(response.data);
      return $rootScope.getCurrentUser()
        .catch(() => {})
        .then(() => {
          $state.go('app.view1');
        });
    }, function (data) {
      $notify.errors(data);
    })
    .then(() => {
      $rootScope.globalBusy = false;
    });
  }
}

export default LoginCtrl;
