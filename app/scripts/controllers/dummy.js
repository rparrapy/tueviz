'use strict';

/**
 * @ngdoc function
 * @name tueVizApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the tueVizApp
 */
angular.module('tueVizApp')
  .controller('DummyCtrl', function ($scope, testFactory) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    testFactory.getData().then(function(data) {
      $scope.columns = data;
    });
  });
