'use strict';
const API = require('../../src/api');
const assert = require('power-assert');
const ApplicationsAPI = require('../../src/api/ApplicationsAPI');
const AsteriskAPI = require('../../src/api/AsteriskAPI');
const BridgesAPI = require('../../src/api/BridgesAPI');
const DeviceStatesAPI = require('../../src/api/DeviceStatesAPI');

describe('API constructed instance', () => {

  let api;

  beforeEach(() => {
    api = new API({
      username: 'username',
      password: 'password',
      baseUrl: 'http://127.0.0.1/ari'
    });
  });

  it('exposes an applications API instance', () => {
    assert(api.applications instanceof ApplicationsAPI);
  });

  it('exposes an asterisk API instance', () => {
    assert(api.asterisk instanceof AsteriskAPI);
  });

  it('exposes a bridges API instance', () => {
    assert(api.bridges instanceof BridgesAPI);
  });

  it('exposes a device states API instance', () => {
    assert(api.deviceStates instanceof DeviceStatesAPI);
  });
});
