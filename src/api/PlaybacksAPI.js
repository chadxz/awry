"use strict";
const rp = require("request-promise-native");

/**
 * REST API Resource for interacting with Asterisk playbacks.
 */
class PlaybacksAPI {
  /**
   * Create an instance of the Playbacks API client, providing access
   * to the `/playbacks` endpoint.
   *
   * @param {object} params
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
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
   * GET /playbacks/{playbackId}
   *
   * Retrieve a playback's details.
   *
   * @param {object} params
   * @param {string} params.playbackId the unique identifier of the playback
   *  to retrieve details of.
   * @returns {Promise.<Playback>} Resolves with the details of the specified
   *  playback. Rejects if the playback cannot be found (status 404).
   */
  get(params) {
    const { playbackId } = params;
    const id = encodeURIComponent(playbackId);

    return this.request({
      method: "GET",
      uri: `${this.baseUrl}/playbacks/${id}`
    });
  }

  /**
   * DELETE /playbacks/{playbackId}
   *
   * Stop a playback.
   *
   * @param {object} params
   * @param {string} params.playbackId The unique identifier of the playback
   *  to stop playback of.
   * @returns {Promise} Resolves when the playback is successfully
   *  stopped. Rejects if the specified playback cannot be found (status 404).
   */
  stop(params) {
    const { playbackId } = params;
    const id = encodeURIComponent(playbackId);

    return this.request({
      method: "DELETE",
      uri: `${this.baseUrl}/playbacks/${id}`
    });
  }

  /**
   * POST /playbacks/{playbackId}/control
   *
   * Perform an operation on the specified playback.
   *
   * @param {object} params
   * @param {string} params.playbackId The unique identifier of the playback
   *  to perform an operation on.
   * @param {string} params.operation The operation to perform on the playback.
   *  Allowed values: 'restart', 'pause', 'unpause', 'reverse', 'forward'
   * @returns {Promise} Resolves when the operation is completedly successfully.
   *  Rejects if the provided operation parameter is invalid (status 400), the
   *  specified playback cannot be found (status 404), or when the operation
   *  cannot be performed on the playback in it's current state (status 409).
   */
  control(params) {
    const { playbackId, operation } = params;
    const id = encodeURIComponent(playbackId);

    return this.request({
      method: "POST",
      uri: `${this.baseUrl}/playbacks/${id}/control`,
      qs: { operation }
    });
  }
}

module.exports = PlaybacksAPI;

/**
 * @name Playback
 * @typedef Playback
 * @property {string} id The unique identifier for this playback operation.
 * @property {string} [language] The language requested for playback. Applicable for media types that support multiple languages.
 * @property {string} media_uri The URI for the media to play back.
 * @property {string} state The current state of the playback operation.
 * @property {string} target_uri The URI for the channel or bridge to play the media on.
 * @property {string} next_media_uri The next media URI in the list to be played back to the resource. *Property available since Asterisk 14.0*
 */
