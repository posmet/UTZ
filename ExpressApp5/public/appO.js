var app = angular.module('app', ['ngRoute', 'ngTouch',
    'ui.grid', 'ui.grid.edit', 'ui.grid.exporter',
    'ui.grid.moveColumns', 'ui.grid.autoResize', 'ui.grid.resizeColumns',
    'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.expandable', 'ngAria', 'chart.js'])
    .
    run(function ($rootScope) {
        $rootScope.test = new Date();
        $rootScope.pharmname = '';
        $rootScope.pharmid = 0;
        $rootScope.grname = "";
        $rootScope.grid = 0;
    }).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/view1', {
                templateUrl: 'partial5',
                controller: 'MyCtrl5'
            }).
            when('/view2', {
                templateUrl: 'partial2',
                controller: 'MyCtrl2'
            }).
            when('/view3', {
                templateUrl: 'partial3',
                controller: 'MyCtrl3'
            }).
            when('/view4', {
                templateUrl: 'partial4',
                controller: 'MyCtrl4'
            }).
            when('/view7', {
                templateUrl: 'partial7',
                controller: 'MyCtrl4'
            }).
            when('/view11', {
                templateUrl: 'partial11n',
                controller: 'MyCtrl11'
            }).
            when('/view12', {
                templateUrl: 'partial12n',
                controller: 'MyCtrl12'
            }).
            when('/view13', {
                templateUrl: 'partial13n',
                controller: 'MyCtrl13'
            }).
            when('/view14', {
                templateUrl: 'partial14n',
                controller: 'MyCtrl14'
            }).
            when('/view15', {
                templateUrl: 'partial15n',
                controller: 'MyCtrl15'
            }).
            otherwise({
                redirectTo: '/view1'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });
app.controller('AppCtrl', function ($scope, $http, $rootScope) {
    //$scope.exfac = exchange;
    $scope.interface1 = false;
    $scope.interface2 = false;
    $scope.interface3 = false;
    $http({
        method: 'GET',
        url: '/api/name'
    }).
        then(function (response) {
            $scope.user = response.data;
        }, function (data, status, headers, config) {
            $scope.name = 'Error!';
        });

});
app.controller('MyCtrl1', function ($scope, $http) {
    //$scope.exfac = exchange;
    $scope.pharmname = 'Тестовая аптека';
    $scope.pharmid = 1;
    // $scope.clickph = function(pharm,index){
    //     $scope.pharmid = index;
    // };
    $http({
        method: 'GET',
        url: '/api/Result'
    }).
        then(function (response) {
            $scope.result = response.data;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';
        });

});
app.controller('MyCtrl3', function ($scope, $http) {
        $scope.test = 'test2';
        $scope.checkadd = false;
        $scope.sortType = 'Gr_Name';
        $scope.sortReverse = false;
        $scope.searchStr = '';
        $scope.mtrx = [];
        $scope.mtrxf = [];
        $scope.loaded = 0
        $scope.loadMore = function () {
            for (var i = 0; i < 15; i++) {
                if ($scope.searchStr != "") {
                    if ($scope.mtrxf[$scope.loaded]) {
                        $scope.mtrx.push($scope.mtrxf[$scope.loaded]);
                    }
                } else {
                    if ($scope.mtrxa[$scope.loaded]) {
                        $scope.mtrx.push($scope.mtrxa[$scope.loaded]);
                    }
                };
                $scope.loaded++;
            }
        };
        $scope.onsearch = function () {
            $scope.mtrx = [];
            $scope.loaded = 0;
            if ($scope.searchStr != "") {
                $scope.mtrxf = [];
                $scope.mtrxf = $scope.mtrxa.filter(function (el) {
                    return el.Gr_Name.toLowerCase().indexOf($scope.searchStr.toLowerCase()) + 1;
                });
            };
            $scope.loadMore();
        };
        $scope.onedit = function (pharm, $index) {
            //
            $scope.rsp = '/api/updatemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID + "/" + pharm.MinQty + "/" + pharm.MinReq + "/" + pharm.Ratio;
            pharm.MinQty = pharm.MinQty.replace(",", ".");
            $http({
                method: 'GET',
                url: '/api/updatemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID + "/" + pharm.MinQty + "/" + pharm.MinReq + "/" + pharm.Ratio
            }).
                then(function (response) {
                    $scope.mtrxa.push(data);
                    $scope.mtrx.push(data);
                }, function (data, status, headers, config) {
                    $scope.Result = 'Error!';
                });
        };
        $scope.ondelete = function (pharm, $index) {

            //
            $scope.rsp = "удаление" + $index;
            $scope.rsp = '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
            $http({
                method: 'GET',
                url: '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
            }).
                then(function (response) {
                    $scope.rsp = response.data;
                },
                function (data, status, headers, config) {
                    $scope.Result = 'Error!';
                });
            if (pharm.Valid == 1) {
                $scope.mtrx.splice($index, 1);
            } else {
                pharm.Valid = 4;
            }
        };
        $scope.oncreate = function (pharm, $index) {
            //
            $scope.rsp = "добавление";
            $scope.checkadd = !$scope.checkadd;
            $scope.rsp = $scope.newgrpcode;
            if (!$scope.checkadd) {
                $http({
                    method: 'GET',
                    url: '/api/addmx/' + $scope.pharmid + "/" + $scope.newgrpcode
                }).
                    then(function (response) {
                        $scope.rsp = response.data;
                    },
                    function (data, status, headers, config) {
                        $scope.Result = 'Error!';
                    });
            }
        };
        $http({
            method: 'GET',
            url: '/api/ResultMtrx/' + $scope.pharmid
        }).
            then(function (response) {
                $scope.mtrxa = response.data;
                $scope.loadMore();
            }, function (data, status, headers, config) {
                $scope.Resulta = 'Error!';
            });

    });
