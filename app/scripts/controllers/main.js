'use strict';

/**
 * @ngdoc function
 * @name tueVizApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tueVizApp
 */
angular.module('tueVizApp')
  .controller('MainCtrl', function ($scope, $mdBottomSheet, $mdSidenav, $log, $q, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.menu = {};
    $scope.menu.items = [
      {
        name: "Diseasome",
        fragment: "/diseasome",
        avatar: ""
      },
      {
        name: "Dummy Viz",
        fragment: "/dummy",
        avatar: ""
      },
      {
        name: "About",
        fragment: "/",
        avatar: ""
      }
    ];

    $scope.menu.selected = $scope.menu.items[1];
    $scope.menu.selectEntry = function(e) {
      $scope.menu.selected = e;
      $location.path(e.fragment);
    }

    $scope.menu.toggleSidebar = function() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }
  });
