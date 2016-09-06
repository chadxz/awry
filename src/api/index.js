'use strict';
const ApplicationsAPI = require('./ApplicationsAPI');
const AsteriskAPI = require('./AsteriskAPI');
const BridgesAPI = require('./BridgesAPI');

class API {
  /**
   * Creates a new awry API instance, providing clients for all available
   * Asterisk ARI endpoints.
   *
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
   * @constructor
   */
  constructor(params) {
    this.applications = new ApplicationsAPI(params);
    this.asterisk = new AsteriskAPI(params);
    this.bridges = new BridgesAPI(params);
  }
}

module.exports = API;
