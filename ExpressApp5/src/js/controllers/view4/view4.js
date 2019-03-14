Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange', '$state', '$timeout', 'TableService'];
function Ctrl($scope, $http, $notify, exchange, $state, $timeout, TableService) {

  const $ctrl = this;
  const stateName = 'gridState4';

  $ctrl.exchange = exchange;
  $ctrl.gridOptions = {
    enableFiltering: true,
    enableEditing: true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    multiSelect: false,
    showGridFooter: true,
    enableCellEditOnFocus: true,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
        if (newValue != oldValue) {
          if (rowEntity.Req < rowEntity.qmin) rowEntity.Req = rowEntity.qmin;
          if (rowEntity.Req > rowEntity.qmax) rowEntity.Req = rowEntity.qmax;

          $http({
            method: 'GET',
            url: '/api/updaterq/' + rowEntity.Ph_ID + "/" + rowEntity.GrCode + "/" + rowEntity.Req
          }).then(function (response) {
            $ctrl.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
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
      { name: 'ГрКод', field: 'GrCode', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
      {
        name: 'Заявка',
        field: 'Req',
        enableCellEdit: true,
        type: 'number',
        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
          if (row.entity.MP === 0) {
            return 'red';
          }
        }
        , headerTooltip: true, cellTooltip: true
      },
      { name: 'Диапазон', field: 'Range', enableCellEdit: false, headerTooltip: true, cellTooltip: true },
      { name: 'Кратность', field: 'Ratio', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Мин Запас', field: 'MinQty', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true },
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
    ],
    headerTemplate: require('../../directives/uiGridHeader.html')
  };

  $ctrl.onSend = function () {
    $http({
      method: 'GET',
      url: '/api/send/' + exchange.pharmid
    })
    .then(function (response) {
      $ctrl.rsp = response.data;
    }, function (err) {
      $notify.errors(err);
    });
    $state.go('app.view1');
  };

  $http({
    method: 'GET',
    url: '/api/ResultRq/' + exchange.pharmid
  })
  .then(function (response) {
    if (response.data.length > 0) {
      $ctrl.sent = response.data[0].sent > 0;
      if ($ctrl.sent) {
        $ctrl.gridOptions.columnDefs[2].enableCellEdit = false;
      }
    }
    $ctrl.gridOptions.data = response.data;
  }, function (err) {
    $notify.errors(err);
  });
}

export default Ctrl;
