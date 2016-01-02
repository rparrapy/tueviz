'use strict';

/**
 * @ngdoc overview
 * @name tueVizApp
 * @description
 * # tueVizApp
 *
 * Main module of the application.
 */
angular
  .module('tueVizApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/dummy', {
        templateUrl: 'views/dummy.html',
        controller: 'DummyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
