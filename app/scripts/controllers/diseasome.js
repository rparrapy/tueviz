'use strict';

/**
 * @ngdoc function
 * @name tueVizApp.controller:DiseasomeCtrl
 * @description
 * # DiseasomeCtrl
 * Controller of the tueVizApp
 */
angular.module('tueVizApp')
  .controller('DiseasomeCtrl', function ($scope, diseaseGraphFactory) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    diseaseGraphFactory.getData().then(function(graph) {
      $scope.data = graph;
    });
  });
