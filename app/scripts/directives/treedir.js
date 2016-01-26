'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:diseasomedir
 * @description
 * # diseasomedir
 */
angular.module('tueVizApp')
  .directive('treeDir', function () {
	  
function watchGeneAndUpdate(scope, element, attrs) {
    scope.$watch('gene', function(gene){
        scope.dataCtrl(gene);    
        });
      }
	
	
    return {
      template: '<h1>Input the gene name in input box:</h1> <p>Gene : <input ng-model="gene" type="text"  placeholder="Enter name here"></p> <div id="treeBox"  style="height: 100px; "> </div>',
      link: watchGeneAndUpdate
	
	
	
	};
  });
