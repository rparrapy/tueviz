'use strict';

/**
 * @ngdoc service
 * @name tueVizApp.diseasomeFactory
 * @description
 * # diseasomeFactory
 * Factory in the tueVizApp.
 */
angular.module('tueVizApp')
  .factory('diseasomeFactory', function () {
 	
    // Public API here
    return {
      getData: function (gene , callback) {
	$.getJSON("http://localhost:9000/genes.json", function(genesData) {
 $.getJSON("http://localhost:9000/diseases.json", function(diseasesData) {
	 
 var geneDiseases =   _.filter(genesData , { 'gene': gene });
 var geneDiseasesIDs =  _.get(geneDiseases[0],'disease_id') ;
var  geneDiseasesIDsarr =   _.split(geneDiseasesIDs , ',' ) ;
 var  geneDiseasesIDsarr =  geneDiseasesIDsarr.map(function(s) { return s.trim() });
 var  diseasesObjects = _.filter(  diseasesData , function (d)  {  return geneDiseasesIDsarr.indexOf(d.id.toString()) != -1 }  ) ;
 var  categories =   _.uniq( _.flatMap(diseasesObjects, function(d) {   return d.class}  ));
var data = [
   {
    "label": gene,
	 "children": [ 
     ]	
  }
] ;
	for (var i = 0; i < categories.length; i++) { 
			    data[0].children.push({ 'label' : categories[i] , 'children' :[] });      
             	var diseasesNames =  _.compact(_.flatMap( diseasesObjects, function(d) { if (d.class == categories[i])  {return d.disease} } )) ; 
				console.log(diseasesNames)
				var aa = _.filter(data[0].children   , { 'label': categories[i] })	;		
				for ( var j = 0 ; j< diseasesNames.length; j++)
				{	
				   var categoryobject = _.filter(data[0].children   , { 'label': categories[i] })
                   categoryobject[0].children.push({ 'label' : diseasesNames[j] , 'children' :[] })				
				}			
         }
	callback(data);
 });
 });
      }
    };
  });

  

  
  
  
  