'use strict';
const rp = require('request-promise-native');

/**
 * REST API Resource for interacting with both live and stored recordings.
 */
class RecordingsAPI {

  /**
   * Create an instance of the Recordings API client, providing access
   * to the `/recordings` endpoint.
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
   * GET /recordings/stored
   *
   * List all completed recordings.
   *
   * @returns {Promise.<Array.<StoredRecording>>}
   */
  listStored() {
    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/recordings/stored`
    });
  }

  /**
   * GET /recordings/stored/{recordingName}
   *
   * Retrieve the details of a specific stored recording.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  recording to retrieve details about.
   * @returns {Promise.<StoredRecording>} Resolves if the recording is sucessfully
   *  retrieved. Rejects if the specified  recording cannot be found (status 404).
   */
  getStored(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/recordings/stored/${name}`
    });
  }

  /**
   * DELETE /recordings/stored/{recordingName}
   *
   * Destroy the specified stored recording.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  recording to destroy.
   * @returns {Promise} Resolves when the specified recording is destroyed.
   *  Rejects if the specified recording cannot be found (status 404).
   */
  destroyStored(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/recordings/stored/${name}`
    });
  }

  /**
   * GET /recordings/stored/{recordingName}/file
   *
   * Retrieve the file associated with the stored recording.
   *
   * *API available since Asterisk 14.0*
   *
   * @param {object} params
   * @param {string} params.recordingName
   * @returns {Promise.<Buffer>} Resolves with the content of the stored
   *  recording. Rejects when the recording file could not be opened
   *  (status 403) or when the recording cannot be found (status 404).
   */
  getStoredFile(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/recordings/stored/${name}/file`
    });
  }

  /**
   * POST /recordings/stored/{recordingName}/copy
   *
   * Create a copy of the specified stored recording.
   *
   * *API available since Asterisk 12.5*
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  recording to create a copy of.
   * @param {string} params.destinationRecordingName The name for the new copy
   *  of the recording.
   * @returns {Promise.<StoredRecording>} Resolves with the newly copied
   *  recording when successful. Rejects if the specified recording cannot
   *  be found (status 404) or if a recording of the same name already exists
   *  on the system (status 409).
   */
  copyStored(params) {
    const { recordingName, destinationRecordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/recordings/stored/${name}/copy`,
      qs: { destinationRecordingName }
    });
  }

  /**
   * GET /recordings/live/{recordingName}
   *
   * Retrieve the details of the specified live recording.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  live recording to retrieve details about.
   * @returns {Promise.<LiveRecording>} Resolves with the specified live
   *  recording details. Rejects if the live recording cannot be found
   *  (status 404).
   */
  getLive(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/recordings/live/${name}`
    });
  }

  /**
   * DELETE /recordings/live/{recordingName}
   *
   * Stop the specified live recording and discard it.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  live recording to act upon.
   * @returns {Promise} Resolves if the recording is successfully cancelled.
   *  Rejects if the recording cannot be found (status 404).
   */
  cancel(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/recordings/live/${name}`
    });
  }

  /**
   * POST /recordings/live/{recordingName}/stop
   *
   * Stop the specified live recording and store it.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  live recording to act upon.
   * @returns {Promise} Resolves if the recording is successfully stopped.
   *  Rejects if the recording cannot be found (status 404).
   */
  stop(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/recordings/live/${name}/stop`
    });
  }

  /**
   * POST /recordings/live/{recordingName}/pause
   *
   * Pause the specified live recording. Pausing a recording suspends silence
   * detection, which will be restarted when the recording is unpaused. Paused
   * time is not included in the accounting for maxDurationSeconds.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  live recording to act upon.
   * @returns {Promise} Resolves if the recording is successfully paused.
   *  Rejects if the recording cannot be found (status 404) or if the specified
   *  recording is not in session. TODO: what does "not in session" mean?
   */
  pause(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/recordings/live/${name}/pause`
    });
  }

  /**
   * DELETE /recordings/live/{recordingName}/pause
   *
   * Unpause the specified live recording.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  live recording to act upon.
   * @returns {Promise} Resolves if the recording is successfully unpaused.
   *  Rejects if the recording cannot be found (status 404) or if the specified
   *  recording is not in session. TODO: what does "not in session" mean?
   */
  unpause(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/recordings/live/${name}/pause`
    });
  }

  /**
   * POST /recordings/live/{recordingName}/mute
   *
   * Mute the specified live recording. Muting a recording suspends silence
   * detection, which will be restarted when the recording is unmuted.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  live recording to act upon.
   * @returns {Promise} Resolves if the recording is successfully muted.
   *  Rejects if the recording cannot be found (status 404) or if the specified
   *  recording is not in session. TODO: what does "not in session" mean?
   */
  mute(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/recordings/live/${name}/mute`
    });
  }

  /**
   * DELETE /recordings/live/{recordingName}/mute
   *
   * Unmute the specified live recording.
   *
   * @param {object} params
   * @param {string} params.recordingName The case-sensitive name of the
   *  live recording to act upon.
   * @returns {Promise} Resolves if the recording is successfully unmuted.
   *  Rejects if the recording cannot be found (status 404) or if the specified
   *  recording is not in session. TODO: what does "not in session" mean?
   */
  unmute(params) {
    const { recordingName } = params;
    const name = encodeURIComponent(recordingName);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/recordings/live/${name}/mute`
    });
  }
}

module.exports = RecordingsAPI;

/**
 * @name StoredRecording
 * @typedef StoredRecording
 * @description A past recording that may be played back.
 * @property {string} format The format of the stored recording.
 * @property {string} name The name of the stored recording.
 */
