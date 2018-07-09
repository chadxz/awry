import rp from "request-promise-native";

/**
 * REST API Resource for creating an Asterisk user event.
 */
export default class EventsAPI {
  /**
   * Create an instance of the Events API client, providing access
   * to the `/events` endpoint.
   *
   * @param {object} params
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
   */
  constructor(params) {
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
   * POST /events/user/{eventName}
   *
   * Generate a user event.
   *
   * *API available since Asterisk 12.3*
   *
   * @param {object} params
   * @param {string} params.eventName The event name to generate.
   * @param {string} params.application The name of the application that will
   *  receive this event.
   * @param {string|Array.<string>} [params.source] The URI(s) for the event
   *  source. Valid sources are: 'channel:{channelId}', 'bridge:{bridgeId}',
   *  'endpoint:{technology}/{resource}', 'deviceState:{deviceName}'. For example,
   *  'endpoint:pjsip/6001'.
   * @param {object} [params.variables] An object of key/value pairs that should
   *  be sent to set variables in the user event.
   * @returns {Promise} Resolves when the event is successfully dispatched.
   *  Rejects when the specified application does not exist (status 404),
   *  one of the specified event sources cannot be found (status 422), or
   *  either the event data or one of the source URIs are invalid (status 400).
   */
  generateUserEvent(params) {
    const { eventName, application, source, variables } = params;
    const evt = encodeURIComponent(eventName);

    return this._request({
      method: "POST",
      uri: `${this._baseUrl}/events/user/${evt}`,
      qs: {
        application,
        source: [].concat(source).join(",")
      },
      body: { variables }
    });
  }
}
