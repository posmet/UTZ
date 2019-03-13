import angular from 'angular';
import {Trusted} from './filters';

export default angular.module('app.filters', [])
  .filter('trusted', Trusted)
  .name;