'use strict';

describe('Service: barchartFactory', function () {

  // load the service's module
  beforeEach(module('tueVizApp'));

  // instantiate service
  var barchartFactory;
  beforeEach(inject(function (_barchartFactory_) {
    barchartFactory = _barchartFactory_;
  }));

  it('should do something', function () {
    expect(!!barchartFactory).toBe(true);
  });

});
