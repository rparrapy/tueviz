'use strict';

describe('Service: diseasomeFactory', function () {

  // load the service's module
  beforeEach(module('tueVizApp'));

  // instantiate service
  var diseasomeFactory;
  beforeEach(inject(function (_diseasomeFactory_) {
    diseasomeFactory = _diseasomeFactory_;
  }));

  it('should do something', function () {
    expect(!!diseasomeFactory).toBe(true);
  });

});
