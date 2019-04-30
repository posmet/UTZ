Ctrl.$inject = ['$rootScope', '$scope', '$http', '$notify', '$uibModal', 'UserService', 'TableService', '$timeout'];
function Ctrl($rootScope, $scope, $http, $notify, $uibModal, UserService, TableService, $timeout) {

  const $ctrl = this;
  const stateName = 'gridState22';
  const nav = UserService.nav();
  const interfaces = Object.keys(nav).map(v => {
    const intValue = parseInt(v, 10);
    return {id: intValue, value: `${v} (${nav[v].name})`}
  });

  $ctrl.gridOptions = {
    enableFiltering: true,
    enableEditing: true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    showGridFooter: true,
    enableCellEditOnFocus: true,
    onRegisterApi: function (gridApi) {
      $ctrl.gridApi = gridApi;
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          UserService.update(rowEntity)
            .then((response) => {

            }, (err) => {
              $notify.errors(err);
            });
        }
      });
      gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      TableService.restoreState(stateName, gridApi, $scope);
      $timeout(function () {
        gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, stateName, gridApi));
      }, 100);
    },
    columnDefs: [
      { name: 'ID', field: 'userid', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Логин', field: 'User_Name', enableCellEdit: false },
      { name: 'Имя', field: 'full_name', enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      {
        name: 'Пароль',
        field: 'pwd',
        enableCellEdit: true,
        headerTooltip: true,
        cellTooltip: true
      },
      {
        name: 'Интерфейс',
        field: 'interface',
        enableCellEdit: true,
        headerTooltip: true,
        cellTooltip: true,
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownValueLabel: 'value',
        editDropdownOptionsArray: interfaces
      },
      { name: '  ', width:'100', enableFiltering: false, enableColumnMenu: false, cellTemplate: '<button class="btn btn-outline-primary btn-sm" ng-click="grid.appScope.onEdit(row)"><i class="fa fa-pencil-alt"></i> Роли</button>'},
      { name: '   ', width:'100', enableFiltering: false, enableColumnMenu: false, cellTemplate: '<button class="btn btn-outline-danger btn-sm" ng-click="grid.appScope.onDelete(row)"><i class="fa fa-trash"></i> Удалить</button>'}
    ],
    headerTemplate: require('../../directives/uiGridHeader.html')
  };

  $scope.onDelete = (row) => {
    const user = row.entity;
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
      UserService.delete(user)
        .then(loadUsers, (err) => {
          $notify.errors(err);
        });
    }, function () {});
  };

  $scope.onEdit = (row) => {
    const user = row ? row.entity : {};
    let modalInstance = $uibModal.open({
      animation: false,
      component: 'userEditModal',
      resolve: {
        interfaces: () => interfaces,
        user: () => {
          return Object.assign({}, user);
        }
      }
    });
    modalInstance.result.then((u) => {
      if (!u.userid) {
        loadUsers();
      }
    }, function () {});
  };

  const loadUsers = () => {
    UserService.list()
      .then((response) => {
        response.data.forEach(v => {
          v.blocked = v.blocked || 0;
        });
        $ctrl.gridOptions.data = response.data;
      }, (err) => {
        $notify.errors(err);
      });
  };
  loadUsers();
}

export default Ctrl;
