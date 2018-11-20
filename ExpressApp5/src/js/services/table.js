function Table($localStorage, $timeout) {

  return {
    minQty05: function (rowEntity, colDef) {
      if (colDef.field === 'MinQty' && rowEntity.Matrix && rowEntity.MinQty < 0.5) {
        rowEntity.MinQty = 0.5;
      }
    },
    saveState: function (stateName, gridApi) {
      const state = gridApi.saveState.save();
      const data = $localStorage.get(stateName) || {};
      data[window.user.userid] = state;
      $localStorage.set(stateName, data);
    },
    restoreState: function (stateName, gridApi, $scope) {
      const data = $localStorage.get(stateName);
      if (data && gridApi) {
        const state = data[window.user.userid];
        if (state) {
          $timeout(function () {
            gridApi.saveState.restore(null, state, $scope);
          }, 100);
        }
      }
    }
  }

}

Table.$inject = ['$localStorage', '$timeout'];

export default Table;
