import {MODULE_NAME} from '../../app';

Ctrl.$inject = ['$rootScope', '$localStorage', '$notify', 'exchange', '$state', 'PharmService', '$scope', 'TableService', '$timeout', '$uibModal'];
function Ctrl($rootScope, $localStorage, $notify, exchange, $state, PharmService, $scope, TableService, $timeout, $uibModal) {

  const stateName = 'gridState1';

  this.clickph = (pharm, $index) => {
    const obj = {
      pharmid: this.pharms[$index].Ph_ID,
      phname: this.pharms[$index].Ph_Name,
      filial: this.pharms[$index].Filial
    };
    Object.assign(exchange, obj);
    $localStorage.set(`${MODULE_NAME}_ph`, obj);
    $state.go('app.view4');
  };

  this.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    showGridFooter: true,
    enableCellEditOnFocus: true,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          PharmService.update(rowEntity.Ph_ID, {[colDef.field]: newValue})
            .then(function (response) {

            }, function (err) {
              rowEntity[colDef.field] = oldValue;
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
      { name: "Код", field: "Ph_ID" , enableCellEdit: false, type: 'number', headerTooltip: true, cellTooltip: true},
      { name: "Наименование", field: "Ph_Name", width: "30%", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Филиал", field: "Filial", enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "Тип", field: "Type", enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "Страховой запас", field: "D_A", type: "number",  enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "Дней доставки", field: "D_D", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Дней продаж", field: "D_T", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "Kmin", field: "Kmin", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Kmax", field: "Kmax", type: "number", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Категория", field: "Categories", enableCellEdit: true, headerTooltip: true, cellTooltip: true},
      { name: "График", field: "graph", enableCellEdit: true, headerTooltip: true, cellTooltip: true },
      { name: "Дней сверхнорамтивов", field: "over", enableCellEdit: true, type: 'number', headerTooltip: true, cellTooltip: true },
      { name: ' ', width: '30', enableFiltering: false, enableCellEdit: false, cellTemplate: '<button class="btn btn-outline-danger btn-sm" ng-click="grid.appScope.onDelete(row)">X</button>' }
    ],
    headerTemplate: require('../../directives/uiGridHeader.html')
  };

  this.popovers = {
    pharm: ''
  };

  this.onPopoverPharmSubmit = function (value) {
    if (!value) {
      return false;
    }
    PharmService.create({Ph_ID: value})
      .then((response) => {
        getPharmList();
        this.popoverPharmOpened = false;
      }, (err) => {
        $notify.errors(err);
      });
  };

  $scope.onDelete = (row) => {
    let modalInstance = $uibModal.open({
      animation: false,
      component: 'confirmModal',
      resolve: {
        name: function () {
          return `Вы действительно хотите удалить аптеку ${row.entity.Ph_Name || row.entity.Ph_ID}?`;
        }
      }
    });

    modalInstance.result.then(() => {
      PharmService.delete(row.entity)
        .then((response) => {
          getPharmList();
        }, (err) => {
          $notify.errors(err);
        });
    }, function () {});
  };

  let getPharmList = () => {
    let promise = $rootScope.currentUser.interface === 4 ? PharmService.list() : PharmService.listByUser();
    promise
      .then((response) => {
        this.pharms = response.data;
        this.gridOptions.data = response.data;
        exchange.filial = this.pharms[0].Filial;
      }, (err) => {
        $notify.errors(err);
      });
  };

  getPharmList();
}

export default Ctrl;
