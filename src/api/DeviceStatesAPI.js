import rp from "request-promise-native";

/**
 * REST API Resource for interacting with device states controlled by ARI.
 */
export default class DeviceStatesAPI {
  /**
   * Create an instance of the DeviceStates API client, providing access
   * to the `/deviceStates` endpoint.
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
   * GET /deviceStates
   *
   * List all ARI controlled device states.
   *
   * @returns {Promise.<Array.<DeviceState>>} Resolves with all device states
   *  controlled by ARI.
   */
  list() {
    return this._request({
      method: "GET",
      uri: `${this._baseUrl}/deviceStates`
    });
  }

  /**
   * GET /deviceStates/{deviceName}
   *
   * Retrieve the current state of a device controlled by ARI.
   *
   * @param {object} params
   * @param {string} params.deviceName The name of the device to retrieve the
   *  current state of.
   * @returns {Promise.<DeviceState>} Resolves with the state of the specified
   *  device.
   */
  get(params) {
    const { deviceName } = params;
    const name = encodeURIComponent(deviceName);

    return this._request({
      method: "GET",
      uri: `${this._baseUrl}/deviceStates/${name}`
    });
  }

  /**
   * PUT /deviceStates/{deviceName}
   *
   * Change the state of a device controlled by ARI. This implicitly creates
   * the device state.
   *
   * @param {object} params
   * @param {string} params.deviceName The name of the device to change the
   *  state of.
   * @param {string} params.deviceState The value to set the device's state to.
   *  Allowed values are 'NOT_INUSE', 'INUSE', 'BUSY', 'INVALID', 'UNAVAILABLE',
   *  'RINGING', 'RINGINUSE', and 'ONHOLD'.
   * @returns {Promise} Resolves when The device state has been successfully
   *  set. Rejects if the provided device name does not match a device
   *  (status 404) or if the device specified is not controlled by ARI
   *  (status 409).
   */
  update(params) {
    const { deviceName, deviceState } = params;
    const name = encodeURIComponent(deviceName);

    return this._request({
      method: "PUT",
      uri: `${this._baseUrl}/deviceStates/${name}`,
      qs: { deviceState }
    });
  }

  /**
   * DELETE /deviceStates/{deviceName}
   *
   * Delete the state of a device controlled by ARI.
   *
   * @param {object} params
   * @param {string} params.deviceName The name of the device to remove the
   *  state of.
   * @returns {Promise} Resolves when The device state has been successfully
   *  removed. Rejects if the provided device name does not match a device
   *  (status 404) or if the device specified is not controlled by ARI
   *  (status 409).
   */
  destroy(params) {
    const { deviceName } = params;
    const name = encodeURIComponent(deviceName);

    return this._request({
      method: "DELETE",
      uri: `${this._baseUrl}/deviceStates/${name}`
    });
  }
}

/**
 * @name DeviceState
 * @typedef DeviceState
 * @property {string} name The name of the device.
 * @property {string} state The device's state.
 */
