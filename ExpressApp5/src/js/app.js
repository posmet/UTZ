import angular from 'angular';
import jQuery from 'jquery';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import ngAnimate from 'angular-animate';
import ngAria from 'angular-aria';
import uiGrid from 'angular-ui-grid';
import toastr from 'angular-toastr';
import config, {otherwise} from './app.config';
import chartJS from 'angular-chart.js';
import uiBootstrapTabs from 'angular-ui-bootstrap/src/tabs';
import uiBootstrapDropdown from 'angular-ui-bootstrap/src/dropdown';
import uiBootstrapPopover from 'angular-ui-bootstrap/src/popover';

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
    uiRouter, ngCookies, ngAnimate, ngAria, toastr, controllers, directives, services, chartJS, uiBootstrapTabs, uiBootstrapDropdown, uiBootstrapPopover,
    uiGrid, 'ui.grid.saveState', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.moveColumns',
    'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav',
    'ui.grid.expandable', 'ui.grid.importer','ui.grid.grouping',
  ])
  .config(config)
  .run(['$rootScope', '$state', '$localStorage', '$http', '$notify', 'i18nService', '$transitions', function ($rootScope, $state, $localStorage, $http, $notify, i18nService, $transitions) {

    i18nService.setCurrentLang('ru');

    $transitions.onSuccess({ to: 'app.**' }, function (trans) {
      const toState = trans.router.stateService.current;
      const $rootScope = trans.injector().get('$rootScope');
      if (!toState.authentication) {
        return true;
      }
      if (!$rootScope.isAuthorized()) {
        return $rootScope.redirectToLogin();
      }
      if (!toState.roles.length) {
        return true;
      }
      const otherwiseState = `app.${otherwise}`;
      const $notify = trans.injector().get('$notify');
      if (!toState.roles.some(role => role === $rootScope.currentUser.interface) && toState.name !== otherwiseState) {
        $notify.warning('Недостаточно прав для доступа в раздел');
        return $state.go(otherwiseState);
      }
    });

    $rootScope.redirectToLogin = () => {
      $state.go('access.login');
    };

    $rootScope.getCurrentUser = () => {
      $rootScope.globalBusy = true;
      return $http({
          method: 'GET',
          url: '/api/name'
        })
        .then(function (response) {
          $rootScope.currentUser = response.data;
          $rootScope.globalBusy = false;
        }, function (err) {
          $notify.errors(err);
          $rootScope.globalBusy = false;
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