'use strict';
const Rx = require('rxjs/Rx');
const qs = require('querystring');
const ReconnectingWebSocket = require('./ReconnectingWebSocket');

module.exports = {
  /**
   * Create an Rx Observable that, when subscribed to, connects to the ARI
   * events endpoint and emits events. This is a multicast observable, meaning
   * that it will stay subscribed to the events as long as it has at least one
   * subscriber. Upon the last unsubscription, the Observable will disconnect
   * from the Asterisk server.
   *
   * @param {object} params
   * @param {string|Array<string>} params.app The app(s) to receive events for.
   * @param {string} params.url The ARI events url with 'ws' protocol, i.e.
   *  'ws://asterisk.local:8088/ari/events'
   * @param {string} params.username The username to use for the connection
   * @param {string} params.password The password to use for the connection
   * @param {boolean} [params.subscribeAll=true] Whether or not to subscribe
   *  to all system events. When set to false, explicit subscription
   *  requests must be made to the ARI events endpoint to receive events for
   *  individual event sources on a given application.
   * @param {boolean} [params.reconnect=true] Whether to reconnect to the
   *  ARI events endpoint upon disconnect.
   * @param {number} [params.maxRetries=10] The number of times to retry a
   *  connection attempt to the ARI events endpoint upon failure.
   * @returns {Observable}
   * @example
   *  Events.create({
   *    app: 'discoWaitingRoom',
   *    url: 'http://myserver:8088/ari/events',
   *    username: 'jerry',
   *    password: 'garcia'
   *  }).subscribe(
   *    (message) => console.log('message', message),
   *    (error) => console.error('error', error),
   *    () => console.log('closed')
   *  );
   */
  create(params) {
    const {
      app,
      url,
      username,
      password,
      subscribeAll = true,
      reconnect = true,
      maxRetries = 10
    } = params;

    const query = qs.stringify({
      api_key: `${username}:${password}`,
      app: [].concat(app).join(','),
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
