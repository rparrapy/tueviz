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
        avatar: "images/gene.png"
      },
	   {
        name: "Diseases Bar Chart",
        fragment: "/barchart",
        avatar: "images/barchart.png"
      },
      // {
      //   name: "Dummy Viz",
      //   fragment: "/dummy",
      //   avatar: ""
      // },
      {
        name: "About",
        fragment: "/",
        avatar: "images/about.png"
      }
    ];

    $scope.menu.selected = $scope.menu.items[2];
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
