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
        diseases: '=',
        category: '=',
        weight: '=',
        selected: '=',
        highlighted: '=',
        gene: '='
      },
      link: function postLink(scope, element, attrs) {
        var minWeight = 1;
        var blurFilter = {};
        var maxNumberOfGenes;

        //temporary patch
        $('#clear-highlight-btn').click(function() {
          d3.selectAll('circle').style('stroke', '#FFFFFF').style('stroke-width', 1.5);
          scope.$apply(function () {
            scope.highlighted.nodes = [];
            scope.highlighted.clicked = {};
            scope.gene = false;
          });
        });


        var drawGraph = function(graph, minWeight, onEnd) {
          function onClick() {
            d3.selectAll('circle').style('stroke', '#FFFFFF').style('stroke-width', 1.5);
            d3.select(this).style('stroke', 'yellow').style('stroke-width', 3);
            var clickedIndex = parseInt(d3.select(this).attr('data-index'));
            var neighbours = _.reduce(graph.links, function (result, l) {
              if (l.source.index === clickedIndex) { result.push(l.target.index); }
              if (l.target.index === clickedIndex) { result.push(l.source.index); }
              return result;
            }, []);
            _.each(neighbours, function (n) {
              d3.select('[data-index="'+ n + '"]').style('stroke', 'yellow').style('stroke-width', 3);
            });

            var highlightedIdxs = _.concat(neighbours, clickedIndex);
            var highlightedNames = _(graph.nodes).filter(function (n, idx) {
                return _.includes(highlightedIdxs, idx);
            }).map('name').value();

            scope.$apply(function () {
              scope.highlighted.nodes = _.filter(scope.data.nodes, function (n) {
                  return _.includes(highlightedNames, n.name);
              });
              scope.highlighted.clicked = _.filter(scope.data.nodes, function (n) {
                return n.name === graph.nodes[clickedIndex].name;
              })[0];
              d3.event.stopPropagation();
              console.log(scope.highlighted);
            });
          }

          //var graph = scope.data;
          d3.select("svg").remove();
          var width = 800, height = 800;
          // if (minWeight == 2) {
          //   width = 400;
          //   height = 400;
          // }
          // if (minWeight > 2) {
          //   width = 200;
          //   height = 200;
          // }

          var color = d3.scale.category20();

          var force = d3.layout.force()
              .charge(-30)
              .linkDistance(25)
              .size([width, height]);

          var svg = d3.select("#disease-graph").append("svg")
              .attr("width", width)
              .attr("height", height);

          var defs = svg.append("defs");
          _.forEach(graph.nodes, function (n) {
            var id = "blur-" + _.kebabCase(n.name);
            blurFilter[id] = defs.append("filter")
                                .attr("id", id)
                              .append("feGaussianBlur")
                                .attr("stdDeviation", 0);
          });

          force
              .nodes(graph.nodes)
              .links(graph.links)
              .start();


          var link = svg.selectAll(".link")
              .data(graph.links)
            .enter().append("line")
              .attr("class", "link")
              .style("stroke-width", function(d) { return d.value; });

          //var area = d3.scale.sqrt().domain([0, maxNumberOfGenes]).range([0, 20]).clamp(true);
          //console.log(area(1));

          var highlightedNames = _.map(scope.highlighted.nodes, 'name');


          var node = svg.selectAll(".node")
              .data(graph.nodes)
            .enter().append("circle")
              .attr("class", "node")
              .attr("r", function (d) {
                return 5;
              })
              .style("fill", function(d) {
                return color.range()[d.group];
              })
              .attr('data-index', function (d) { return d.index; })
              .attr("filter", function(d) { return "url(#blur-" + _.kebabCase(d.name)+ ")"; })
              .on("click", onClick)
              .style("stroke", function (d) {
                return _.includes(highlightedNames, d.name) ? 'yellow' : '#FFFFFF';
              })
              .style("stroke-width", function (d) {
                return _.includes(highlightedNames, d.name) ? 3 : 1.5;
              })
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

          if (onEnd) {
            force.on('end', onEnd);
          }
        }

        var clean = function(data, minWeight) {
          var result;
          result = angular.copy(data, result);
          minWeight = minWeight || 1;
          var minDegree = 1; //should always be 1 for now

          //remove unconnected nodes
          result.links = _(result.links).reject(function (l) { return l.value < minWeight; });

          var connected = _(result.links).flatMap(function (l) {
            return [l.source, l.target];
          }).value();

          var removeIdxs = [];
          result.nodes = _(result.nodes).map(function (n, idx) {
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

          result.links = _(result.links).reject(function (l) {
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

          return result;
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
          if (data) {
            maxNumberOfGenes = _.max(_.map(data.nodes, function (n) {
              return n.genes.length;
            }));
            drawGraph(clean(data, minWeight), minWeight);
          }
        });

        scope.$watch('category', function(category) {
          updateGraph(category, scope.diseases);
        });

        scope.$watchCollection('diseases', function(diseases) {
          updateGraph(scope.category, diseases);
        });

        function updateGraph(category, diseases) {
          d3.selectAll("circle").classed("selected", false);
          var categoryIdx = scope.category || -1;
          var diseasesIdxs = diseases || [];
          var selected = [];

          if (scope.data) {
            _.forEach(scope.data.nodes, function (n, nidx) {
              var blurValue = (n.group === categoryIdx && _.includes(diseasesIdxs, nidx))
                              || (categoryIdx === -1 && _.includes(diseasesIdxs, nidx))
                              || (_.isEmpty(diseasesIdxs) && n.group === categoryIdx)
                              ||  (categoryIdx === -1 && _.isEmpty(diseasesIdxs))? 0 : 3;
              var id = "blur-" + _.kebabCase(n.name);
              blurFilter[id].attr('stdDeviation', blurValue);
              if (!blurValue) {
                if (!_.isEmpty($("[filter='url(#" + id + ")']"))) {
                  selected.push(n);
                }
                d3.select("[filter='url(#" + id + ")']").classed("selected", true);
              }
            });
            if (categoryIdx !== -1 || !_.isEmpty(diseasesIdxs)) {
              d3.selectAll(".selected").transition().duration(750).attr("r", 16)
                .transition().duration(750).attr("r", 5);
            }
            scope.selected = {nodes: selected, groups: _(selected).map('group').uniq().value()};
          }
        }

        scope.$watch('weight', function(weight) {
          if (weight !== minWeight && scope.data) {
            minWeight = weight;
            drawGraph(clean(scope.data, minWeight), minWeight);
            updateGraph(scope.category, scope.diseases);
          }
        });
      }
    };
  });
