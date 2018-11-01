var app = angular.module('app', ['ngRoute', 'ngTouch','ngCookies',
    'ui.grid', 'ui.grid.saveState', 'ui.grid.edit', 'ui.grid.exporter',
    'ui.grid.moveColumns', 'ui.grid.autoResize', 'ui.grid.resizeColumns',
    'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.expandable',
   'ui.grid.importer','ui.grid.grouping','ngAria', 'chart.js'])
    .factory('authHttpResponseInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
        return {
          request: function (config) {
           if (window.host && /^\/api/i.test(config.url)) {
             config.url = window.host + config.url;
           }
            return config || $q.when(config);
          },

          response: function (response) {
            return response || $q.when(response);
          },

          responseError: function (rejection) {
            return $q.reject(rejection);
          }
        };
    }])
    .run(function ($rootScope) {
        $rootScope.test = new Date();
        $rootScope.pharmname = '';
        $rootScope.pharmid = 0;
        $rootScope.grname = "";
        $rootScope.grid = 0;
    })
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
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
                controller: 'MyCtrl3 as $ctrl'
            }).
            when('/view4', {
                templateUrl: 'partial4',
                controller: 'MyCtrl4 as $ctrl'
            }).
            when('/view7', {
                templateUrl: 'partial7',
                controller: 'MyCtrl7'
            }).
            when('/view8', {
                templateUrl: 'partial8',
                controller: 'MyCtrl8 as $ctrl'
            }).
            when('/view11', {
                templateUrl: 'partial11n',
                controller: 'MyCtrl11'
            }).
            when('/view12', {
                templateUrl: 'partial12n',
                controller: 'MyCtrl12 as $ctrl'
            }).
            when('/view13', {
                templateUrl: 'partial13n',
                controller: 'MyCtrl13'
            }).
            when('/view14', {
                templateUrl: 'partial14n',
                controller: 'MyCtrl14 as vm'
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
const fieldsList = [
    { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number' },
    { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
    { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type: 'number' },
    { name: 'Аптека', field: 'Ph_Name', width: '20%', enableCellEdit: false },
    { name: 'Филиал', field: 'Filial', enableCellEdit: false },
    { name: 'Категория', field: 'Categories', enableCellEdit: false },
    { name: 'Статус', field: 'M', enableCellEdit: false, type: 'number' },
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
    { name: 'ПКУ', field: 'PKU_agg', enableCellEdit: false, type: 'number' }
];
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
app.controller('MyCtrl3', ['$scope', '$http', 'exchange', 'i18nService', 'TableService', '$timeout', function ($scope, $http, exchange,i18nService, TableService, $timeout) {
    var vm = this;
    vm.msg = {};
    vm.exchange = exchange;
    i18nService.setCurrentLang('ru');
    $scope.deleteRow = function (row) {
        var index = vm.gridOptions.data.indexOf(row.entity);
        $scope.ondelete(row.entity,index);
        //vm.gridOptions.data.splice(index, 1);

    }
    vm.gridOptions = {
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
            vm.gridApi = gridApi;
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
              if (newValue != oldValue) {
                TableService.minQty05.apply(null, arguments);
                $http({
                  method: 'GET',
                  url: '/api/updatemx/' + rowEntity.Ph_ID + "/" + rowEntity.Gr_ID + "/" + rowEntity.MinQty + "/" + rowEntity.MinReq + "/" + rowEntity.Ratio + "/" + rowEntity.TempReq
                }).then(function (response) {
                  vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                  $scope.$apply();
                  //vm.gridOptions.data = response.data;
                }, function (data, status, headers, config) {
                  $scope.Result = 'Error!';
                });
              }
            });
            gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, 'gridState3', gridApi));
            gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, 'gridState3', gridApi));
            gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, 'gridState3', gridApi));
            gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, 'gridState3', gridApi));
            TableService.restoreState('gridState3', gridApi, $scope);
            $timeout(function () {
                gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, 'gridState3', gridApi));
            }, 100);
            //   gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            //
            //              exchange.grid = row.entity.Gr_ID;
            //                exchange.grname = row.entity.Gr_Name;
            //                exchange.phname = row.entity.Ph_Name;
            //                exchange.pharmid = row.entity.Ph_ID;
            //            });
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
            { name: 'X',width:'30', cellTemplate: '<button class="btn btn-outline-danger btn-sm" ng-click="grid.appScope.deleteRow(row)">X</button>'}
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
                $scope.loading = false;
            });

    }
    $scope.onaccept = function (pharm, $index) {
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
        if (pharm.Matrix > '') {
            $scope.rsp = 'ЗАПРЕЩЕНО';
            return;
        }
        $scope.rsp = '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID;
        $http({
                method: 'GET',
                url: '/api/deletemx/' + pharm.Ph_ID + "/" + pharm.Gr_ID
            }).
                then(function (response) {
                    $scope.rsp = response.data;
                    vm.gridOptions.data.splice($index, 1);
                },
                function (data, status, headers, config) {
                    $scope.Result = 'Error!';
                });
        
    };
    $scope.oncreate = function (pharm, $index) {
        //
        $scope.rsp = "добавление";
        $scope.checkadd = !$scope.checkadd;
        $scope.rsp = $scope.newgrpcode;
        if (!$scope.checkadd) {
            $http({
                method: 'GET',
                url: '/api/addmx/' + vm.exchange.pharmid + "/" + $scope.newgrpcode
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
        url: '/api/Resultmtrx/' + vm.exchange.pharmid
    }).
        then(function (response) {
            if (response.data.length > 0) {
                $scope.sent = response.data[0].sent > 0;
                // $scope.pharmname = data[0].ph_name;
                // $scope.pharmid = data[0].ph_id;
            };
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.Result = 'Error!';
        });

}]);
app.controller('MyCtrl4', ['$scope', '$http', '$location', '$rootScope', 'exchange', 'i18nService', function ($scope, $http, $location, $rootScope, exchange,i18nService) {
    var vm = this;
    vm.msg = {};
    vm.exchange = exchange;
    i18nService.setCurrentLang('ru');
    vm.gridOptions = {
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
            vm.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
              if (newValue != oldValue) {
                if (rowEntity.Req < rowEntity.qmin) rowEntity.Req = rowEntity.qmin;
                if (rowEntity.Req > rowEntity.qmax) rowEntity.Req = rowEntity.qmax;

                $http({
                  method: 'GET',
                  url: '/api/updaterq/' + rowEntity.Ph_ID + "/" + rowEntity.GrCode + "/" + rowEntity.Req
                }).then(function (response) {
                  vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                  $scope.$apply();
                  //vm.gridOptions.data = response.data;
                }, function (data, status, headers, config) {
                  $scope.Result = 'Error!';
                });
              }
            });
         //   gridApi.selection.on.rowSelectionChanged($scope, function (row) {
//
//              exchange.grid = row.entity.Gr_ID;
//                exchange.grname = row.entity.Gr_Name;
//                exchange.phname = row.entity.Ph_Name;
//                exchange.pharmid = row.entity.Ph_ID;
//            });
        },
        columnDefs: [
            { name: 'ГрКод', field: 'GrCode', enableCellEdit: false, type: 'number' },
            { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
            {
                name: 'Заявка', field: 'Req', enableCellEdit: true, type: 'number', cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (row.entity.MP === 0) {
                        return 'red';
                    }
                }
            },
            { name: 'Диапазон', field: 'Range', enableCellEdit: false, type: 'number' },
            { name: 'Кратность', field: 'Ratio', enableCellEdit: false, type: 'number' },
            { name: 'Мин Запас', field: 'MinQty', enableCellEdit: false, type: 'number' },
            { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: false, type: 'number' },
            { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
            { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
            { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
            { name: 'Цена закупки', field: 'PriceIn', enableCellEdit: false, type: 'number' },
            { name: 'Цена продажи', field: 'PriceOut', enableCellEdit: false, type: 'number' }
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
                $scope.loading = false;
            });

    }
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
        url: '/api/ResultRq/' + vm.exchange.pharmid
    }).
        then(function (response) {
            if (response.data.length > 0) {
                $scope.sent = response.data[0].sent > 0;
                if ($scope.sent) {
                    vm.gridOptions.columnDefs[2].enableCellEdit = false;
                };
            };
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.Result = 'Error!';
        });

}]);
app.controller('MyCtrl5', ['$scope', '$http', '$location', '$rootScope', 'exchange', 'i18nService', function ($scope, $http, $location, $rootScope, exchange,i18nService) {
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
        $scope.exchange.filial = $scope.pharms[$index].Filial;
        $location.path('/view4');
    };
    $http({
        method: 'GET',
        url: '/api/result'
    }).
        then(function (response) {
            console.log(response);
            $scope.pharms = response.data;
            $scope.exchange.filial = $scope.pharms[0].Filial;
        }, function (error) {
            $scope.result = 'Error!';
        });

}]);
app.controller('MyCtrl7', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', 'i18nService', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange,i18nService) {
    var vm = this;
    vm.msg = {};
    i18nService.setCurrentLang('ru');
    vm.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        MultiSelect: false,
        exporterMenuCsv: true,
        enableGridMenu: true,
//        expandableRowTemplate: 'expandableRowTemplate.html',
//        expandableRowHeight: 450,
       onRegisterApi: function (gridApi) {
              vm.gridApi = gridApi;
//            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
//                if (row.isExpanded) {
//                    row.entity.subGridOptions = {
//                        columnDefs: [
//                            { name: 'Наименование', field:'RGG_Name' },
//                            { name: 'Количество', field:'RequestB_Quantity' },
//                            { name: 'В заказе' ,field:'OrderB_Quantity'},
//                            { name: "Поставщик", field:'Contractor_Name' },
//                            { name: "В накладной", field:'Invoice_Number'},
//                            { name: "В отказе", field: 'Refuse_Qty'},
//                            { name: "Оприходовано", field: 'Receive_id'}
//                        ]
//                    };
//
 //                   $http.get('/api/request/' + row.entity.Request_ID)
  //                      .then(function (response) {
 //                           row.entity.subGridOptions.data = response.data;
 //                       });
 //               }
 //           });
        },
        columnDefs: [
            { name: "Код", field: "Request_ID", grouping: { groupPriority: 1 }, sort: { priority: 1, direction: 'desc' } },
            { name: "Статус", field: "State_Name"},
            { name: "Дата", field: "R_date",grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'desc' } },
            { name: "Источник", field: "Request_Generation_Method" },
            { name: "Комментарий", field: "Comments", type: 'number' },
            { name: 'Наименование', field:'Gr_Name' },
            { name: 'Количество', field:'RequestB_Quantity' },
            { name: 'В заказе' ,field:'OrderB_Quantity'},
            { name: "Поставщик", field:'Contractor_Name' },
            { name: "В накладной", field:'Invoice_Number'},
            { name: "В отказе", field: 'Refuse_Qty'},
            { name: "Оприходовано", field: 'Receive_id'}
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
        url: '/api/request/' + exchange.pharmid
    }).
        then(function (response) {
            vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';

        });


}]);
app.controller('MyCtrl8', ['$scope', '$http','$location', 'exchange', 'i18nService', 'TableService', '$timeout', function ($scope, $http,$location, exchange, i18nService, TableService, $timeout) {
    var vm = this;
    vm.msg = {};
    vm.exchange = exchange;
    i18nService.setCurrentLang('ru');
    $scope.deleteRow = function (row) {
        var index = vm.gridOptions.data.indexOf(row.entity);
        $scope.ondelete(row.entity, 0);
        vm.gridOptions.data.splice(index, 1);

    };
    vm.fieldsList = [
      { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number' },
      { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false },
      { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type: 'number' },
      { name: 'Аптека', field: 'Ph_Name', enableCellEdit: false },
      { name: 'Статус', field: 'M', enableCellEdit: false, type: 'number' },
      { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number' },
      { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number' },
      { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
      { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
      { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
      { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
      { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
      { name: 'Матрица', field: 'Matrix', enableCellEdit: false },
      { name: 'Маркетинг', field: 'Marketing', enableCellEdit: false },
      { name: 'Цена закупки', field: 'PriceIn', enableCellEdit: false, type: 'number' },
      { name: 'Цена продажи', field: 'PriceOut', enableCellEdit: false, type: 'number' },
      { name: 'Продажи30', field: 'Sales30', enableCellEdit: false },
      { name: 'Продажи60', field: 'Sales60', enableCellEdit: false }
    ];
    vm.gridOptions = {
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
            vm.gridApi = gridApi;
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
              if (newValue != oldValue) {
                TableService.minQty05.apply(null, arguments);
                $http({
                  method: 'GET',
                  url: '/api/updatemx/' + rowEntity.Ph_ID + "/" + rowEntity.Gr_ID + "/" + rowEntity.MinQty + "/" + rowEntity.MinReq + "/" + rowEntity.Ratio + "/" + rowEntity.TempReq
                }).then(function (response) {
                  vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                  $scope.$apply();
                  //vm.gridOptions.data = response.data;
                }, function (data, status, headers, config) {
                  $scope.Result = 'Error!';
                });
              }
            });
               gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            
                          exchange.grid = row.entity.Gr_ID;
                            exchange.grname = row.entity.Gr_Name;
                            exchange.phname = row.entity.Ph_Name;
                            exchange.pharmid = row.entity.Ph_ID;
                        });
          gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, 'gridState8', gridApi));
          gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, 'gridState8', gridApi));
          gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, 'gridState8', gridApi));
          gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, 'gridState8', gridApi));
          TableService.restoreState('gridState8', gridApi, $scope);
          $timeout(function () {
            gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, 'gridState8', gridApi));
          }, 100);
        },
        columnDefs: vm.fieldsList.concat([
            { name: 'X', width: '30', cellTemplate: '<button class="btn btn-outline-danger btn-sm" ng-click="grid.appScope.deleteRow(row)">X</button>' }
        ])
    };

    //$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    //  .then(function(response) {
    //    vm.gridOptions.data = response.data;
    //    });

    $scope.onClick = function () {
      $scope.loading = true;
      $http.post('/api/Resultmtrxn/', { conds: [{ field: 'Filial', cond: 'eq', value: vm.exchange.filial }].concat(vm.exchange.conditions) })
        .then(function (response) {
          if (response.data.length > 0) {
            $scope.sent = response.data[0].sent > 0;
          }
          vm.gridOptions.data = response.data;
        }, function (data, status, headers, config) {
          $scope.Result = 'Error!';
        })
        .finally(function() {
          $scope.loading = false;
        });
    };

    $scope.onaccept = function (pharm, $index) {
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
        if (pharm.Matrix > '') {
            $scope.rsp = 'ЗАПРЕЩЕНО'
            return;
        }
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
        //$scope.mtrx.splice($index, 1);
    };
    $scope.oncreate = function (pharm, $index) {
        //
        $scope.rsp = "добавление";
        $scope.checkadd = !$scope.checkadd;
        $scope.rsp = $scope.newgrpcode;
        if (!$scope.checkadd) {
            $http({
                method: 'GET',
                url: '/api/addmx/' + vm.exchange.pharmid + "/" + $scope.newgrpcode
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

    $scope.onClick();

}]);
app.controller('MyCtrl12', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', 'i18nService','save12', 'TableService', '$timeout', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange, i18nService,save12, TableService, $timeout) {
  var vm = this;
  var rowTemplate = function() {
    return '<div ng-class="{green: row.entity.Action, yellow: row.entity.isLocal}" ' +
      'ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ui-grid-one-bind-id-grid="rowRenderIndex + \'-\' + col.uid + \'-cell\'" ' +
      'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader}" role="gridcell" ui-grid-cell></div>';
  };
  var applyLoading = function (value) {
    $scope.$apply(function () {
      $scope.loading = value;
    });
  };

  var parseFile = function (rows) {
    var headers = {};
    var results = [];
    var columnKeys = {};
    vm.gridOptions.columnDefs.forEach(function (item) {
      columnKeys[item.name] = item.field;
    });
    rows[0].forEach(function (name, index) {
      if (name && columnKeys[name]) {
        headers[index] = columnKeys[name];
      }
    });
    if (Object.keys(headers).length) {
      rows.forEach(function (row, index) {
        if (index > 0) {
          var json = {};
          row.forEach(function (value, index) {
            if (headers[index]) {
              json[headers[index]] = value;
            }
          });
          if (Object.keys(json).length) {
            json.isLocal = true;
            results.push(json);
          }
        }
      });
      if (results.length) {
        $scope.fileData = results;
        vm.gridOptions.data = $scope.fileData.concat($scope.serverData);
      }
    }
  };

  var readCSV = function (file, columnKeys) {
    var reader = new FileReader();
    reader.onload = function(event) {
      $scope.$apply(function () {
        parseFile(CSV.parse(event.target.result));
        $scope.loading = false;
      });
    };
    reader.onerror = function () {
      applyLoading(false);
    };
    $scope.loading = true;
    reader.readAsText(file);
  };

  var readXLS = function (file, columnKeys) {
    var reader = new FileReader();
    reader.onload = function(event) {
      new ExcelJS.Workbook().xlsx
        .load(event.target.result)
        .then(function (workbook) {
          var rows = [];
          workbook.worksheets[0].eachRow(function (row, rowNumber) {
            rows.push(row.values);
          });
          return parseFile(rows);
        })
        .then(function () {
          applyLoading(false);
        });
    };
    reader.onerror = function () {
      $scope.loading = false;
    };
    $scope.loading = true;
    reader.readAsArrayBuffer(file);
  };
  vm.msg = {};
  vm.exchange = exchange;
  vm.matrix = false;
  vm.matrixlabel = "Все";
  $scope.checkadd = false;
  i18nService.setCurrentLang('ru');
  vm.fieldsList = fieldsList.concat(
    { name: 'Акция', field: 'Action', enableCellEdit: true },
    { name: 'Продажи30', field: 'Sales30', enableCellEdit: false },
    { name: 'Продажи60', field: 'Sales60', enableCellEdit: false }
  );
  $scope.fileData = [];
  $scope.serverData = [];
  vm.gridOptions = {
      enableFiltering: true,
      enableEditing: true,
      exporterMenuCsv: true,
      enableGridMenu: true,
//      enableRowSelection: true,
      enableRowHeaderSelection:true,
      multiSelect: false,
      showGridFooter: true,
      enableCellEditOnFocus: true,
      onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
              //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
              if (newValue != oldValue) {
                  TableService.minQty05.apply(null, arguments);
                $http.post('/api/updatemx/', rowEntity).then(function (response) {
                  vm.msg.lastCellEdited = 'Изменено строка:' + rowEntity.Gr_ID + ' Столбец:' + colDef.name + ' Было:' + oldValue + ' Стало:' + newValue;
                  $scope.$apply();
                  //vm.gridOptions.data = response.data;
                }, function (data, status, headers, config) {
                  $scope.Result = 'Error!';
                });
              }
          });
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              
              exchange.grid = row.entity.Gr_ID;
              exchange.grname = row.entity.Gr_Name;
              exchange.phname = row.entity.Ph_Name;
              exchange.pharmid = row.entity.Ph_ID;
              exchange.entity = row.entity;
          });
          gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, 'gridState12', gridApi));
          gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, 'gridState12', gridApi));
          gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, 'gridState12', gridApi));
          gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, 'gridState12', gridApi));
          TableService.restoreState('gridState12', gridApi, $scope);
          $timeout(function () {
            gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, 'gridState12', gridApi));
          }, 100);
    },
    columnDefs: [
      { name: 'ГрКод', field: 'Gr_ID', enableCellEdit: false, type: 'number', allowCellFocus: false },
      { name: 'Наименование', field: 'Gr_Name', width: '30%', enableCellEdit: false, allowCellFocus: false },
      { name: 'Код', field: 'Ph_ID', enableCellEdit: false, type: 'number', allowCellFocus: false},
      { name: 'Аптека', field: 'Ph_Name', width: '20%', enableCellEdit: false, allowCellFocus: false},
      { name: 'Филиал', field: 'Filial', enableCellEdit: false },
      { name: 'Категория', field: 'Categories', enableCellEdit: false },
      { name: 'Статус', field: 'M', enableCellEdit: false, type: 'number' },
      { name: 'Кратность', field: 'Ratio', enableCellEdit: true, type: 'number' },
      { name: 'Мин Запас', field: 'MinQty', enableCellEdit: true, type: 'number' },
      { name: 'Мин Заказ', field: 'MinReq', enableCellEdit: true, type: 'number' },
      { name: 'Врем Заказ', field: 'TempReq', enableCellEdit: true, type: 'number' },
      { name: 'Скорость 30 дн', field: 'CalcVel30', enableCellEdit: false, type: 'number' },
      { name: 'Остаток', field: 'Ost', enableCellEdit: false, type: 'number' },
      { name: 'В пути', field: 'Wait', enableCellEdit: false, type: 'number' },
      { name: 'Заказано', field: 'Req', enableCellEdit: false, type: 'number' },
      { name: 'Матрица', field: 'Matrix', enableCellEdit: true },
      { name: 'Рейтинг', field: 'Rating', enableCellEdit: true },
      { name: 'Маркетинг', field: 'Marketing', enableCellEdit: true },
      { name: 'Сезон', field: 'Season', enableCellEdit: true },
      { name: 'Тип товара', field: 'RGT_agg', enableCellEdit: false },
      { name: 'Фармгруппа', field: 'RFG_agg', enableCellEdit: false },
      { name: 'ПКУ', field: 'PKU_agg', enableCellEdit: false, type: 'number' },
      { name: 'Акция', field: 'Action', enableCellEdit: true },
      { name: 'Продажи30', field: 'Sales30', enableCellEdit: false },
      { name: 'Продажи60', field: 'Sales60', enableCellEdit: false }
    ],
    rowTemplate: rowTemplate()
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
        $http.post('/api/ResultMtrxn/', {
          conds:vm.exchange.conditions
        })
          .then(function (response) {
                //           var data = response.data;
                //           for (var i = 0; i < 6; i++) {
                //               data = data.concat(data);
                //           }
                $scope.serverData = response.data;
                vm.gridOptions.data = $scope.fileData.concat($scope.serverData);
                // $scope.loadMore();
            }, function (data, status, headers, config) {
                $scope.Resulta = 'Error!';
          })
          .finally(function () {
            $scope.loading = false;
          });
  };

  $scope.onFile = function (files) {
    if (!files[0]) {
        return false;
    }
    if (!/\.(csv|xls|xlsx)$/.test(files[0].name)) {
        return false;
    }
    if (/\.csv$/.test(files[0].name)) {
      return readCSV(files[0]);
    } else {
      return readXLS(files[0]);
    }
  };

  $scope.onSend = function () {
    if (!$scope.fileData.length) {
      return false;
    }
    alert('отправка ' + $scope.fileData.length + ' записей');
    $scope.loading = true;
    $http.post('/api/test/', {items: $scope.fileData})
        .then(function (response) {

        }, function (data, status, headers, config) {
            $scope.Result = 'Error!';
        })
        .finally(function () {
            $scope.loading = false;
        });
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
              vm.gridOptions.data = response.data;
          }, function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
  };
  $scope.onaccept = function (phаrm, $index) {
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
  $scope.onDelete = function () {

      //
      $scope.rsp = "удаление" + vm.exchange.Gr_Name;
     // $scope.rsp = '/api/deletemx/' + exchange.Ph_ID + "/" + exchange.Gr_ID;
      $http.post('/api/deletemx/' ,exchange.entity).
          then(function (response) {
             vm.gridOptions.data[vm.gridOptions.data.indexOf(exchange.entity)] = response.data;
      },
          function (data, status, headers, config) {
              $scope.Result = 'Error!';
          });
  //    vm.GridOptions.data.splice(GridOptions.data.splice.indexOf(vm.exchange.entity), 1);
  };
  $scope.onAdd = function (pharm, $index) {
      //
      $scope.rsp = "добавление";
 //     $scope.checkadd = !$scope.checkadd;
      console.log(vm.gridOptions.data.indexOf(exchange.entity));
      console.log(vm.gridOptions.data[vm.gridOptions.data.indexOf(exchange.entity)])
      if (exchange.entity.M == 'Н') {
          $http.post('/api/addmx/',  exchange.entity).
              then(function (response) {
                  vm.gridOptions.data[vm.gridOptions.data.indexOf(exchange.entity)] = response.data;
                  
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
  if ((vm.exchange.conditions.length > 0)) {
      $scope.onClick();
  };
  $scope.onCheck = function () {
      vm.matrixlabel = vm.matrix ? "Все":"Матрица" ;
  }
//  $scope.$on('$routeChangeStart', function () {
//      console.log('location12', $location.path());
//      save12.savestate = vm.gridApi.saveState.save();
//      save12.data = vm.gridOptions.data;
//  });
}]);
app.controller('MyCtrl11', ['$scope', '$http', '$interval', 'uiGridConstants', '$rootScope', '$location', 'exchange', 'i18nService','save11','$cookies', function ($scope, $http, $interval, uiGridConstants, $rootScope, $location, exchange, i18nService,save11,$cookies) {
    var vm = this;
    vm.msg = { };
    i18nService.setCurrentLang('ru');
    vm.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        MultiSelect: false,
        enableCellEditOnFocus: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //rowEntity.MinQty = rowEntity.MinQty.replace(",", ".");
                $http.post('/api/updateph/', rowEntity).
                    then(function (response) {
                        vm.msg.lastCellEdited = 'edited row id:' + rowEntity.Gr_ID + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                        $scope.$apply();
                        //vm.gridOptions.data = response.data;
                    }, function (data, status, headers, config) {
                        $scope.Result = 'Error!';
                    });
            });
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                exchange.phname = row.entity.Ph_Name;
                exchange.pharmid = row.entity.Ph_ID;
            });
            gridApi.colMovable.on.columnPositionChanged($scope, saveState);
            gridApi.colResizable.on.columnSizeChanged($scope, saveState);
            //          gridApi.grouping.on.aggregationChanged($scope, saveState);
            //          gridApi.grouping.on.groupingChanged($scope, saveState);
            gridApi.core.on.columnVisibilityChanged($scope, saveState);
            gridApi.core.on.filterChanged($scope, saveState);
            gridApi.core.on.sortChanged($scope, saveState);
            restoreState();
       },
        columnDefs: [
            { name: "Код", field: "Ph_ID" , enableCellEdit:false},
            { name: "Наименование", field: "Ph_Name", width: "30%", enableCellEdit: false },
            { name: "Филиал", field: "Filial", enableCellEdit: false},
            { name: "Тип", field: "Type", enableCellEdit: false},
            { name: "Страховой запас", field: "D_A", type: "number",  enableCellEdit: true},
            { name: "Дней доставки", field: "D_D", type: "number", enableCellEdit: true },
            { name: "Дней продаж", field: "D_T", type: "number", enableCellEdit: true},
            { name: "Kmin", field: "Kmin", type: "number", enableCellEdit: true },
            { name: "Kmax", field: "Kmax", type: "number", enableCellEdit: true },
            { name: "Категория", field: "Categories", enableCellEdit: true},
            { name: "График", field: "graph", enableCellEdit: true }
        ]
    };
    vm.exchange = exchange;
    vm.onmatrix = function () {
         //  exchange.pharmid = 1;
           exchange.grid = 0;
        //   exchange.phname = 'testph';
           exchange.grname = '';
           exchange.conditions.push({field:'Ph_ID',cond:'eq',value:exchange.pharmid})
        $location.path('/view12');
    }
    $scope.loading = true;
    $http({
        method: 'GET',
        url: '/api/Result'
    }).
        then(function (response) {
            vm.gridOptions.data = response.data;
            restoreState();
            $scope.loading = false;
        }, function (data, status, headers, config) {
            $scope.result = 'Error!';
            $scope.loading = false;

        });
 //   $scope.$on('$routeChangeStart', function () {
 //       console.log('location11', $location.path());
 //   });
    function saveState() {
        var state = $scope.gridApi.saveState.save();
        $cookies.put('gridState11', JSON.stringify(state));
  //      $scope.rsp = state;
    }
    function restoreState() {
        if ($cookies.get('gridState11')) {
            var restorestate = JSON.parse($cookies.get('gridState11'));
            if ($scope.gridApi) $scope.gridApi.saveState.restore($scope, restorestate);
        };


    }
    $scope.onrestore = function () {
        restoreState();
    }

