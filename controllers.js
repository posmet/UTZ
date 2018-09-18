'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('AppCtrl',function ($scope,$http,$rootScope) {
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
            },function (data, status, headers, config) {
                $scope.name = 'Error!';
            });
    
    }).
    controller('MyCtrl1', function ($scope, $http) {
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
            },function (data, status, headers, config) {
                $scope.result = 'Error!';
            });

    }).
    controller('MyCtrl2', function ($scope) {
                    //todo
    }).
    controller('MyCtrl3', function ($scope, $http) {
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
        $scope.onsearch = function(){
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
              },function (data, status, headers, config) {
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
        $scope.oncreate = function (pharm,$index) {
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
            },function (data, status, headers, config) {
                $scope.Resulta = 'Error!';
            });

    }).
    controller('MyCtrl4',function ($scope, $http,$location,$rootScope) {
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
                },function (data, status, headers, config) {
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
            $scope.editable=false;
            $http({
                method: 'GET',
                url: '/api/updaterq/' + pharm.Ph_ID + "/" + pharm.GrCode + "/" + pharm.Req
            }).
                then(function (response) {
                    $scope.rsp = response.data;
                },function (data, status, headers, config) {
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
            },function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });

    }).
    controller('MyCtrl5', function ($scope, $http,$location,$rootScope) {
        //$scope.exfac = exchange;
        $scope.pharmname = 'Тестовая аптека';
        $scope.pharmid = 1;

        $scope.clickph = function(pharm,$index){
            $scope.pharmid = $scope.pharms[$index].Ph_ID;
            $scope.pharmname = $scope.pharms[$index].Ph_Name;
            $rootScope.pharmid = $scope.pharms[$index].Ph_ID;
            $rootScope.pharmname = $scope.pharms[$index].Ph_Name;
            $location.path('/view4');
        };
        $http({
            method: 'GET',
            url: '/api/result'
        }).
            then(function (response) {
                $scope.pharms = response.data;
            },function (error) {
                $scope.result = 'Error!';
            });

    }).
    controller('MyCtrl11', function ($scope, $http) {
        var vm = this;
        $scope.ed1 = false;
        $scope.ed2 = false;
        $scope.ed3 = false;

        $http({
            method: 'GET',
            url: '/api/Result'
        }).
            then(function (response) {
                $scope.myData = response.data;
                $scope.gridOptions = {
                    enableSorting: true,
                    enableFiltering: true,
                    columnDefs: [
                        { name: "Код", field: "Ph_ID" },
                        { name: "Наименование", field: "Ph_Name" },
                        { name: "Страховой запас", field: "D_A" },
                        { name: "Дней доставки", field: "D_D" },
                        { name: "Дней заказа", field: "D_T" },
                        { name: "Категория", field: "Categories" }
                    ],
                    data: $scope.myData
                };
            }, function (data, status, headers, config) {
                $scope.result = 'Error!';

            });


    }).
    controller('MyCtrl12', function ($scope, $http) {
        $scope.myData = [
            {
                f1: "yyeuien",
                f2: "uwoek",
                f3: 2222
            },
            {
                f1: "yyedfhuien",
                f2: "uwdfghoek",
                f3: 777
            },
            {
                f1: "yyeuhdgien",
                f2: "uwhfdgoek",
                f3: 333
            },
            {
                f1: "yyeusdfgien",
                f2: "uwsdfgoek",
                f3: 3332
            },
            {
                f1: "yyfgeuien",
                f2: "uwsdfgoek",
                f3: 255
            },
            {
                f1: "yyeuieern",
                f2: "uworghek",
                f3: 2666
            },
            {
                f1: "yyeuien",
                f2: "uwrtgoek",
                f3: 2222
            },
            {
                f1: "yyegtuien",
                f2: "uwrtoek",
                f3: 2222
            },
            {
                f1: "yyeuien",
                f2: "uwrtgoek",
                f3: 2444222
            },
            {
                f1: "yyrteuien",
                f2: "uwrtoek",
                f3: 6666
            },
            {
                f1: "yyertguien",
                f2: "uwoek",
                f3: 4444
            },
        ]
        $scope.newphcode = "";
        $scope.newgrpcode = "";
        $scope.checkadd = false;
        $scope.loading = false;
        $scope.onClick = function () {
            if (!$scope.searchPh) {
                $scope.searchPh = 0;
            }
            if (!$scope.searchGrp) {
                $scope.searchGrp = 0;
            }
            $scope.loading = true;
            $http({
                method: 'GET',
                url: '/api/ResultMtrxa/' + $scope.searchPh + '/' + $scope.searchGrp
            }).
                then(function (response) {
                    $scope.mtrx = response.data;
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
                    $scope.rsp = response.data;
                }, function (data, status, headers, config) {
                    $scope.Result = 'Error!';
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
                    $scope.mtrx = response.data;
                    // $scope.loadMore();
                }, function (data, status, headers, config) {
                    $scope.Resulta = 'Error!';
                });

        }
    }).
    controller('MyCtrl13', function ($scope, $http) {
        var vm = this;
        $scope.ed1 = false;
        $scope.ed2 = false;
        $scope.ed3 = false;
        $scope.searchGrp = 0;
        $scope.searchPh = 0;
        $scope.Ph_Name = "";
        $scope.Gr_Name = "";
        $scope.onsearch = function () {
            $http({
                method: 'GET',
                url: '/api/sales/' + $scope.searchPh + "/" + $scope.searchGrp 
            }).
                then(function (response) {
                    $scope.myData = response.data;
                    if (length($scope.myData) > 0) {
                        $scope.Ph_Name = $scope.myData[0].Ph_Name;
                        $scope.Gr_Name = $scope.myData[0].RGG_Name;
                    }
                    $scope.gridOptions = {
                        enableSorting: true,
                        enableFiltering: true,
                        columnDefs: [
                            { name: "Код", field: "Ph_ID" },
                            { name: "Наименование", field: "Ph_Name" },
                            { name: "Страховой запас", field: "D_A" },
                            { name: "Дней доставки", field: "D_D" },
                            { name: "Дней заказа", field: "D_T" },
                            { name: "Категория", field: "Categories" }
                        ],
                        data: $scope.myData
                    };
                }, function (data, status, headers, config) {
                    $scope.result = 'Error!';

                });

        };
    }).
    controller('MyCtrl14', function ($scope) {
        $scope.reports = [{ name: "Параметры" },
            {
                name: "Контроль исполнения заявок"
            },
            { name: "GRP по торговым точкам" },
            { name: "Показатели УТЗ и УА" },
            { name: "Показатели по торговым точкам" },
            { name: "Контроль Тест" },
            { name: "Показатели категорий товаров" },
            { name: "Перечень мертвые" },
            { name: "GRP по всем ассортиментным матрицам  с основными параметрами" },
            { name: "Вне ассортиментных матриц" },
            {
                name: "GRP для утверждения приоритетов"
            }]

    });