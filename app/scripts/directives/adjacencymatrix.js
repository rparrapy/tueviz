'use strict';

/**
 * @ngdoc directive
 * @name tueVizApp.directive:bipartiteGraph
 * @description
 * # bipartiteGraph
 */
angular.module('tueVizApp')
  .directive('adjacencyMatrix', function () {
    return {
      template: '<div id="adjacency-matrix"></div>',
      restrict: 'E',
      scope: {
        diseases: '=',
        category: '=',
        highlighted: '='
      },
      link: function postLink(scope, element, attrs) {
        function drawGraph(diseases) {
          d3.select("#adjacency-matrix svg").remove();
          var genes = _(diseases).flatMap('genes').uniq().map(function (g) {
            return {group: -1, name: g};
          }).value();
          //var nodes = _.concat(diseases, genes);
          // var links = _(diseases).flatMap(function (d, dIdx) {
          //   return _.map(d.genes, function (g) {
          //     var idx = _.findIndex(nodes, function (n) {
          //       return n.name === g;
          //     });
          //     return {source: dIdx, target: idx, value: 1};
          //   });
          // }).value();

          var links = _.flatMap(diseases, function (d, idx) {
            return _.map(d.genes, function (g) {
              return { source: idx, target: _.findIndex(genes, function (g2) {
                return g2.name === g;
              }), value: 1};
            });
          });

          var matrix = [];
          //console.log(genes);
          //console.log(diseases);
          _.forEach(diseases, function (g, i) {
            matrix[i] = d3.range(genes.length).map(function(j) {
                return { x: i, y: j, z: 0 };
            });
          });

          // Convert links to matrix; count character occurrences.
          links.forEach(function(link) {
              matrix[link.source][link.target].z += link.value;
          });
          //console.log(matrix);

          //var graph = {nodes: nodes, links: links};
          var margin = {top: 80, right: 20, bottom: 10, left: 250};
          var width = 800, height = width * diseases.length / genes.length;
          var color = d3.scale.category20().range();


          var x = d3.scale.ordinal().rangeBands([0, width]),
              y = d3.scale.ordinal().rangeBands([0, height]),
              z = d3.scale.linear().domain([0, 4]).clamp(true),
              c = d3.scale.category10().domain(d3.range(10));

          var svg = d3.select("#adjacency-matrix").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              //.style("margin-left", -margin.left + "px")
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          x.domain(_.range(genes.length));
          y.domain(_.range(diseases.length));

          svg.append("rect")
              .attr("fill", "#eee")
              .attr("width", width)
              .attr("height", height);

          var row = svg.selectAll(".row")
              .data(matrix)
            .enter().append("g")
              .attr("class", "row")
              .attr("transform", function(d, i) {
                return "translate(0," + y(i) + ")";
              })
              .each(row);

          row.append("line")
              .attr("x2", width);

          row.append("text")
              .attr("x", -6)
              .attr("y", x.rangeBand() / 2)
              .attr("dy", ".32em")
              .style("font-size", function () {
                var result = 'inherit';
                if (genes.length > 50) { result = '10px'}
                if (genes.length > 100) { result = '7px'}
                if (genes.length > 150) { result = '5px'}
                return result;
              })
              .attr("text-anchor", "end")
              .text(function(d, i) { return _.truncate(diseases[i].name); });

          var column = svg.selectAll(".column")
              .data(matrix[0])
            .enter().append("g")
              .attr("class", "column")
              .attr("transform", function(d, i) {
                return "translate(" + x(i) + ")rotate(-90)";
              });

          column.append("line")
              .attr("x1", -width);

          column.append("text")
              .attr("x", 6)
              .attr("y", x.rangeBand() / 2)
              .attr("dy", ".32em")
              .style("font-size", function () {
                var result = 'inherit';
                if (genes.length > 50) { result = '10px'}
                if (genes.length > 100) { result = '7px'}
                if (genes.length > 150) { result = '5px'}
                return result;
              })
              .attr("text-anchor", "start")
              .text(function(d, i) { return genes[i].name; });

          function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function(d) { return d.z; }))
              .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function(d) { return x(d.y); })
                .attr("width", x.rangeBand())
                .attr("height", x.rangeBand())
                //.style("fill-opacity", function(d) { return z(d.z); })
                .style("fill", function(d, i) {
                   return (d.z) ? color[diseases[d.x].group] : 'white';
                 })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
          }

          function mouseover(p) {
            d3.selectAll(".row text").classed("active", function(d, i) { return i == p.x; });
            d3.selectAll(".column text").classed("active", function(d, i) { return i == p.y; });
          }

          function mouseout() {
            d3.selectAll("text").classed("active", false);
          }

        };


        scope.$watch('highlighted', function (highlighted) {
          if (highlighted && !_.isEmpty(highlighted.nodes)) {
            drawGraph(highlighted.nodes);
            document.getElementById('adjacency-matrix').scrollIntoView();
          } else {
            d3.select("#adjacency-matrix svg").remove();
          }

        }, true);
      }
    };
  });
