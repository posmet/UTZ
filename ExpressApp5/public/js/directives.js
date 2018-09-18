'use strict';

/* Directives */

angular.module('myApp.directives', []).
    directive('appVersion', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }).
    directive('whenScrolled', function () {
        return function (scope, elm, attr) {
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHight >= raw.scrollHight) {
                    scope.$aaply(attr.whenScrolled);
                }
            });
        }
    });  
