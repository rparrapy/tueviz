'use strict';

/**
 * @ngdoc function
 * @name tueVizApp.controller:BarchartCtrl
 * @description
 * # BarchartCtrl
 * Controller of the tueVizApp
 */
angular.module('tueVizApp')
  .controller('BarchartCtrl', function ( barchartFactory ) {

barchartFactory.getData(drawBarchart);



function drawBarchart( data ){
	var margin = {top: 20, right: 40, bottom: 300, left: 120},
 width = 900 - margin.right - margin.left,
 height = 700 - margin.top - margin.bottom;


 d3.select("#the_SVG_ID2").remove();

var svg = d3.select('#barchartBox')
.append('svg')
.attr("id","the_SVG_ID2")  //setting ID
.attr(
{ "width" : width + margin.right +  margin.left ,
"height" : height + margin.top + margin.bottom
})
.append('g')
.attr("transform" , "translate("  + margin.left + ',' + margin.right + ')');


// define the x and y scales

var xScale = d3.scale.ordinal()
 .rangeRoundBands( [0,width] , 0.2 , 0.2) ;

var yScale = d3.scale.linear()
 .range([height , 0]) ;

 // define axis

 var xAxis = d3.svg.axis()
 .scale(xScale)
 .orient("bottom");

 var yAxis = d3.svg.axis()
 .scale(yScale)
 .orient("left");

 var s = 'Most significant genes are EYA4, DIAPH1, MYO7A'
   var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .direction('e')
	  .offset([0, 20])
	  .html(function(d) {
	    return '<table id="tiptable">Most significant genes are ' + d.relevent_genes + "</table>";
	});
 data.forEach(function(d) {  d.category = d.category ; d.genes_no = +d.genes_no} );


//specify the domains of the x and y scales

xScale.domain(data.map( function(d) { return d.category;})) ;
yScale.domain(   [ 0, d3.max(data , function (d) {return d.genes_no;} )] ) ;
var colorScale = d3.scale.category20().range();


svg.call(tip);
//draw the bars
svg.selectAll('rect')
.data(data)
.enter()
.append('rect')
.attr("class" , "rect")
.attr ("height" , 0)
 .on('mouseover', tip.show)
 .on('mouseout', tip.hide)
.attr ("y" , height)
.transition().duration(3000)
.delay(function(d , i)  { return i * 200;})
.attr(
{
"x" : function(d) {return xScale(d.category);} ,
"y" :   function(d) {return yScale(d.genes_no);} ,
"width":  xScale.rangeBand() ,
"height": function(d) { return height - yScale(d.genes_no) ;}
}
)
//.style("fill"   , function(d,i) { return colorScale[i] ; }) ;
 //.style("fill"   , function(d,i) { return 'rgb(20 ,20 , ' + ((10* i+50) + 100) + ')' ; });
 // label the bars

 svg.selectAll('text')
 .data(data)
 .enter()
 .append('text')
 .text(function(d) { return d.genes_no ; })
 .attr('x' , function (d)  {  return   xScale(d.category) + xScale.rangeBand()/2 ; })
 .attr('y' , function(d)  { return yScale(d.genes_no) + 12 ;} )
 .style("fill" , "white")
 .style("text-anchor"  , "middle");



 //draw the xAxis
 svg.append("g")
 .attr("class" , "x axis")
 .attr("transform" , "translate(0 , "  + height + ")")
 .call(xAxis)
 .selectAll('text')
 .attr("transform" ,   "rotate(-60)")
 .attr("dx" , "-.8em")
 .attr("dy"  , ".25em")
 .style("text-anchor"  , "end")
 .style("font-size" , "14px");

 svg.append("text")
	  .attr("class", "xlabel")
	  .attr("text-anchor", "middle")
	  .attr("x", width / 2 - 40)
	  .attr("y", height + 150)
	  .text("Disease Categories");


  //draw the yAxis
  svg.append("g")
 .attr("class" , "y axis")
 .call(yAxis)
 .style("font-weight" , "bold")
 .style("font-size" , "14px");

  svg.append("text")
	  .attr("class", "ylabel")
	  .attr("y", 0 - margin.left) // x and y switched due to rotation
	  .attr("x", 0 - (height / 2))
	  .attr("dy", "3em")
	  .attr("transform", "rotate(-90)")
	  .style("text-anchor", "middle")
	  .text("Related Genes Count");

}





  });
