/* global spyOn:true */

'use strict';

describe('module', function () {

  var ngEcs, $systems;

  beforeEach(module('hc.ngEcs', function() {

  }));

  beforeEach(inject(function(_ngEcs_, _$systems_){
    ngEcs = _ngEcs_;
    $systems = _$systems_;

    ngEcs.$s('test', {
      $update: function() {},
      $updateEach: jasmine.createSpy('$updateEach')
    });

    ngEcs.$s('test2', {
      $require: ['test2'],
      $update: function() {},
      $updateEach: jasmine.createSpy('$updateEach')
    });

    spyOn($systems.test, '$update').andCallThrough();
    spyOn($systems.test2, '$update').andCallThrough();
  }));

  it('should setup engine', function () {
    expect(ngEcs).toBeDefined();
    expect(ngEcs.components).toBeDefined();
    expect(ngEcs.systems).toBeDefined();
    expect(ngEcs.entities).toBeDefined();
  });

  it('should call update', function () {

    ngEcs.$e({ 'test3' :{} }); // needs and entity, with a component (fix this)
    ngEcs.$update();
    ngEcs.$update();
    ngEcs.$update();

    expect($systems.test.$update.calls.length).toBe(3);
    expect($systems.test2.$update.calls.length).toBe(0);
  });

  it('should call update and updateEach', function () {

    ngEcs.$e({ 'test' :{} }); // needs and entity, with a component (fix this)
    ngEcs.$e({ 'test' :{} }); // needs and entity, with a component (fix this)

    ngEcs.$update();
    ngEcs.$update();
    ngEcs.$update();

    expect($systems.test.$update.calls.length).toBe(3);
    expect($systems.test.$updateEach.calls.length).toBe(6);

    expect($systems.test2.$update.calls.length).toBe(0);
    expect($systems.test2.$updateEach.calls.length).toBe(0);
  });

  it('should call update and updateEach on each system', function () {

    ngEcs.$e({ 'test' :{} });
    ngEcs.$e({ 'test' :{} });
    ngEcs.$e({ 'test2' :{} });
    ngEcs.$e({ 'test2' :{} });
    ngEcs.$e({ 'test2' :{} });

    ngEcs.$update();
    ngEcs.$update();

    expect($systems.test.$update.calls.length).toBe(2);
    expect($systems.test.$updateEach.calls.length).toBe(10);
    expect($systems.test2.$update.calls.length).toBe(2);
    expect($systems.test2.$updateEach.calls.length).toBe(6);
  });

});
