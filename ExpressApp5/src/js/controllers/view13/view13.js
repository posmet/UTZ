import ExcelJS from 'exceljs/dist/exceljs.min';

Ctrl.$inject = ['$scope', '$http', '$notify', 'exchange'];
function Ctrl($scope, $http, $notify, exchange) {

  const $ctrl = this;
  const download = function () {
    let wb = new ExcelJS.Workbook();
    let ws = wb.addWorksheet('Статистика');
    ws.columns = [
      { header: 'ГрКод', key: 'Gr_ID', width: 7},
      { header: 'Наименование', key: 'Gr_Name', width: 15 },
      { header: 'Код', key: 'Ph_ID', width: 7},
      { header: 'Аптека', key: 'Ph_Name'},
      { header: 'Дата', key: 'dat', width: 10 },
      { header: 'Остатки', key: 'Ost' },
      { header: 'Мин. запас', key: 'Qty', width: 11 },
      { header: 'Продажи', key: 'Sal' },
      { header: 'Приходы', key: 'Rec' },
      { header: 'Скорость', key: 'Vel' },
      { header: 'Автозаказ', key: 'Req', width: 10 },
      { header: 'Заказ', key: 'Reqa' }
    ];
    ws.getRow(1).font = {
      bold: true
    };
    $ctrl.myData.forEach(function (item) {
      let clone = Object.assign({} , item);
      clone.Gr_Name = exchange.grname;
      clone.Ph_Name = exchange.phname;
      ws.addRow(clone);
    });
    wb.xlsx.writeBuffer()
      .then(function (data) {
        let blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        saveAs(blob, "Статистика.xlsx");
      }).catch(function (err) {
        console.log(err)
      });
  };

  $ctrl.exchange = exchange;
  $ctrl.colors = ['#00ffff', '#007f00', '#0000ff', '#7f7f00', '#ff0000', '#ff0000', '#007f00'];

  $ctrl.myData = [];
  $ctrl.labels = [];
  $ctrl.data = [];
  $ctrl.data.push([]);
  $ctrl.data.push([]);
  $ctrl.data.push([]);

  $ctrl.onDownloadClick = function () {
    if (!$ctrl.myData.length) {
      $ctrl.onSearch(true);
    } else {
      download();
    }
  };

  $ctrl.onSearch = function (isDownload) {
    $http({
      method: 'GET',
      url: '/api/sales/' + $ctrl.exchange.pharmid + "/" + $ctrl.exchange.grid
    })
    .then(function (response) {
      $ctrl.myData = response.data;
      if (isDownload) {
        download();
        return false;
      }
      if ($ctrl.myData.length > 0) {
        $ctrl.Ph_Name = $ctrl.exchange.phname;
        $ctrl.Gr_Name = $ctrl.exchange.grname;
      }
      $ctrl.labels = [];
      $ctrl.data = [];
      $ctrl.data.push([]);
      $ctrl.data.push([]);
      $ctrl.data.push([]);
      $ctrl.data.push([]);
      $ctrl.data.push([]);
      $ctrl.data.push([]);
      $ctrl.data.push([]);
      for (let i = 0; i < $ctrl.myData.length; i++) {
        $ctrl.labels.push($ctrl.myData[i].dat);
        $ctrl.data[0].push($ctrl.myData[i].Ost);
        $ctrl.data[1].push($ctrl.myData[i].Qty);
        $ctrl.data[2].push($ctrl.myData[i].Sal);
        $ctrl.data[3].push($ctrl.myData[i].Rec);
        $ctrl.data[4].push($ctrl.myData[i].Vel);
        if ($ctrl.myData[i].Req > 0)
          $ctrl.data[5].push(0);
        else
          $ctrl.data[5].push(NaN);
        if ($ctrl.myData[i].Reqa > 0)
          $ctrl.data[6].push(0);
        else
          $ctrl.data[6].push(NaN);
      }
    }, function (err) {
      $notify.errors(err);
    });
  };

  $ctrl.options = {
    legend: {
      display: true,
      position: 'bottom'
    },
    elements: {
      line: {
        tension:0,
      }
    }
  };

  $ctrl.series = ["Остатки", "Мин Запас", "Продажи", "Приходы", "Скорость", "Автозаказ","Заказ"];
  $ctrl.datasetOverride = [
    {
      label: "Остатки",
      borderWidth: 1,
      type: 'line',
      fill: false,
      pointRadius:0
    },
    {
      label: "Мин Запас",
      borderWidth: 1,
      type: 'line',
      fill: false,
      pointRadius: 0
    },
    {
      label: "Продажи",
      borderWidth: 1,
      type: 'line',
      fill: false,
      pointRadius: 0
    },
    {
      label: "Приходы",
      borderWidth: 1,
      type: 'line',
      fill: false,
      pointRadius: 0
    },
    {
      label: "Скорость",
      borderWidth: 1,
      type: 'line',
      fill: false,
      pointRadius: 0
    },
    {
      label: "Автозаказ",
      borderWidth: 1,
      type: 'line',
      fill: false,
      pointRadius: 10,
      pointStyle: 'triangle'
    },
    {
      label: "Заказ",
      borderWidth: 1,
      type: 'line',
      fill: false,
      pointRadius: 10,
      pointStyle: 'triangle'
    }

  ];

  if ($ctrl.exchange.pharmid != 0 && $ctrl.exchange.entity.Gr_ID != 0) {
    $ctrl.onSearch();
  }
}

export default Ctrl;
