Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange', '$state', '$timeout', 'TableService'];
function Ctrl($scope, $http, $notify, exchange, $state, $timeout, TableService) {

  const $ctrl = this;
  const stateName = 'gridState3';
  $ctrl.msg = {};
  $ctrl.exchange = exchange;

  $ctrl.gridOptions = {
    enableFiltering: true,
    enableEditing: true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: true,
    multiSelect: true,
    showGridFooter: true,
    enableCellEditOnFocus: true,
    onRegisterApi: function (gridApi) {
      $ctrl.gridApi = gridApi;
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
        if (newValue != oldValue) {
          TableService.minQty05.apply(null, arguments);
          $http({
            method: 'GET',
            url: '/api/updatemx/' + rowEntity.Ph_ID + "/" + rowEntity.Gr_ID + "/" + rowEntity.MinQty + "/" + rowEntity.MinReq + "/" + rowEntity.Ratio + "/" + rowEntity.TempReq
          })
          .then(function (response) {
            $ctrl.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
            $scope.$apply();
          }, function (err) {
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
      { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number' },
      { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
      { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number' },
      { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number' },
      { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
      { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
      { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
      { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
      { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
      { name: 'Матрица', field: 'Matrix',  enableCellEdit: false },
      { name: 'Маркетинг', field: 'Marketing',  enableCellEdit: false },
      { name: 'Цена закупки', field: 'PriceIn', enableCellEdit: false, type: 'number' },
      { name: 'Цена продажи', field: 'PriceOut', enableCellEdit: false, type: 'number' },
      {
        name: 'Дней дефектуры',
        field: 'DD',
        enableCellEdit: false,
        type: 'number',
        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
          if (row.entity.DD === 0) {
            return false;
          } else if (row.entity.DD > 10) {
            return 'color-red';
          } else if (row.entity.DD <= 10) {
            return 'color-orange';
          }
        }
      },
      { name: 'X',width:'30', cellTemplate: '<button class="btn btn-outline-danger btn-sm" ng-click="grid.appScope.deleteRow(row)">X</button>'}
    ]
  };

  $scope.deleteRow = function (row) {
    const index = $ctrl.gridOptions.data.indexOf(row.entity);
    $ctrl.onDelete(row.entity, index);
    //$ctrl.gridOptions.data.splice(index, 1);
  };

  $ctrl.onCreate = function () {
    $ctrl.rsp = "добавление";
    $ctrl.checkadd = !$ctrl.checkadd;
    $ctrl.rsp = $ctrl.newgrpcode;
    if (!$ctrl.checkadd) {
      $http({
        method: 'GET',
        url: '/api/addmx/' + $ctrl.exchange.pharmid + "/" + $ctrl.newgrpcode
      })
      .then(function (response) {
        $ctrl.rsp = "";
        $notify.success("Успешно добавлено");
      },
      function (err) {
        $notify.errors(err);
      });
    }
  };

  $ctrl.onDelete = function (pharm, $index) {
    $ctrl.rsp = "удаление " + $index;
    if (pharm.Matrix > '') {
      $ctrl.rsp = 'ЗАПРЕЩЕНО';
      return;
    }
    $ctrl.rsp = '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
    $http({
      method: 'GET',
      url: '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
    })
    .then(function (response) {
      $ctrl.rsp = '';
      $notify.success("Успешно удалено");
      $ctrl.gridOptions.data.splice($index, 1);
    }, function (err) {
      $notify.errors(err);
    });
  };

  $http({
    method: 'GET',
    url: '/api/Resultmtrx/' + $ctrl.exchange.pharmid
  })
  .then(function (response) {
    $ctrl.gridOptions.data = response.data;
  }, function (err) {
    $notify.errors(err);
  });
}

export default Ctrl;
