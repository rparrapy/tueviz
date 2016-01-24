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
        var drawGraph = function(graph, minWeight) {
          //var graph = scope.data;
          var width = 800, height = 800;
          if (minWeight == 2) {
            width = 400;
            height = 400;
          }
          if (minWeight > 2) {
            width = 200;
            height = 200;
          }

          var color = d3.scale.category20();

          var force = d3.layout.force()
              .charge(-30)
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
              .style("stroke-width", function(d) { return d.value; });

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
        }

        var clean = function(data, minWeight) {
          minWeight = minWeight || 1;
          var minDegree = 1; //should always be 1 for now

          //remove unconnected nodes
          data.links = _(data.links).reject(function (l) { return l.value < minWeight; });

          var connected = _(data.links).flatMap(function (l) {
            return [l.source, l.target];
          }).value();

          var removeIdxs = [];
          data.nodes = _(data.nodes).map(function (n, idx) {
            n.degree = _.filter(connected, function (c) {
              return c === idx;
            }).length;
            return n;
          }).filter(function (n, idx) {
              var include = n.degree >= minDegree;
              if (!include) {
                removeIdxs.push(idx);
              }
              return include;
          }).value();
          // console.log(removeIdxs);

          data.links = _(data.links).reject(function (l) {
            return _.includes(removeIdxs, l.source) || _.includes(removeIdxs, l.target);
          }).map(function (l) {
            function getOffset(value) {
              var offset = _.findIndex(removeIdxs, function (idx) {
                return idx >= value;
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
          }).value();

          console.log(data);
          return data;
        }

        var addDegree = function(data) {
          var connected = _(data.links).flatMap(function (l) {
            return [l.source, l.target];
          }).value();

          data.nodes = _(data.nodes).map(function (n, idx) {
            n.degree = _.filter(connected, function (c) {
              return c === idx;
            }).length;
            return n;
          });
          return data;
        }

        scope.$watch('data', function(data) {
          var minWeight = 1;
          if (data) {
            drawGraph(clean(data, minWeight), minWeight);
          }
        });
      }
    };
  });
