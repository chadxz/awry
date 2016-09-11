'use strict';
const API = require('../../src/api');
const assert = require('power-assert');
const ApplicationsAPI = require('../../src/api/ApplicationsAPI');
const AsteriskAPI = require('../../src/api/AsteriskAPI');
const BridgesAPI = require('../../src/api/BridgesAPI');
const DeviceStatesAPI = require('../../src/api/DeviceStatesAPI');
const EndpointsAPI = require('../../src/api/EndpointsAPI');
const EventsAPI = require('../../src/api/EventsAPI');
const MailboxesAPI = require('../../src/api/MailboxesAPI');
const PlaybacksAPI = require('../../src/api/PlaybacksAPI');

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

  it('exposes a endpoints API instance', () => {
    assert(api.endpoints instanceof EndpointsAPI);
  });

  it('exposes a events API instance', () => {
    assert(api.events instanceof EventsAPI);
  });

  it('exposes a mailboxes API instance', () => {
    assert(api.mailboxes instanceof MailboxesAPI);
  });

  it('exposes a playbacks API instance', () => {
    assert(api.playbacks instanceof PlaybacksAPI);
  });
});
