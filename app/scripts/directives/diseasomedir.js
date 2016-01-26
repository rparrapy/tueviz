'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:diseasomedir
 * @description
 * # diseasomedir
 */
angular.module('tueVizApp')
  .directive('diseasomedir', function () {
    return {
      template: ' <div id="treeBox"  style="height: 100px; " ></div  >',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('');
		
		   // whenever the bound 'exp' expression changes, execute this 
      scope.$watch('data', function (newVal, oldVal) {
        // ...
      });
      }
	  
	 
    };
  });
