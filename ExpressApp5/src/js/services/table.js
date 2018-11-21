function Table($rootScope, $localStorage, $timeout) {

  return {
    fieldList: () => {
      return [
        { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number' },
        { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
        { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type: 'number' },
        { name: 'Аптека', field: 'Ph_Name', width: '20%', enableCellEdit: false },
        { name: 'Филиал', field: 'Filial', enableCellEdit: false },
        { name: 'Категория', field: 'Categories', enableCellEdit: false },
        { name: 'Статус', field: 'M', enableCellEdit: false },
        { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number' },
        { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number' },
        { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
        { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
        { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
        { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
        { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
        { name: 'Матрица', field: 'Matrix', enableCellEdit: true },
        { name: 'Рейтинг', field: 'Rating', enableCellEdit: true },
        { name: 'Маркетинг', field: 'Marketing', enableCellEdit: true },
        { name: 'Сезон', field: 'Season', enableCellEdit: true },
        { name: 'Тип товара', field: 'RGT_agg', enableCellEdit: false },
        { name: 'Фармгруппа', field: 'RFG_agg', enableCellEdit: false },
        { name: 'ПКУ', field: 'PKU_agg', enableCellEdit: false }
      ]
    },
    minQty05: function (rowEntity, colDef) {
      if (colDef.field === 'MinQty' && rowEntity.Matrix && rowEntity.MinQty < 0.5) {
        rowEntity.MinQty = 0.5;
      }
    },
    saveState: function (stateName, gridApi) {
      const state = gridApi.saveState.save();
      const data = $localStorage.get(stateName) || {};
      const { userid } = $rootScope.currentUser;
      data[userid] = state;
      $localStorage.set(stateName, data);
    },
    restoreState: function (stateName, gridApi, $scope) {
      const data = $localStorage.get(stateName);
      if (data && gridApi) {
        const { userid } = $rootScope.currentUser;
        const state = data[userid];
        if (state) {
          $timeout(function () {
            gridApi.saveState.restore(null, state, $scope);
          }, 100);
        }
      }
    }
  }

}

Table.$inject = ['$rootScope', '$localStorage', '$timeout'];

export default Table;
