'use strict';

/**
 * @ngdoc function
 * @name tueVizApp.controller:DiseasomeCtrl
 * @description
 * # DiseasomeCtrl
 * Controller of the tueVizApp
 */
angular.module('tueVizApp'  )
  .controller('DiseasomeCtrl', function ($scope  , diseasomeFactory ) {

   $scope.dataCtrl = function(gene) {
     var data ; 
     diseasomeFactory.getData(gene , draw);	
    };
   
   
});	


function draw( data ){	
var margin = {top: 20, right: 120, bottom: 20, left: 120},
 width = 960 - margin.right - margin.left,
 height = 500 - margin.top - margin.bottom;
 
var i = 0;

var tree = d3.layout.tree()
 .size([height, width]);

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });
 //Setting the id attribute when appending the svg element can also 
 //let d3 select so remove() later on this element by id
d3.select("#the_SVG_ID").remove();


var svg = d3.select("#treeBox").append("svg")
 .attr("width", width + margin.right + margin.left)
 .attr("height", height + margin.top + margin.bottom)
 .attr("id","the_SVG_ID")  //setting ID
  .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var root = data[0];
  
update(root);

  
 function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
   links = tree.links(nodes);
console.log(nodes)
  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) { 
    return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("circle")
   .attr("r", 10)
   .style("fill", "#fff");

  nodeEnter.append("text")
   .attr("x", function(d) { 
    return d.children || d._children ? 15: 15; })
   .attr("dy", "-0.4em")
   .attr("text-anchor", function(d) { 
    return d.ss || d._children ? "end" : "start"; })
   .text(function(d) { return d.label; })
   .style("fill-opacity", 1)
   .style("font-weight", "bolder");


  // Declare the links…
  var link = svg.selectAll("path.link")
   .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);

}
	
}



  