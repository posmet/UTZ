import angular from 'angular';
import exchange from './services/exchange';
import table from './services/table';
import localStorage from './services/localStorage';
import notify from './services/notify';
import authHttpResponseInterceptor from './services/http';

export default angular.module('app.services', [])
  .service('$notify', notify)
  .service('TableService', table)
  .factory('exchange', exchange)
  .factory('$localStorage', localStorage)
  .factory('authHttpResponseInterceptor', authHttpResponseInterceptor)
  .name;