Ctrl.$inject = ['$rootScope', '$http', '$notify', '$uibModal', 'UserService'];
function Ctrl($rootScope, $http, $notify, $uibModal, UserService) {
  this.onDelete = (user, index) => {
    let modalInstance = $uibModal.open({
      animation: false,
      component: 'confirmModal',
      resolve: {
        name: function () {
          return `Вы действительно хотите удалить пользователя ${user.User_Name}?`;
        }
      }
    });

    modalInstance.result.then(() => {
      UserService.userDelete(user)
        .then((response) => {
          this.users.splice(index, 1);
        }, (err) => {
          $notify.errors(err);
        });
    }, function () {});
  };

  this.onEdit = (user) => {
    let modalInstance = $uibModal.open({
      animation: false,
      component: 'userEditModal',
      resolve: {
        user: function () {
          return Object.assign({}, user);
        }
      }
    });
    modalInstance.result.then((u) => {
      Object.assign(user, u);
    }, function () {});
  };

  UserService.userList()
    .then((response) => {
      this.users = response.data;
    }, (err) => {
      // this.users = [{userid: 1, blocked: 1, User_Name: 'asd'}];
      $notify.errors(err);
    });
}

export default Ctrl;
