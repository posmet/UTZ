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
    $http({
      method: 'POST',
      url: '/api/auth',
      data: { username, password }
    }).
    then(function (response) {
      $rootScope.login(response.data);
      $rootScope.getCurrentUser()
        .catch(() => {})
        .then(() => {
          $state.go('app.view1');
        });
    }, function (data) {
      $notify.errors(data);
    });
  }
}

LoginCtrl.$inject = ['$rootScope', '$http', '$notify', '$state'];

export default LoginCtrl;
