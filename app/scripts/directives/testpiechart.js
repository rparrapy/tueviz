'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:testPieChart
 * @description
 * # testPieChart
 */
angular.module('tueVizApp')
  .directive('testPieChart', function () {
    return {
      template: '<div id="chart" style="max-height: 280px; position: relative;"></div>',
      restrict: 'E',
      scope: {
        columns: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('columns', function(columns){
          var container = document.getElementById('chart');
          angular.element(container).empty();
          var chart = c3.generate({
              bindto: '#chart',
              data: {
                  // iris data from R
                  columns: scope.columns,
                  type : 'pie',
                  onclick: function (d, i) { console.log("onclick", d, i); },
                  onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                  onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              }
          });
        });
      }
    };
  });
