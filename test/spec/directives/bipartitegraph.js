'use strict';

describe('Directive: bipartiteGraph', function () {

  // load the directive's module
  beforeEach(module('tueVizApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bipartite-graph></bipartite-graph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bipartiteGraph directive');
  }));
});
