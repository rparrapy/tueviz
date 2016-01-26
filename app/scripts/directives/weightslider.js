'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:weightSlider
 * @description
 * # weightSlider
 */
angular.module('tueVizApp')
  .directive('weightSlider', function ($timeout) {
    return {
      template: '<div><span>Minimum genes shared:</span><br><div id="slider"></div></div>',
      restrict: 'E',
      scope: {
        weight: '='
      },
      link: function postLink(scope, element, attrs) {
        var slider = document.getElementById('slider');

        noUiSlider.create(slider, {
          start: [1],
          step: 1,
          connect: 'lower',
          tooltips: [ wNumb({ decimals: 0 }) ],
        	range: {
        		'min': 0,
        		'max': 5
        	}
        });

        slider.noUiSlider.on('update', function(){
          $timeout(function() {
            scope.$apply(function(){
              scope.weight = parseInt(slider.noUiSlider.get());
            });
          });
        });
      }
    };
  });