app.controller('MyCtrl4', function ($scope, $http, $location, $rootScope) {
    $scope.test = 'test2';
    $scope.onmtrx = function (row, index) {

    };
    $scope.rsp = 'Debug';
    //$scope.pharmname = 'Тестовая аптека';
    //$scope.pharid = 1;
    //$scope.pharmname = $rootScope.pharmname;
    //$scope.pharmid = $rootScope.pharmid;
    $scope.sortType = 'Gr_Name';
    $scope.sortReverse = false;
    $scope.searchStr = '';
    $scope.OnSend = function () {
        $http({
            method: 'GET',
            url: '/api/send/' + $scope.pharmid
        }).
            then(function (response) {
                $scope.rsp = response.data;
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
        $location.path('/');
    };
    $scope.onedit = function (pharm, $index) {
        //  $scope.rsp = 'Editing' + $index+ $scope.rq[$index].GrCode;
        if (!pharm.Req) pharm.Req = 0;
        $scope.rsp = '/api/updaterq/' + pharm.Ph_ID + "/" + pharm.GrCode + "/" + pharm.Req;
        //$scope.rsp = pharm.Gr_Name;
        console.log(pharm);
        $scope.editable = false;
        if (pharm.Req > pharm.qmax) pharm.Req = pharm.qmax;
        if (pharm.Req < pharm.qmin) pharm.Req = pharm.qmin;
        $http({
            method: 'GET',
            url: '/api/updaterq/' + pharm.Ph_ID + "/" + pharm.GrCode + "/" + pharm.Req
        }).
            then(function (response) {
                $scope.rsp = response.data;
            }, function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });
    };
    $http({
        method: 'GET',
        url: '/api/ResultRq/' + $scope.pharmid
    }).
        then(function (response) {
            if (response.data.length > 0) {
                $scope.sent = response.data[0].sent > 0;
                // $scope.pharmname = data[0].ph_name;
                // $scope.pharmid = data[0].ph_id;
            };
            $scope.rq = response.data;
        }, function (data, status, headers, config) {
            $scope.Result = 'Error!';
        });

});
app.controller('MyCtrl5', ['$scope','$http','$location','$rootScope','exchange', function ($scope, $http, $location, $rootScope,exchange) {
    //$scope.exfac = exchange;
    $scope.pharmname = 'Тестовая аптека';
    $scope.pharmid = 1;
    $scope.exchange = exchange;
    $scope.clickph = function (pharm, $index) {
        $scope.pharmid = $scope.pharms[$index].Ph_ID;
        $scope.pharmname = $scope.pharms[$index].Ph_Name;
        $rootScope.pharmid = $scope.pharms[$index].Ph_ID;
        $rootScope.pharmname = $scope.pharms[$index].Ph_Name;
        $scope.exchange.pharmid = $scope.pharms[$index].Ph_ID;
        $scope.exchange.phname = $scope.pharms[$index].Ph_Name;
        $location.path('/view4');
    };
    $http({
        method: 'GET',
        url: '/api/result'
    }).
        then(function (response) {
            $scope.pharms = response.data;
        }, function (error) {
            $scope.result = 'Error!';
        });

}]);
 app.controller('MyCtrl7', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange) {
    var vm = this;
    vm.msg = {};
    vm.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        MultiSelect: false,
        exporterMenuCsv: true,
        enableGridMenu: true,
        expandableRowTemplate: 'expandableRowTemplate.html',
        expandableRowHeight: 450,
       onRegisterApi: function (gridApi) {
            vm.gridApi = gridApi;
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                if (row.isExpanded) {
                    row.entity.subGridOptions = {
                        columnDefs: [
                            { name: 'Наименование', field:'RGG_Name' },
                            { name: 'Количество', field:'RequestB_Quantity' },
                            { name: 'В заказе' ,field:'OrderB_Quantity'},
                            { name: "Поставщик", field:'Contractor_Name' },
                            { name: "В накладной", field:'Invoice_Number'},
                            { name: "В отказе", field: 'Refuse_Qty'},
                            { name: "Оприходовано", field: 'Receive_id'}
                        ]
                    };

                    $http.get('/api/request/' + row.entity.Request_ID)
                        .then(function (response) {
                            row.entity.subGridOptions.data = response.data;
                        });
                }
            });
        },
        columnDefs: [
            { name: "Код", field: "Request_ID" },
            { name: "Статус", field: "State_Name"},
            { name: "Дата", field: "R_date" },
            { name: "Источник", field: "Request_Generation_Method" },
            { name: "Позиций", field: "CountM" ,type:'number'},
            { name: "В заказах", field: "CountO",type: 'number' },
            { name: "В накладных", field: "CountI", type: 'number' },
            { name: "В отказах", field: "CountR", type: 'number'},
            { name: "Оприходовано", field: "CountD", type: 'number' },
            { name: "Комментарий", field: "Comments", type: 'number' }
        ]
    };
    vm.exchange = exchange;
    vm.onmatrix = function () {
        //  exchange.pharmid = 1;
        exchange.grid = 0;
        //   exchange.phname = 'testph';
        exchange.grname = '';
        $location.path('/view12');
    }

    $http({
        method: 'GET',
        url: '/api/requests/' + exchange.pharmid
    }).
        then(function (response) {
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';

        });


}]);
app.controller('MyCtrl12', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', 'i18nService', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange, i18nService) {
  var vm = this;
  vm.msg = {};
  vm.exchange = exchange;
  vm.gridOptions = {
      enableFiltering: true,
      enableEditing: true,
      exporterMenuCsv: true,
      enableGridMenu: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      showGridFooter:true,
      onRegisterApi: function (gridApi) {
          vm.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
              //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
              $http({
                  method: 'GET',
                  url: '/api/updatemx/' + rowEntity.Ph_ID + "/" + rowEntity.Gr_ID + "/" + rowEntity.MinQty + "/" + rowEntity.MinReq + "/" + rowEntity.Ratio
              }).
                  then(function (response) {
                      vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                      $scope.$apply();
                      //vm.gridOptions.data = response.data;
                  }, function (data, status, headers, config) {
                      $scope.Result = 'Error!';
                  });
          });
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              
              exchange.grid = row.entity.Gr_ID;
              exchange.grname = row.entity.Gr_Name;
              exchange.phname = row.entity.Ph_Name;
              exchange.pharmid = row.entity.Ph_ID;
          });
      },
    columnDefs: [
        { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number' },
      { name: 'Наименование', field:'Gr_Name',width:'30%', enableCellEdit:false },
      { name: 'Аптека', field:'Ph_Name',width:'20%', enableCellEdit: false},
      { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number'},
      { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number'},
      { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
      { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: true, type: 'number'},
      { name: 'Остаток', field:'Ost', enableCellEdit: true,type: 'number' },
      { name: 'В пути', field: 'Wait', enableCellEdit: true, type: 'number' }
  ]
  };

  //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
  //  .then(function(response) {
  //    vm.gridOptions.data = response.data;
  //    });

  $scope.onClick = function () {
      if (!vm.exchange.pharmid) {
          vm.exchange.pharmid = 0;
      }
      if (!vm.exchange.grid) {
          vm.exchange.grid = 0;
      }
      $scope.loading = true;
      $http({
          method: 'GET',
          url: '/api/ResultMtrxa/' + vm.exchange.pharmid + '/' + vm.exchange.grid
      }).
          then(function (response) {
   //           var data = response.data;
   //           for (var i = 0; i < 6; i++) {
   //               data = data.concat(data);
   //           }
              vm.gridOptions.data = response.data;
              $scope.loading = false;
           // $scope.loadMore();
          }, function (data, status, headers, config) {
              $scope.Resulta = 'Error!';
          });

  }
  $scope.onedit = function (pharm, $index) {
      //
      $scope.rsp = '/api/updatemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID + "/" + pharm.MinQty + "/" + pharm.MinReq + "/" + pharm.Ratio;
      pharm.MinQty = pharm.MinQty.replace(",", ".");
      $http({
          method: 'GET',
          url: '/api/updatemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID + "/" + pharm.MinQty + "/" + pharm.MinReq + "/" + pharm.Ratio
      }).
          then(function (response) {
              vm.gridOptions.data = response.data;
          }, function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
  };
  $scope.onaccept = function (phaольгаrm, $index) {
      //
      $scope.rsp = '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
      $http({
          method: 'GET',
          url: '/api/acceptmx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
      }).
          then(function (response) {
              $scope.rsp = response.data;
              $scope.mtrx.splice($index, 1);
          }, function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
  };
  $scope.ondelete = function (pharm, $index) {

      //
      $scope.rsp = "удаление" + $index;
      $scope.rsp = '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
      $http({
          method: 'GET',
          url: '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
      }).
          then(function (response) {
              $scope.rsp = response.data;
          },
          function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
      $scope.mtrx.splice($index, 1);
  };
  $scope.oncreate = function (pharm, $index) {
      //
      $scope.rsp = "добавление";
      $scope.checkadd = !$scope.checkadd;
      $scope.rsp = $scope.newgrpcode;
      if (!$scope.checkadd) {
          $http({
              method: 'GET',
              url: '/api/addmx/' + $scope.newphcode + "/" + $scope.newgrpcode
          }).
              then(function (response) {
                  $scope.rsp = response.data;
              },
              function (data, status, headers, config) {
                  $scope.Result = 'Error!';
              });
      }
  };

  $scope.onSearch = function () {
      if (!$scope.searchPh) {
          $scope.searchPh = 0;
      }
      if (!$scope.searchGrp) {
          $scope.searchGrp = 0;
      }
      $http({
          method: 'GET',
          url: '/api/resultmtrxacc'
      }).
          then(function (response) {
              vm.gridOptions.data = response.data;
              // $scope.loadMore();
          }, function (data, status, headers, config) {
              $scope.Resulta = 'Error!';
          });

  }
  $scope.onstat = function () {
   //   exchange.pharmid = 1;
   //   exchange.grid = 1;
   //   exchange.phname = 'testph';
   //   exchange.grname = 'testgr';
      $location.path('/view13');
  }      
}]);
app.controller('MyCtrl11', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', function ($scope, $http, $interval,uiGridConstants,$rootScope,$location,exchange) {
    var vm = this;
    vm.msg = { };
    vm.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        MultiSelect: false,
        onRegisterApi: function (gridApi) {
            vm.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
                $http({
                    method: 'GET',
                    url: '/api/updateph/' + rowEntity.Ph_ID + "/" + rowEntity.D_D + "/" + rowEntity.D_A + "/" + rowEntity.D_T + "/" + rowEntity.Kmin + "/" + rowEntity.Kmax
                }).
                    then(function (response) {
                        vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                        $scope.$apply();
                        //vm.gridOptions.data = response.data;
                    }, function (data, status, headers, config) {
                        $scope.Result = 'Error!';
                    });
            })
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                exchange.phname = row.entity.Ph_Name;
                exchange.pharmid = row.entity.Ph_ID;
            });
        },
        columnDefs: [
            { name: "Код", field: "Ph_ID" },
            { name: "Наименование", field: "Ph_Name",width:"30%" },
            { name: "Филиал", field: "Filial" },
            { name: "Тип", field: "Type" },
            { name: "Страховой запас", field: "D_A",type:"number" },
            { name: "Дней доставки", field: "D_D", type: "number" },
            { name: "Дней продаж", field: "D_T", type: "number"},
            { name: "Kmin", field: "Kmin", type: "number" },
            { name: "Kmax", field: "Kmax", type: "number" },
            { name: "Категория", field: "Categories" }
        ]
    };
    vm.exchange = exchange;
    vm.onmatrix = function () {
         //  exchange.pharmid = 1;
           exchange.grid = 0;
        //   exchange.phname = 'testph';
           exchange.grname = '';
        $location.path('/view12');
    }      

    $http({
        method: 'GET',
        url: '/api/Result'
    }).
        then(function (response) {
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';

        });


}]);
app.controller('MyCtrl13', function ($scope, $http,$rootScope,exchange) {
    var vm = this;
    $scope.exchange = exchange;
    $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

    $scope.labels = [];
    $scope.data = [];
    $scope.data.push([]);
    $scope.data.push([]);
    $scope.data.push([]);

    $scope.onsearch = function () {
        $http({
            method: 'GET',
            url: '/api/sales/' + $scope.exchange.pharmid + "/" + $scope.exchange.grid
        }).
            then(function (response) {
                $scope.myData = response.data;
                if ($scope.myData.length > 0) {
                    $scope.Ph_Name = $scope.exchange.phname;
                    $scope.Gr_Name = $scope.exchange.grname;
                }
                $scope.labels = [];
                $scope.data = [];
                $scope.data.push([]);
                $scope.data.push([]);
                $scope.data.push([]);
                for (var i = 0; i < $scope.myData.length - 1; i++) {
                    $scope.labels.push($scope.myData[i].Dat)
                    $scope.data[0].push($scope.myData[i].stock_q)
                    $scope.data[1].push($scope.myData[i].q)
                    $scope.data[2].push($scope.myData[i].MinQty)
                }

            }, function (data, status, headers, config) {
                $scope.result = 'Error!';

            });

    };
    $scope.datasetOverride = [
        {
            label: "Остатки",
            borderWidth: 1,
            type: 'bar'
        },
        {
            label: "Продажи",
            borderWidth: 3,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            type: 'line'
        },
        {
            label: "Мин Запас",
            borderWidth: 1,
            type: 'bar'
        },
    ];
    if (($scope.exchange.pharmid != 0) && ($scope.exchange.grid != 0)) {
        $scope.onsearch();
    };
});
app.factory('exchange', function () {
    return ({
        pharmid: 0,
        phname: '',
        grid: 0,
        grname: ''
    })

});
app.factory('save11', function(){
    return({
        savestate: {},
        data: []
    })
});
app.factory('save12', function(){
    return({
        savestate: {},
        data: []
    })
})

