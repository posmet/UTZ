const _ = require('lodash');

let ConfirmModal = () => {
  return {
    restrict: 'E',
    template: require('./modals/confirm.html'),
    controller: ['$scope', function ($scope) {

    }]
  }
};

let UserEditModal = () => {
  return {
    restrict: 'E',
    template: require('./modals/user-edit.html'),
    controllerAs: '$ctrl',
    controller: ['$scope', '$http', '$notify', 'PharmService', 'UserService', function ($scope, $http, $notify, PharmService, UserService) {

      const getPharmList = () => {
        PharmService.list()
          .then((response) => {
            this.pharms = response.data || [];
          }, (err) => {
            $notify.errors(err);
          });
      };

      this.interfaces = Object.keys(UserService.nav()).map(v => {
        const intValue = parseInt(v, 10);
        return {id: intValue, value: intValue}
      });
      this.roles = [];
      $scope.$resolve.user.roles = $scope.$resolve.user.roles || [];

      if ($scope.$resolve.user.userid) {
        UserService.roles($scope.$resolve.user)
          .then((response) => {
            $scope.$resolve.user.roles = response.data;
          }, (err) => {
            $notify.errors(err);
          })
          .then(getPharmList);
      } else {
        getPharmList();
      }

      this.filterPharms = (v) => {
        return _.findIndex($scope.$resolve.user.roles, (o) => o.Ph_ID === v.Ph_ID) === -1;
      };

      this.save = (Form, user) => {
        if (Form.$invalid) {
          if (Form.User_Name.$invalid) {
            $notify.warning("Необходимо ввести имя пользователя");
          }
          if (Form.pwd.$invalid) {
            $notify.warning("Необходимо ввести пароль пользователя");
          }
          if (Form.interface.$invalid) {
            $notify.warning("Необходимо выбрать интерфейс пользователя");
          }
          return false;
        }
        let promise = null;
        if (user.userid) {
          promise = UserService.roleUpdate(user);
        } else {
          promise = UserService.update(user);
        }
        promise
          .then((response) => {
            $scope.$close(user);
          }, (err) => {
            $notify.errors(err);
          });
      };
    }]
  }
};


module.exports = {ConfirmModal, UserEditModal};
