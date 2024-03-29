Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange', '$state', '$timeout', 'TableService', 'PharmService'];
function Ctrl($scope, $http, $notify, exchange, $state, $timeout, TableService, PharmService) {

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
          $scope.loading = true;
          $http({
            method: 'GET',
            url: '/api/updatemx/' + rowEntity.Ph_ID + "/" + rowEntity.Gr_ID + "/" + rowEntity.MinQty + "/" + rowEntity.MinReq + "/" + rowEntity.Ratio + "/" + rowEntity.TempReq
          })
          .then(function (response) {
            $ctrl.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
          }, function (err) {
            $notify.errors(err);
          })
          .then(() => {
            $scope.loading = false;
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
      { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
      { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Матрица', field: 'Matrix',  enableCellEdit: false, headerTooltip: true, cellTooltip: true },
      { name: 'Маркетинг', field: 'Marketing',  enableCellEdit: false, headerTooltip: true, cellTooltip: true },
      { name: 'Цена закупки', field: 'PriceIn', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Цена продажи', field: 'PriceOut', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
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
        , headerTooltip: true, cellTooltip: true
      },
      { name: 'Продажи30', field: 'Sales30', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Продажи60', field: 'Sales60', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'X',width:'30', cellTemplate: '<button class="btn btn-outline-danger btn-sm" ng-click="grid.appScope.deleteRow(row)">X</button>'}
    ],
    headerTemplate: require('../../directives/uiGridHeader.html')
  };

  $scope.deleteRow = function (row) {
    const index = $ctrl.gridOptions.data.indexOf(row.entity);
    $ctrl.onDelete(row.entity, index);
    //$ctrl.gridOptions.data.splice(index, 1);
  };

  $ctrl.onDelete = function (pharm, $index) {
    $ctrl.rsp = "удаление " + $index;
    if (pharm.Matrix > '') {
      $ctrl.rsp = 'ЗАПРЕЩЕНО';
      return;
    }
    $ctrl.rsp = '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
    $scope.loading = true;
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
    })
    .then(() => {
      $scope.loading = false;
    });
  };

  $scope.loading = true;
  $http({
    method: 'GET',
    url: '/api/Resultmtrx/' + $ctrl.exchange.pharmid
  })
  .then(function (response) {
    $ctrl.gridOptions.data = response.data;
  }, function (err) {
    $notify.errors(err);
  })
  .then(() => {
    $scope.loading = false;
  });

  $ctrl.onPopoverCodeSubmit = function (value) {
    if (!value) {
      return $notify.warning(`Выберите групповой код из списка`);
    }
    if (!$ctrl.exchange.pharmid) {
      return $notify.warning(`Не выбрана аптека. Перейдите по адресу ${location.origin}/view1 и выберите аптеку`);
    }
    $scope.loading = true;
    PharmService.createByGroupCode($ctrl.exchange.pharmid, value.goods_group_id)
      .then(function (response) {
        $notify.success("Успешно добавлено");
      }, function (err) {
        $notify.errors(err);
      })
      .then(() => {
        $scope.loading = false;
      });
  };

  $ctrl.refreshCodes = function (value) {
    if (!value) {
      return false;
    }
    if (value.length < 2) {
      return false;
    }
    PharmService.listGroupCodes([{field: "rgg_name", common: 'or', cond: "cn", value}, {field: "goods_group_id", common: 'or', cond: "cn", value}])
      .then((response) => {
        $ctrl.codes = response.data || [];
      }, (err) => {
        // $ctrl.codes = [{goods_group_id: 12}, {goods_group_id: 45}];
        $notify.errors(err);
      });
  };
}

export default Ctrl;
