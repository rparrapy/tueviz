'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:diseaseGraph
 * @description
 * # diseaseGraph
 */
angular.module('tueVizApp')
  .directive('diseaseGraph', function () {
    return {
      template: '<div id="disease-graph"></div>',
      restrict: 'E',
      scope: {
        data: '=',
        select: '=',
        category: '='
      },
      link: function postLink(scope, element, attrs) {
        var drawGraph = function(graph) {
          //var graph = scope.data;
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
              .text(function(d) { return d.index; });

          force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
          });
        }

        var clean = function(data) {
          //remove unconnected nodes
          var connected = _(data.links).flatMap(function (l) {
            return [l.source, l.target];
          }).uniq().value();

          var removeIdxs = _.difference(_.range(data.nodes.length), connected);
          console.log(removeIdxs);

          data.nodes = _.filter(data.nodes, function (n, idx) {
            return _.findIndex(removeIdxs, function (x) {
              return x === idx;
            }) < 0;
          });

          data.links = _.map(data.links, function (l) {
            function getOffset(value) {
              var offset = _.findIndex(removeIdxs, function (idx) {
                return idx > value;
              });
              if (offset < 0 && removeIdxs) {
                offset = removeIdxs.length;
              }
              return offset;
            }
            var sourceOffset = getOffset(l.source);
            var targetOffset = getOffset(l.target);
            l.source -= sourceOffset;
            l.target -= targetOffset;

            return l;
          });

          return data;
        }

        scope.$watch('data', function(data) {
          console.log(data);
          if (data) {
            drawGraph(clean(data));
          }
        });
      }
    };
  });
