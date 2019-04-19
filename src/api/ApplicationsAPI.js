import rp from "request-promise-native";

/**
 * REST API Resource for interacting with ARI Stasis Applications.
 */
export default class ApplicationsAPI {
  /**
   * Create an instance of the Applications API client, providing access
   * to the `/applications` endpoint.
   *
   * @param {object} params
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
   */
  constructor(params = {}) {
    const { username, password } = params;

    /** @private */
    this._baseUrl = params.baseUrl;

    /** @private */
    this._request = rp.defaults({
      auth: { username, password },
      json: true
    });
  }

  /**
   * GET /applications
   *
   * List all ARI applications registered in Asterisk.
   *
   * @returns {Promise.<Array.<Application>>} Resolves with all applications
   *  registered in Asterisk.
   */
  list() {
    return this._request({
      method: "GET",
      uri: `${this._baseUrl}/applications`
    });
  }

  /**
   * GET /applications/{applicationName}
   *
   * Retrieve a single ARI application's details.
   *
   * @param {object} params
   * @param {string} params.applicationName The name of the application to
   *  retrieve.
   * @returns {Promise.<Application>} Resolves to the application details
   *  matching the provided application name. Rejects if the application
   *  does not exist (404 status).
   */
  get(params = {}) {
    const { applicationName } = params;
    const app = encodeURIComponent(applicationName);

    return this._request({
      method: "GET",
      uri: `${this._baseUrl}/applications/${app}`
    });
  }

  /**
   * POST /applications/{applicationName}/subscription
   *
   * *Subscribing to all endpoints for a specific endpoint technology,
   * i.e. `eventSource: 'endpoint:PJSIP'`, was introduced in Asterisk 12.5*
   *
   * *Subscribing to all resources in an event source, i.e.
   * `eventSource: 'channels:'`, was introduced in Asterisk 13.6*
   *
   * @param {object} params
   * @param {string} params.applicationName The name of the application to
   *  register 1 or more subscriptions with.
   * @param {string|Array.<string>} params.eventSource The uri for the event
   *  source[s] to subscribe to. For channels, it is the `channelId`. For
   *  bridges, it is the `bridgeId`. For endpoints, it is the technology
   *  combined with the resource with a slash, i.e. 'PJSIP/6001'. For
   *  deviceState, it is the `deviceName`.
   * @returns {Promise.<Application>} Resolves to the application details
   *  matching the provided application name. Rejects if the application
   *  does not exist (404 status) or one of the provided eventSources does
   *  not exist (422 status).
   */
  subscribe(params = {}) {
    const { eventSource, applicationName } = params;
    const app = encodeURIComponent(applicationName);

    return this._request({
      method: "POST",
      uri: `${this._baseUrl}/applications/${app}/subscription`,
      qs: { eventSource: [].concat(eventSource).join(",") }
    });
  }

  /**
   * DELETE /applications/{applicationName}/subscription
   *
   * @param {object} params
   * @param {string} params.applicationName The name of the application to
   *  remove 1 or more subscriptions from.
   * @param {string|Array.<string>} params.eventSource The uri for the event
   *  source[s] to unsubscribe from. For channels, it is the `channelId`. For
   *  bridges, it is the `bridgeId`. For endpoints, it is the technology
   *  combined with the resource with a slash, i.e. 'PJSIP/6001'. For
   *  deviceState, it is the `deviceName`.
   * @returns {Promise.<Application>} Resolves to the application details
   *  matching the provided application name. Rejects if the application
   *  does not exist (404 status), the application is not currently
   *  subscribed to one of the provided eventSources (409), or one of the
   *  provided eventSources does not exist (422 status).
   */
  unsubscribe(params = {}) {
    const { eventSource, applicationName } = params;
    const app = encodeURIComponent(applicationName);

    return this._request({
      method: "DELETE",
      uri: `${this._baseUrl}/applications/${app}/subscription`,
      qs: { eventSource: [].concat(eventSource).join(",") }
    });
  }

  /**
   * PUT /applications/{applicationName}/eventFilter
   *
   * Filter application events types.
   *
   * @param {object} params
   * @param {string} params.applicationName The name of the application to
   *  filter events on.
   * @param {FilterOptions} [params.filter={}] Specify which event types to
   *  allow and/or disallow. If not provided, this method will remove all
   *  "allowed" and "disallowed" filters. See {@link FilterOptions} for more details.
   * @returns {Promise.<Application>} Resolves to the application details
   *  matching the provided application name. Rejects if the application
   *  does not exist (404 status) or the request body is incorrect (400 status).
   */
  filterEvents(params) {
    const { filter = {}, applicationName } = params;

    const app = encodeURIComponent(applicationName);

    return this._request({
      method: "PUT",
      uri: `${this._baseUrl}/applications/${app}/eventFilter`,
      body: { filter }
    });
  }
}

/**
 * The Application model returned by Asterisk.
 *
 * See {@link ApplicationsAPI}
 *
 * @typedef {object} Application
 * @property {Array.<string>} bridge_ids The ids of bridges that this application is subscribed to.
 * @property {Array.<string>} channel_ids The ids of channels that this application is subscribed to.
 * @property {Array.<string>} device_names The names of devices that this application is subscribed to.
 * @property {Array.<string>} endpoint_ids The endpoints that this application is subscribed to, in the format `{tech}/{resource}` i.e. 'PJSIP/6001'.
 * @property {string} name The name of this application.
 */

/**
 * The object to specify which application events to allow or disallow.
 * An empty "allowed" list means all events are allowed. An empty "disallowed"
 * list means no events are disallowed. Disallowed events take precedence over
 * allowed events if the event type is specified in both lists. If both list
 * types are given then both are set to their respective values
 * (note, specifying an empty array for a given type sets that type to empty).
 * If only one list type is given then only that type is set. The other type is
 * not updated. If neither is specified, both the allowed and disallowed filters
 * are set empty.
 *
 * See {@link ApplicationsAPI#filterEvents}.
 *
 * @typedef {object} FilterOptions
 * @property {Array.<FilterValue>} [allowed] The events you want to allow.
 * @property {Array.<FilterValue>} [disallowed] The events you want to disallow.
 */

/**
 * The object to specify a filter.
 *
 * For example, `{ type: 'StasisStart' }`
 *
 * See {@link ApplicationsAPI#filterEvents}.
 *
 * @typedef {object} FilterValue
 * @property {string} type The event type that needs filtering.
 */
