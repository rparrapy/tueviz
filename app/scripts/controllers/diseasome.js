'use strict';

/**
 * @ngdoc function
 * @name tueVizApp.controller:DiseasomeCtrl
 * @description
 * # DiseasomeCtrl
 * Controller of the tueVizApp
 */
angular.module('tueVizApp')
  .controller('DiseasomeCtrl', function ($scope, diseaseGraphFactory, diseasomeFactory) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    diseaseGraphFactory.getData().then(function(graph) {
      $scope.data = graph;
      $scope.filter = {};
      $scope.selected = {nodes: graph.nodes, groups: _(graph.nodes).map('group').uniq().value()};
      $scope.highlighted = {nodes: []};
    });

    $scope.fetchData = function(gene, draw) {
     diseasomeFactory.getData(gene , draw);
    };
  });
