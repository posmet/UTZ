'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('AppCtrl',function ($scope,$http) {
        $scope.exfac = exchange;
        $http({
            method: 'GET',
            url: '/api/name'
        }).
            success(function (data, status, headers, config) {
                $scope.name = data.name;
            }).
            error(function (data, status, headers, config) {
                $scope.name = 'Error!';
            });
    
    }).
    controller('MyCtrl1', function ($scope, $http,exchange) {
        $scope.exfac = exchange;
        $scope.pharmname = '';
        $scope.pharmid = 0;
       // $scope.clickph = function(pharm,index){
       //     $scope.pharmid = index;
       // };
        $http({
            method: 'GET',
            url: '/api/Result'
        }).
            success(function (data, status, headers, config) {
                $scope.result = data;
            }).
            error(function (data, status, headers, config) {
                $scope.result = 'Error!';
            });

    }).
    controller('MyCtrl2', function ($scope) {
                    //todo
    }).
    controller('MyCtrl3', function ($scope, $http) {
        $scope.test = 'test2';
        $http({
            method: 'GET',
            url: '/api/ResultMtrx'
        }).
            success(function (data, status, headers, config) {
                $scope.mtrx = data;
            }).
            error(function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });

    }).
    controller('MyCtrl4', function ($scope, $http) {
        $scope.test = 'test2';
        $http({
            method: 'GET',
            url: '/api/ResultRq'
        }).
            success(function (data, status, headers, config) {
                $scope.rq = data;
            }).
            error(function (data, status, headers, config) {
                $scope.Result = 'Error!';
            });

    });