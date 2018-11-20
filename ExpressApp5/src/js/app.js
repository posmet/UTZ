import angular from 'angular';
import jQuery from 'jquery';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import ngAnimate from 'angular-animate';
import ngAria from 'angular-aria';
import uiGrid from 'angular-ui-grid';
import toastr from 'angular-toastr';
import config from './app.config';
import chartJS from 'angular-chart.js';

import controllers from './app.controllers';
import directives from './app.directives';
import services from './app.services';

//styles
import '../styles/main.scss';

//scripts
import '../public/js/ui-grid.language.ru';
import 'chart.js/dist/Chart.min';
import pdfMake from "pdfmake/build/pdfmake.min";
import pdfFonts from "pdfmake/build/vfs_fonts";
import 'lodash';
import 'jszip/dist/jszip.min';
import 'file-saver/dist/FileSaver.min';
import 'excel-builder/dist/excel-builder.compiled.min';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const MODULE_NAME = 'UTZ';

angular.module(MODULE_NAME, [
    uiRouter, ngCookies, ngAnimate, ngAria, toastr, controllers, directives, services, chartJS,
    uiGrid, 'ui.grid.saveState', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.moveColumns',
    'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav',
    'ui.grid.expandable', 'ui.grid.importer','ui.grid.grouping',
  ])
  .config(config)
  .run(['$rootScope', '$state', '$localStorage', '$http', '$notify', 'i18nService', function ($rootScope, $state, $localStorage, $http, $notify, i18nService) {

    i18nService.setCurrentLang('ru');

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (toState.authentication && !$rootScope.isAuthorized()) {
        event.preventDefault();
        $rootScope.redirectToLogin();
      }
      $rootScope.currentState = toState;
    });

    $rootScope.redirectToLogin = () => {
      $state.go('access.login');
    };

    $rootScope.getCurrentUser = () => {
      $rootScope.busy = true;
      return $http({
          method: 'GET',
          url: '/api/name'
        })
        .then(function (response) {
          $rootScope.currentUser = response.data;
          $rootScope.busy = false;
        }, function (err) {
          $notify.errors(err);
          $rootScope.busy = false;
          return Promise.reject(err);
        });
    };

    $rootScope.isAuthorized = () => {
      return $localStorage.get(`${MODULE_NAME}_token`);
    };

    $rootScope.login = (data) => {
      return $localStorage.set(`${MODULE_NAME}_token`, data);
    };

    $rootScope.logout = () => {
      $localStorage.remove(`${MODULE_NAME}_token`);
      $rootScope.currentUser = undefined;
      $rootScope.redirectToLogin();
    };

    $rootScope.getToken = () => {
      const data = $localStorage.get(`${MODULE_NAME}_token`);
      return data ? data.token : undefined;
    };

    if (!$rootScope.isAuthorized()) {
      $rootScope.redirectToLogin();
    }

  }]);

export default MODULE_NAME;