'use strict';

/**
 * @ngdoc service
 * @name tueVizApp.diseaseGraph
 * @description
 * # diseaseGraph
 * Factory in the tueVizApp.
 */
angular.module('tueVizApp')
  .factory('diseaseGraphFactory', function ($http, $q, $log) {
    // Service logic
    // ...

    var diseases;
    var genes;

    var getDiseases = function() {
      var result;
      var deferred = $q.defer();
      if(diseases) {
        deferred.resolve(diseases);
        result = deferred.promise;
      } else {
        result = $http({method:"GET", url:"/diseases.json"}).then(function(resp) {
          var deferred = $q.defer();
          diseases = resp.data;
          deferred.resolve(diseases);
          return deferred.promise;
        });
      }
      return result;
    }

    var getGenes = function() {
      var result;
      var deferred = $q.defer();
      if(genes) {
        deferred.resolve(genes);
        result = deferred.promise;
      } else {
        result = $http({method:"GET", url:"/genes.json"}).then(function(resp) {
          var deferred = $q.defer();
          genes = resp.data;
          deferred.resolve(genes);
          return deferred.promise;
        });
      }
      return result;
    }

    // Public API here
    return {
      getData: function () {
        var result;
        var deferred = $q.defer();
        return $q.all([getDiseases(), getGenes()]).then(function(data) {
          var diseases = data[0];
          var genes = data[1];

          // Temporary patch, source dataset should be corrected
          _.forEach(diseases, function(d) {
            d.genes = _(d.genes).split(',').map(function(g) {return _.trim(g); }).value();
          });

          var diseaseGroups = _(diseases).map('class').uniq().value();
          var nodes = _.map(diseases, function(d) {
            var group = _.findIndex(diseaseGroups, function(g) { return g === d.class});
            return {name: d.disease, group: group};
          })

          var links = _(diseases).flatMap(function(d, idx, list) {
            return _(list).map(function(d2, idx2) {
              var value = _.intersection(d.genes, d2.genes).length;
              return {source: idx, target: idx2, value: value};
            }).value();
          }).reject(function(l) { return l.value === 0 || l.source >= l.target; }).value();
          // $log.debug(nodes);
          // $log.debug(links);
          diseaseGroups = _.map(diseaseGroups, function (dg) {
            return _.replace(dg, /_/g, ' ');
          });
          deferred.resolve({nodes: nodes, links: links, groups: diseaseGroups});
          return deferred.promise;
        });
      }
    };
  });
