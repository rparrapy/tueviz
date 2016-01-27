'use strict';

/**
 * @ngdoc service
 * @name tueVizApp.barchartFactory
 * @description
 * # barchartFactory
 * Service in the tueVizApp.
 */
angular.module('tueVizApp')
  .service('barchartFactory', function () {
   
   
   
   
      // Public API here
    return {
      getData: function ( callback) {
$.getJSON("http://localhost:9000/diseases.json", function(diseasesData) {

var cats = _.uniq(_.map(diseasesData, 'class')) ; 
console.log(cats);

 var data = [
]
	for (var i = 0; i < cats.length; i++) { 
	           var   diseases =   _.filter(diseasesData  , { 'class': cats[i] })

               var allGenes = _.flatMap(_.map(diseases, 'genes') , function(d){ return _.map(_.split(d  , ',' ) , function(s) { return s.trim() }  ) } );	 
                 console.log(  cats[i])	;	
				 var relevent_genes = _.map(_.take(_.toPairs(_.countBy(allGenes)).sort(function(a, b) {return b[1] - a[1]}) , 3 ) , function(d) {return d[0];}).join(' , ') ;
				 console.log( relevent_genes );
				 console.log(_.take(_.toPairs(_.countBy(allGenes)).sort(function(a, b) {return b[1] - a[1]}) , 3 )  );
				 console.log(  allGenes.length)	;	
				 console.log(  _.uniq(allGenes).length)	;			 				 
				 console.log(  allGenes)	;			 
				 console.log("===============")	;			 
                 var  unique_genes = _.uniq(allGenes).length	 ;
			    data.push({ 'category' : cats[i]  ,  'genes_no' : unique_genes ,   'relevent_genes' : relevent_genes });							
         }
		 
	//	data =  _.sortBy(data, ['genes_no']).reverse();
		 		 console.log(data);


callback(data);
 
} ) ;
      }
    }; 
   
   
   
   
   
   
   
   
   
   
  });
