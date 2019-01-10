Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange', '$state', '$timeout', 'TableService'];
function Ctrl($scope, $http, $notify, exchange, $state, $timeout, TableService) {

  const $ctrl = this;

  $ctrl.msg = {};
  $ctrl.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    MultiSelect: false,
    exporterMenuCsv: true,
    enableGridMenu: true,
    onRegisterApi: function (gridApi) {
      $ctrl.gridApi = gridApi;
    },
    columnDefs: [
      { name: "Код", field: "Request_ID", type: 'number', grouping: { groupPriority: 1 }, sort: { priority: 1, direction: 'desc' }, headerTooltip: true, cellTooltip: true },
      { name: "Статус", field: "State_Name", headerTooltip: true, cellTooltip: true},
      { name: "Дата", field: "R_date", grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'desc' }, headerTooltip: true, cellTooltip: true },
      { name: "Источник", field: "Request_Generation_Method", headerTooltip: true, cellTooltip: true },
      { name: "Комментарий", field: "Comments", type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'Наименование', field:'Gr_Name', headerTooltip: true, cellTooltip: true },
      { name: 'Количество', field:'RequestB_Quantity', type: 'number', headerTooltip: true, cellTooltip: true },
      { name: 'В заказе' ,field:'OrderB_Quantity', type: 'number', headerTooltip: true, cellTooltip: true},
      { name: "Поставщик", field:'Contractor_Name', headerTooltip: true, cellTooltip: true },
      { name: "В накладной", field:'Invoice_Number', type: 'number', headerTooltip: true, cellTooltip: true},
      { name: "В отказе", field: 'Refuse_Qty', type: 'number', headerTooltip: true, cellTooltip: true},
      { name: "Оприходовано", field: 'Receive_id', type: 'number', headerTooltip: true, cellTooltip: true}
    ],
    headerTemplate: require('../../directives/uiGridHeader.html')
  };
  $ctrl.exchange = exchange;

  $http({
    method: 'GET',
    url: '/api/request/' + exchange.pharmid
  })
  .then(function (response) {
    $ctrl.gridOptions.data = response.data;
  }, function (err) {
    $notify.errors(err);
  });
}

export default Ctrl;
