'use strict';

/**
 * @ngdoc function
 * @name tueVizApp.controller:DiseasomeCtrl
 * @description
 * # DiseasomeCtrl
 * Controller of the tueVizApp
 */
angular.module('tueVizApp')
  .controller('DiseasomeCtrl', function ($scope, diseaseGraphFactory) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    diseaseGraphFactory.getData().then(function(graph) {
      var width = 800, height = 800;

      var color = d3.scale.category20();

      var force = d3.layout.force()
          //.charge(-120)
          .linkDistance(25)
          .size([width, height]);

      var svg = d3.select("#disease-graph").append("svg")
          .attr("width", width)
          .attr("height", height);

      force
          .nodes(graph.nodes)
          .links(graph.links)
          .start();

      var link = svg.selectAll(".link")
          .data(graph.links)
        .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", function(d) { return Math.sqrt(d.value); });

      var node = svg.selectAll(".node")
          .data(graph.nodes)
        .enter().append("circle")
          .attr("class", "node")
          .attr("r", 5)
          .style("fill", function(d) { return color(d.group); })
          .call(force.drag);

      node.append("title")
          .text(function(d) { return d.name; });

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });
    });
  });
