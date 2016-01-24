'use strict';

describe('Service: diseaseGraph', function () {

  // load the service's module
  beforeEach(module('tueVizApp'));

  // instantiate service
  var diseaseGraph;
  beforeEach(inject(function (_diseaseGraph_) {
    diseaseGraph = _diseaseGraph_;
  }));

  it('should do something', function () {
    expect(!!diseaseGraph).toBe(true);
  });

});
