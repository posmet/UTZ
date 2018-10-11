'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngTouch',
  'myApp.controllers',
  'infinite-scroll'
]).
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
          controller: 'MyCtrl7'
      }).
      when('/view8', {
          templateUrl: 'partial8',
          controller: 'MyCtrl8'
      }).
      when('/view11', {
          templateUrl: 'partial11',
          controller: 'MyCtrl1'
      }).
      when('/view12', {
          templateUrl: 'index2',
          controller: 'MyCtrl2'
      }).
      when('/view13', {
          templateUrl: 'partial13',
          controller: 'MyCtrl3'
      }).
      when('/view14', {
          templateUrl: 'partial14',
          controller: 'MyCtrl14'
      }).
      when('/view15', {
          templateUrl: 'partial15',
          controller: 'MyCtrl15'
      }).
      when('/view21', {
          templateUrl: 'partial21',
          controller: 'MyCtr21'
      }).
      when('/view22', {
          templateUrl: 'partial22',
          controller: 'MyCtr22'
      }).
      when('/view23', {
          templateUrl: 'partial23',
          controller: 'MyCtr23'
      }).
      when('/view24', {
          templateUrl: 'partial24',
          controller: 'MyCtr24'
      }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
