'use strict';

describe('Controller: DiseasomeCtrl', function () {

  // load the controller's module
  beforeEach(module('tueVizApp'));

  var DiseasomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiseasomeCtrl = $controller('DiseasomeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
