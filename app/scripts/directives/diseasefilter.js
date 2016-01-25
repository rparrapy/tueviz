'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:diseaseFilter
 * @description
 * # diseaseFilter
 */
angular.module('tueVizApp')
  .directive('diseaseFilter', function () {
    return {
      templateUrl: 'views/directives/diseasefilter.html',
      scope: {
        data: '=',
        diseases: '=',
        category: '=',
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function(data) {
          if (data) {
            $('#category-filter').selectize({
              options: _.map(data.groups, function (g, i) {
                return {value: i, text: g};
              }),
              onChange: function (value) {
                scope.$apply(function(){
                  scope.category = parseInt(value);
                });
              }
            });

            $('#disease-filter').selectize({
              options: _.map(data.nodes, function (n, i) {
                return {value: i, text: n.name};
              }),
              maxItems: 80,
              onChange: function (value) {
                scope.$apply(function(){
                  scope.diseases = _.map(value, function (v) {
                    return parseInt(v);
                  });
                });
              }
            });
          }
        });
      }
    };
  });
