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

      PharmService.pharmList()
        .then((response) => {
          this.pharms = response.data || [];
        }, (err) => {
          $notify.errors(err);
        });

      if ($scope.$resolve.user.userid) {
        UserService.userInfo($scope.$resolve.user)
          .then((response) => {
            Object.assign($scope.$resolve.user, response.data);
          }, (err) => {
            $notify.errors(err);
          });
      }

      this.save = (user) => {
        UserService.userUpdate(user)
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
