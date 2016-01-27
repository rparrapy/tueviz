'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:barchartDir
 * @description
 * # barchartDir
 */
angular.module('tueVizApp')
  .directive('barchartDir', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the barchartDir directive');
      }
    };
  });
