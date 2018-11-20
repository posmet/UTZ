import angular from 'angular';
import {PhFilter, CustomOnChange, Loading} from './directives/common'

export default angular.module('app.directives', [])
  .directive('phFilter', PhFilter)
  .directive('customOnChange', CustomOnChange)
  .directive('loading', Loading)
  .name;