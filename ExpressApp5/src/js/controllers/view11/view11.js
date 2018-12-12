Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange', '$state', '$timeout', 'TableService'];
function Ctrl($scope, $http, $notify, exchange, $state, $timeout, TableService) {

  const $ctrl = this;
  const stateName = 'gridState11';

  $ctrl.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    MultiSelect: false,
    enableCellEditOnFocus: true,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
        if (newValue != oldValue) {
          $http.post('/api/updateph/', rowEntity).then(function (response) {
            $ctrl.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
            $scope.$apply();
          }, function (err) {
            $notify.errors(err);
          });
        }
      });
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        exchange.phname = row.entity.Ph_Name;
        exchange.pharmid = row.entity.Ph_ID;
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
      { name: "Код", field: "Ph_ID" , enableCellEdit:false, type: 'number', headerTooltip: true, cellTooltip: true},
      { name: "Наименование", field: "Ph_Name", width: "30%", enableCellEdit: false, headerTooltip: true, cellTooltip: true },
      { name: "Филиал", field: "Filial", enableCellEdit: false, headerTooltip: true, cellTooltip: true},
      { name: "Тип", field: "Type", enableCellEdit: false, headerTooltip: true, cellTooltip: true},
      { name: "Страховой запас", field: "D_A", type: "number",  enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "Дней доставки", field: "D_D", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Дней продаж", field: "D_T", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "Kmin", field: "Kmin", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Kmax", field: "Kmax", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Категория", field: "Categories", enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "График", field: "graph", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Дней сверхнорамтивов", field: "over", enableCellEdit: true, type: 'number', headerTooltip: true, cellTooltip: true }
    ]
  };

  $ctrl.onMatrix = function () {
    exchange.grid = 0;
    exchange.grname = '';
    exchange.conditions.push({
      field: 'Ph_ID',
      cond: 'eq',
      value: exchange.pharmid
    });
    $state.go('app.view12');
  };

  $http({
    method: 'GET',
    url: '/api/Result'
  })
  .then(function (response) {
    $ctrl.gridOptions.data = response.data;
  }, function (err) {
    $notify.errors(err);
  });
}

export default Ctrl;
