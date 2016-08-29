'use strict';
const Rx = require('rxjs/Rx');
const qs = require('querystring');
const ReconnectingWebSocket = require('./ReconnectingWebSocket');

module.exports = {
  /**
   * Create an Rx Subject that, when subscribed to, connects to the ARI
   * events endpoint and emits events.
   *
   * @param {Array} params.apps The apps to receive events for
   * @param {string} params.url The ARI events url with 'ws' protocol, i.e.
   *  'ws://asterisk.local:8088/ari/events'
   * @param {string} params.username The username to use for the connection
   * @param {string} params.password The password to use for the connection
   * @param {boolean} [params.subscribeAll=true] Whether or not to subscribe
   *  to all of the given applications' events. If true, this negates the
   *  need to subscribe to individual event sources on a given application.
   * @param {boolean} [params.reconnect=true] Whether to reconnect to the
   *  ARI events endpoint upon disconnect.
   * @param {number} [params.maxRetries=10] The number of times to retry a
   *  connection attempt to the ARI events endpoint upon failure.
   * @returns {Rx.Subject}
   */
  create(params) {
    const {
      apps,
      url,
      username,
      password,
      subscribeAll = true,
      reconnect = true,
      maxRetries = 10
    } = params;

    const query = qs.stringify({
      api_key: `${username}:${password}`,
      app: [].concat(apps).join(','),
      subscribeAll
    });
    const wsUrl = `${url}?${query}`;

    return Rx.Observable.create(observer => {
      const ws = new ReconnectingWebSocket({ url: wsUrl, reconnect, maxRetries });
      ws.on('message', observer.next.bind(observer));
      ws.on('error', observer.error.bind(observer));
      ws.on('close', observer.complete.bind(observer));
      // return value called upon subscription cancellation
      // to cleanup the observable's state.
      return ws.close.bind(ws);
    }).share();
  }
};
