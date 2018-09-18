'use strict';

/* Controllers */

angular.module('myApp.controllers',[]).
    controller('AppCtrl', function ($scope, $http, $rootScope) {
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
            }, function (data, status, headers, config) {
                $scope.result = 'Error!';
            });

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

    }).
    controller('MyCtrl4', function ($scope, $http, $location, $rootScope) {
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

    }).
    controller('MyCtrl5', function ($scope, $http, $location, $rootScope) {
        //$scope.exfac = exchange;
        $scope.pharmname = 'Тестовая аптека';
        $scope.pharmid = 1;

        $scope.clickph = function (pharm, $index) {
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
            }, function (error) {
                $scope.result = 'Error!';
            });

    }); 
   