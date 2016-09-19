'use strict';
const url = require('url');
const ReconnectingWebSocket = require('./ReconnectingWebSocket');

/**
 * Client for interacting with the Asterisk REST Interface server-sent events.
 */
module.exports = {
  /**
   * Connect to Asterisk's event endpoint via websocket, and return an
   * EventEmitter that can be used to listen for events coming from Asterisk.
   *
   * @param {object} params
   * @param {string|Array.<string>} params.app The app[s] to receive events for.
   * @param {string} params.url The ARI events url with 'ws' or 'wss' protocol,
   *  i.e. 'ws://asterisk.local:8088/ari/events'
   * @param {string} params.username The username to use for the connection
   * @param {string} params.password The password to use for the connection
   * @param {boolean} [params.subscribeAll=true] Whether or not to subscribe
   *  to all system events. When set to false, explicit subscription
   *  requests must be made to the ARI events endpoint to receive events for
   *  individual event sources on a given application.
   * @param {boolean} [params.reconnect=true] Whether to reconnect to the
   *  ARI events endpoint upon unsolicited disconnect.
   * @param {object} [params.retryOptions={ maxTimeout: 60000 }] Any
   *  advanced options to pass to the 'node-retry' retry.operation() method.
   * @param {object} [params.wsOptions={}] Any advanced options to pass
   *  directly to the 'ws' library constructor.
   * @returns {ReconnectingWebSocket}
   */
  connect(params) {
    const {
      app,
      url: userProvidedUrl,
      username,
      password,
      subscribeAll = true,
      reconnect = true,
      retryOptions = { maxTimeout: 60000 },
      wsOptions = {}
    } = params;

    const parsedUrl = url.parse(userProvidedUrl);

    parsedUrl.query = Object.assign({}, parsedUrl.query, {
      api_key: `${username}:${password}`,
      app: [].concat(app).join(','),
      subscribeAll
    });

    const wsUrl = url.format(parsedUrl);

    return new ReconnectingWebSocket({
      url: wsUrl, reconnect, retryOptions, wsOptions
    });
  }
};
