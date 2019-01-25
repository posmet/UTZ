import angular from 'angular';
import exchange from './services/exchange';
import table from './services/table';
import localStorage from './services/localStorage';
import notify from './services/notify';
import authHttpResponseInterceptor from './services/http';
import userService from './services/user';

export default angular.module('app.services', [])
  .service('$notify', notify)
  .service('TableService', table)
  .service('UserService', userService)
  .factory('exchange', exchange)
  .factory('$localStorage', localStorage)
  .factory('authHttpResponseInterceptor', authHttpResponseInterceptor)
  .name;