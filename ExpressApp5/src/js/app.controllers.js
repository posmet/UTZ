import angular from 'angular';
import AppCtrl from './controllers/main';
import LoginCtrl from './controllers/login/login';
import View1Ctrl from './controllers/view1/view1';
import View4Ctrl from './controllers/view4/view4';

export default angular.module('app.controllers', [])
  .controller('AppCtrl', AppCtrl)
  .controller('LoginCtrl', LoginCtrl)
  .controller('View1Ctrl', View1Ctrl)
  .controller('View4Ctrl', View4Ctrl)
  .name;