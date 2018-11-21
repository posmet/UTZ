import angular from 'angular';
import AppCtrl from './controllers/main';
import LoginCtrl from './controllers/login/login';
import View1Ctrl from './controllers/view1/view1';
import View3Ctrl from './controllers/view3/view3';
import View4Ctrl from './controllers/view4/view4';
import View7Ctrl from './controllers/view7/view7';
import View8Ctrl from './controllers/view8/view8';
import View11Ctrl from './controllers/view11/view11';
import View12Ctrl from './controllers/view12/view12';
import View13Ctrl from './controllers/view13/view13';
import View14Ctrl from './controllers/view14/view14';
import View15Ctrl from './controllers/view15/view15';

export default angular.module('app.controllers', [])
  .controller('AppCtrl', AppCtrl)
  .controller('LoginCtrl', LoginCtrl)
  .controller('View1Ctrl', View1Ctrl)
  .controller('View3Ctrl', View3Ctrl)
  .controller('View4Ctrl', View4Ctrl)
  .controller('View7Ctrl', View7Ctrl)
  .controller('View8Ctrl', View8Ctrl)
  .controller('View11Ctrl', View11Ctrl)
  .controller('View12Ctrl', View12Ctrl)
  .controller('View13Ctrl', View13Ctrl)
  .controller('View14Ctrl', View14Ctrl)
  .controller('View15Ctrl', View15Ctrl)
  .name;