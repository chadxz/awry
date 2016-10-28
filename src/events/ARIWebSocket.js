'use strict';
const ReconnectingWebSocket = require('./ReconnectingWebSocket');
const debug = require('debug')('awry:ARIWebSocket');

class ARIWebSocket extends ReconnectingWebSocket {

  emit(...args) {
    const eventIsMessage = args[0] === 'message';
    const payloadIsString = args[1] && typeof args[1] === 'string';

    if (!eventIsMessage || !payloadIsString) {
      super.emit(...args);
      return;
    }

    try {
      args[1] = JSON.parse(args[1]);
    } catch (e) {
      debug('error parsing data as JSON', `'${args[1]}'`, e);
    }

    super.emit(...args);
  }
}

module.exports = ARIWebSocket;
