'use strict';

describe('Directive: diseaseFilter', function () {

  // load the directive's module
  beforeEach(module('tueVizApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<disease-filter></disease-filter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the diseaseFilter directive');
  }));
});