//    restoreState();
}]);
app.controller('MyCtrl13', function ($scope, $http,$rootScope,exchange,save13) {
    var vm = this;
    var download = function () {
      var wb = new ExcelJS.Workbook();
      var ws = wb.addWorksheet('Статистика');
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
      $scope.myData.forEach(function (item) {
        var clone = Object.assign({} , item);
        clone.Gr_Name = exchange.grname;
        clone.Ph_Name = exchange.phname;
        ws.addRow(clone);
      });
      wb.xlsx.writeBuffer()
        .then(function (data) {
            var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, "Статистика.xlsx");
          }).catch(function (err) {
              console.log(err)
          });
    };

    $scope.exchange = exchange;
    $scope.colors = ['#00ffff', '#007f00', '#0000ff', '#7f7f00', '#ff0000', '#ff0000', '#007f00'];

    $scope.myData = [];
    $scope.labels = [];
    $scope.data = [];
    $scope.data.push([]);
    $scope.data.push([]);
    $scope.data.push([]);

    $scope.onDownloadClick = function () {
        if (!$scope.myData.length) {
            $scope.onsearch(true);
        } else {
            download();
        }
    };

    $scope.onsearch = function (isDownload) {
        $scope.loading = true;
        $http({
            method: 'GET',
            url: '/api/sales/' + $scope.exchange.pharmid + "/" + $scope.exchange.grid
        })
            .then(function (response) {
                $scope.myData = response.data;
                if (isDownload) {
                  download();
                  return false;
                }
                  if ($scope.myData.length > 0) {
                    $scope.Ph_Name = $scope.exchange.phname;
                    $scope.Gr_Name = $scope.exchange.grname;
                  }
                  $scope.labels = [];
                  $scope.data = [];
                  $scope.data.push([]);
                  $scope.data.push([]);
                  $scope.data.push([]);
                  $scope.data.push([]);
                  $scope.data.push([]);
                  $scope.data.push([]);
                  $scope.data.push([]);
                  for (var i = 0; i < $scope.myData.length; i++) {
                    $scope.labels.push($scope.myData[i].dat)
                    $scope.data[0].push($scope.myData[i].Ost)
                    $scope.data[1].push($scope.myData[i].Qty)
                    $scope.data[2].push($scope.myData[i].Sal)
                    $scope.data[3].push($scope.myData[i].Rec)
                    $scope.data[4].push($scope.myData[i].Vel)
                    if ($scope.myData[i].Req > 0)
                      $scope.data[5].push(0)
                    else
                      $scope.data[5].push(NaN);
                    if ($scope.myData[i].Reqa > 0)
                      $scope.data[6].push(0)
                    else
                      $scope.data[6].push(NaN);
                  }
            }, function (data, status, headers, config) {
                $scope.result = 'Error!';
            })
            .finally(function() {
              $scope.loading = false;
            });

    };
    $scope.options = {
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
    $scope.series = ["Остатки", "Мин Запас", "Продажи", "Приходы", "Скорость", "Автозаказ","Заказ"];
    $scope.datasetOverride = [
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
    if (($scope.exchange.pharmid != 0) && ($scope.exchange.entity.Gr_ID != 0)) {
        $scope.onsearch();
    };
});
app.controller('MyCtrl14', ['$scope', '$http', '$timeout', 'uiGridConstants', '$rootScope', 'exchange', 'i18nService', 'TableService', function ($scope, $http, $timeout, uiGridConstants, $rootScope, exchange, i18nService, TableService) {
  var vm = this;
  i18nService.setCurrentLang('ru');
  vm.exchange = exchange;
  vm.selected = null;
  vm.conditionsTransfer = [];
  vm.fieldsListTransfer = [
    { name: 'ГрКод', field: 'Gr_ID', type: 'number', enableCellEdit: false },
    { name: 'Наименование', field: 'Gr_Name', enableCellEdit: false },
    { name: 'Код', field: 'Ph_ID', type: 'number', enableCellEdit: false },
    { name: 'Аптека', field: 'Ph_Name', enableCellEdit: false },
    { name: 'Сверхнорматив', field: 'DS', type: 'number', enableCellEdit: false },
    { name: 'Куда Код', field: 'toPh_ID', type: 'number', enableCellEdit: false },
    { name: 'Куда Аптека', field: 'toPh_Name', enableCellEdit: false },
    { name: 'Скорость продаж', field: 'CalcVel', type: 'number', enableCellEdit: false },
    { name: 'Остаток', field: 'Ost', type: 'number', enableCellEdit: false },
    { name: 'Заявка', field: 'Req', enableCellEdit: false }
  ];
  vm.fieldsListDS = fieldsList.concat(
    { name: 'Акция', field: 'Action', enableCellEdit: true },
    { name: 'Продажи30', field: 'Sales30', enableCellEdit: false },
    { name: 'Продажи60', field: 'Sales60', enableCellEdit: false },
    { name: 'Сверхнормативы', field: 'DS', enableCellEdit: false }
  );
  vm.gridOptionsTransfer = {
    enableSorting: true,
    enableFiltering: true,
    multiSelect: false,
    enableRowHeaderSelection:true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    onRegisterApi: function (gridApi) {
      vm.gridApiTransfer = gridApi;
      gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, 'gridState14-1', gridApi));
      gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, 'gridState14-1', gridApi));
      gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, 'gridState14-1', gridApi));
      gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, 'gridState14-1', gridApi));
      TableService.restoreState('gridState14-1', gridApi, $scope);
      $timeout(function () {
        gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, 'gridState14-1', gridApi));
      }, 100);
    },
    columnDefs: vm.fieldsListTransfer
  };
  vm.gridOptionsDS = {
    enableSorting: true,
    enableFiltering: true,
    multiSelect: false,
    enableRowHeaderSelection:true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    onRegisterApi: function (gridApi) {
      vm.gridApiDS = gridApi;
      gridApi.colMovable.on.columnPositionChanged($scope, TableService.saveState.bind(null, 'gridState14', gridApi));
      gridApi.colResizable.on.columnSizeChanged($scope, TableService.saveState.bind(null, 'gridState14', gridApi));
      gridApi.core.on.filterChanged($scope, TableService.saveState.bind(null, 'gridState14', gridApi));
      gridApi.core.on.sortChanged($scope, TableService.saveState.bind(null, 'gridState14', gridApi));
      TableService.restoreState('gridState14', gridApi, $scope);
      $timeout(function () {
        gridApi.core.on.columnVisibilityChanged($scope, TableService.saveState.bind(null, 'gridState14', gridApi));
      }, 100);
    },
    columnDefs: vm.fieldsListDS
  };

  vm.onGetDS = function () {
      if (!exchange.conditions.length) {
          return false;
      }
    vm.loading = true;
    $http.post('/api/overnorm/', {
      conds: exchange.conditions
    })
      .then(function (response) {
        vm.gridOptionsDS.data = response.data;
      }, function (data, status, headers, config) {
        vm.Resulta = 'Error!';
      })
      .finally(function () {
        vm.loading = false;
      });
  };

  vm.onGetTransfer = function () {
    if (!vm.conditionsTransfer.length) {
      return false;
    }
    vm.loading = true;
    $http.post('/api/transferto/', {
      conds: vm.conditionsTransfer
    })
      .then(function (response) {
        vm.gridOptionsTransfer.data = response.data;
      }, function (data, status, headers, config) {
        vm.Resulta = 'Error!';
      })
      .finally(function () {
        vm.loading = false;
      });
  };

  vm.onMove = function () {
    vm.selected = vm.gridApiDS.selection.getSelectedRows()[0];
    vm.conditionsTransfer = [];
    if (vm.selected) {
      vm.fieldsListTransfer.forEach(function (item) {
          if (item.type === 'number' && vm.selected[item.field]) {
            vm.conditionsTransfer.push({
              cond: 'eq',
              field: item.field,
              value: vm.selected[item.field],
              type: 'number'
            });
          }
      });
      vm.onGetTransfer();
    }
  };

  vm.onTransfer = function () {
    var selected = vm.gridApiTransfer.selection.getSelectedRows()[0];
    if (selected) {
      vm.loading = true;
      $http.post('/api/transfer/', selected)
        .then(function (response) {
          vm.onGetTransfer();
        }, function (data, status, headers, config) {
          vm.Resulta = 'Error!';
        })
        .finally(function () {
          vm.loading = false;
        });
    }
  };

  vm.onBack = function () {
    vm.selected = null;
  };

  if (exchange.conditions.length) {
      vm.onGetDS();
  }

}]);
app.factory('exchange', function () {
    return ({
        pharmid: 0,
        phname: '',
        grid: 0,
        grgrid:0,
        grname: '',
        filial: '',
        entity: {},
        conditions: [],
        period:30
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
});
app.factory('save13', function () {
    return ({
        savestate: {},
        data: []
    })
});
app.factory('$localStorage', ['$cookies', function ($cookies) {
  var isLocalStorageSupportedFn = function () {
    var testKey = 'test', storage = window.localStorage;
    try {
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  };
  const isLocalStorageSupported = isLocalStorageSupportedFn();
  return {
    get: function (key) {
        var data = isLocalStorageSupported ? localStorage.getItem(key) : $cookies.get(key);
        var parsed = null;
        try {
            parsed = JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
        return parsed;
    },
    set: function (key, value) {
        isLocalStorageSupported ? localStorage.setItem(key, JSON.stringify(value)) : $cookies.put(key, JSON.stringify(value));
    },
    remove: function (key) {
        isLocalStorageSupported ? localStorage.removeItem(key) : $cookies.remove(key);
    }
  }
}]);
app.factory('TableService', ['$localStorage', '$timeout', function ($localStorage, $timeout) {
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
}]);
app.directive('phFilter', [function () {
  return {
    restrict: "E",
    scope: {
      conditions: "=",
      fields: "=",
      onSelect: "&"
    },
    templateUrl: 'filter',
    link: function (scope, element, attrs) {
      scope.compList = [
        {
          val: "eq",
          label: "равно"
        },
        {
          val: "neq",
          label: "не равно"
        },
        {
          val: "cn",
          label: "содержит"
        },
        {
          val: "ncn",
          label: "не содержит"
        },
        {
          val: "nl",
          label: "пусто"
        },
        {
          val: "nnl",
          label: "не пусто"
        },
        {
          val: "gt",
          label: "больше"
        },
        {
          val: "lt",
          label: "меньше"
        }
      ];
      scope.showCondition = function (value, cond) {
        if (['gt', 'lt'].indexOf(value) === -1 || !cond.field) {
          return true;
        }
        return cond.type === 'number';
      };

      scope.changeField = function ($index) {
        var condition = scope.conditions[$index];
        var found = scope.fields.filter(function (item) {
          return item.field === condition.field;
        })[0];
        condition.type = found.type;
      };

      scope.ondelcond = function ($index) {
        scope.conditions.splice($index, 1);
      };

      scope.onaddcond = function () {
        scope.conditions.push({ field: '', cond: '', val: '' });
      }

    }
  }
}]);
app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    scope: {
      customOnChange: '&'
    },
    link: function (scope, element, attrs) {
      element.on('change', function (e) {
          scope.$apply(function () {
            scope.customOnChange({files: e.target.files});
          });
      });
      element.on('$destroy', function() {
        element.off();
      });
    }
  };
});
app.directive('loading', function() {
  return {
    restrict: 'A',
    scope: {
      loading: '='
    },
    template: '<div ng-if="loading"><i class="fa fa-spinner fa-spin"></i>Загрузка ...</div>'
  };
});
