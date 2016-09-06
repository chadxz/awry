'use strict';
const awry = require('../src');
const Events = require('../src/events');
const assert = require('power-assert');

describe('awry', () => {

  it('exposes the Events module', () => {
    assert.equal(awry.Events, Events);
  });

  it('exposes an API constructor', () => {
    assert.equal(typeof awry.API, 'function');
  });
});

