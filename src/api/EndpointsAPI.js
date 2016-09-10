'use strict';
const rp = require('request-promise-native');

/**
 * REST API Resource for interacting with Asterisk endpoints.
 */
class EndpointsAPI {

  /**
   * Create an instance of the Endpoints API client, providing access
   * to the `/endpoints` endpoint.
   *
   * @param {object} params
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
   * @constructor
   */
  constructor(params) {
    const { username, password } = params;
    this.baseUrl = params.baseUrl;
    this.request = rp.defaults({
      auth: { username, password },
      json: true
    });
  }

  /**
   * GET /endpoints
   *
   * List all endpoints in Asterisk.
   *
   * @returns {Promise.<Array.<Endpoint>>} Resolves to all endpoints in Asterisk.
   */
  list() {
    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/endpoints`
    });
  }

  /**
   * PUT /endpoints/sendMessage
   *
   * Send a message to some technology URI or endpoint.
   *
   * @param {object} params
   * @param {string} params.to The endpoint resource or technology specific
   *  URI to send the message to. Valid resources are 'sip', 'pjsip', and
   *  'xmpp'.
   * @param {string} params.from The endpoint resource or technology specific
   *  identity to send this message from. Valid resources are 'sip', 'pjsip',
   *  and 'xmpp'.
   * @param {string} params.body The body of the message.
   * @param {object} params.variables An object of key/value pairs that should
   *  be sent to set variables for the sendMessage request.
   * @returns {Promise} Resolves if the message has been successfully sent.
   *  Rejects if invalid params are provided for sending the message (status
   *  400) or the specified destination could not be found (status 404).
   */
  sendMessage(params) {
    const { to, from, body, variables } = params;

    return this.request({
      method: 'PUT',
      uri: `${this.baseUrl}/endpoints/sendMessage`,
      qs: { to, from, body },
      body: { variables }
    });
  }

  /**
   * GET /endpoints/{technology}
   *
   * List available endpoitns for a given endpoint technology.
   *
   * @param {object} params
   * @param {string} params.technology The technology of the endpoints (sip,
   *  iax2, etc.)
   * @returns {Promise.<Array.<Endpoint>>} Resolves to a list of endpoints
   *  that match the specified technology.
   */
  listByTechnology(params) {
    const { technology } = params;
    const tech = encodeURIComponent(technology);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/endpoints/${tech}`
    });
  }

  /**
   * GET /endpoints/{technology}/{resource}
   *
   * Retrieve the details for a specific Asterisk endpoint.
   *
   * @param {object} params
   * @param {string} params.technology The technology of the endpoints (sip,
   *  iax2, etc.)
   * @param {string} params.resource The technology-specific identifier for
   *  the endpoint.
   * @returns {Promise.<Endpoint>} Resolves to the endpoint that matches the
   *  specified technology and resource. Rejects if invalid parameters are
   *  provided (status 400) or the specified endpoint is not found (status 404).
   */
  get(params) {
    const { technology, resource } = params;
    const tech = encodeURIComponent(technology);
    const res = encodeURIComponent(resource);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/endpoints/${tech}/${res}`
    });
  }

  /**
   * PUT /endpoints/{technology}/{resource}/sendMessage
   *
   * Send a message to a specific endpoint.
   *
   * @param {object} params
   * @param {string} params.technology The technology of the endpoints (sip,
   *  iax2, etc.)
   * @param {string} params.resource The technology-specific identifier for
   *  the endpoint.
   * @param {string} params.from The endpoint resource or technology specific
   *  identity to send this message from. Valid resources are 'sip', 'pjsip',
   *  and 'xmpp'.
   * @param {string} params.body The body of the message
   * @param {object} params.variables An object of key/value pairs that should
   *  be sent to set variables for the sendMessage request.
   * @returns {Promise} Resolves when the message is successfully sent. Rejects
   *  when invalid parameters are provided for sending a message (status 400)
   *  or when the specified endpoint is not found (status 404).
   */
  sendMessageToEndpoint(params) {
    const { technology, resource, from, body, variables } = params;
    const tech = encodeURIComponent(technology);
    const res = encodeURIComponent(resource);

    return this.request({
      method: 'PUT',
      uri: `${this.baseUrl}/endpoints/${tech}/${res}/sendMessage`,
      qs: { from, body },
      body: { variables }
    });
  }
}

module.exports = EndpointsAPI;

/**
 * @name Endpoint
 * @typedef Endpoint
 * @property {Array.<string>} channel_ids Ids of channels associated with this endpoint.
 * @property {string} resource The idenfier of the endpoint, specific to the given technology.
 * @property {string} technology The technology of the endpoint.
 * @property {string} [state] The endpoint's current state.
 */
