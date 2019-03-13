import angular from 'angular';
import {PhFilter, CustomOnChange, Loading, AbsoluteLoading} from './directives/common';
import {ConfirmModal, UserEditModal} from './directives/modal';

export default angular.module('app.directives', [])
  .directive('phFilter', PhFilter)
  .directive('customOnChange', CustomOnChange)
  .directive('loading', Loading)
  .directive('absoluteLoading', AbsoluteLoading)
  .directive('confirmModal', ConfirmModal)
  .directive('userEditModal', UserEditModal)
  .name;