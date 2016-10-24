'use strict';
const rp = require('request-promise-native');

/**
 * REST API Resource for interacting with Asterisk Bridges and the channels
 * within those bridges.
 */
class BridgesAPI {

  /**
   * Create an instance of the Bridges API client, providing access to the
   * `/bridges` endpoint.
   *
   * @param {object} params
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
   */
  constructor(params = {}) {
    const { username, password } = params;
    this.baseUrl = params.baseUrl;
    this.request = rp.defaults({
      auth: { username, password },
      json: true
    });
  }

  /**
   * GET /bridges
   *
   * List all active bridges in Asterisk.
   *
   * @returns {Promise.<Array.<Bridge>>} Resolves with all existing bridges
   *  in Asterisk.
   */
  list() {
    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/bridges`
    });
  }

  /**
   * POST /bridges
   *
   * Create a new bridge. This bridge persists until it has been shut down,
   * or Asterisk has been shut down.
   *
   * @param {object} params
   * @param {string|Array.<string>} params.type The attributes to set on the
   *  bridge that determine how the bridge mixes media between its
   *  participants. Possible attributes are 'mixing', 'holding', 'dtmf_events',
   *  and 'proxy_media'. 'dtmf_events' and 'proxy_media' are only valid when
   *  also supplied with 'mixing'. 'holding' and 'mixing' are mutually
   *  exclusive. *Allows multiple values since Asterisk 12.2*
   * @param {string} params.name A name to give to the bridge being created.
   * @param {string} params.bridgeId The unique identifier for the bridge.
   *  *Param available since Asterisk 12.2*
   * @returns {Promise.<Bridge>} Resolves to the newly created bridge.
   */
  create(params = {}) {
    const { type, name, bridgeId } = params;

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges`,
      qs: {
        name,
        bridgeId,
        type: [].concat(type).join(',')
      }
    });
  }

  /**
   * POST /bridges/{bridgeId}
   *
   * Create a new bridge or update an existing one. This bridge persists
   * until it has been shut down, or Asterisk has been shut down.
   *
   * *API available since Asterisk 12.2*
   *
   * @param {object} params
   * @param {string|Array.<string>} params.type The attributes to set on the
   *  bridge that determine how the bridge mixes media between its
   *  participants. Possible attributes are 'mixing', 'holding', 'dtmf_events',
   *  and 'proxy_media'. 'dtmf_events' and 'proxy_media' are only valid when
   *  also supplied with 'mixing'. 'holding' and 'mixing' are mutually
   *  exclusive.
   * @param {string} params.name A name to give to the bridge being created.
   * @param {string} params.bridgeId The unique identifier for the bridge.
   * @returns {Promise.<Bridge>} Resolves to the newly created bridge.
   */
  createOrUpdate(params = {}) {
    const { type, name, bridgeId } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges/${id}`,
      qs: {
        name,
        type: [].concat(type).join(',')
      }
    });
  }

  /**
   * GET /bridges/{bridgeId}
   *
   * Get details of a specific bridge.
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifier of the bridge to retrieve
   *  details for.
   * @returns {Promise.<Bridge>} Resolves to the details matching the specified
   *  bridgeId. Rejects if the bridge could not be found (status 404).
   */
  get(params = {}) {
    const { bridgeId } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/bridges/${id}`
    });
  }

  /**
   * DELETE /bridges/{bridgeId}
   *
   * Shut down a bridge. If any channels are in this bridge, they will be
   * removed and resume whatever they were doing beforehand.
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifer of the bridge to delete.
   * @returns {Promise} Resolves if the bridge is successfully deleted.
   *  Rejects if the bridge could not be found (status 404).
   */
  destroy(params = {}) {
    const { bridgeId } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/bridges/${id}`
    });
  }

  /**
   * POST /bridges/{bridgeId}/addChannel
   *
   * Add a channel to a bridge.
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifer of the bridge to add the
   *  channels to.
   * @param {string|Array.<string>} params.channel The channel or list of
   *  channels to add to the bridge.
   * @param {string} params.role The channels' role in the bridge.
   * @return {Promise} Resolves if the channels are successfully added to
   * the bridge. Rejected if one of the channels is not found (status 400),
   * the bridge could not be found (status 404), the bridge is not in the
   * Stasis application (status 409), one of the specified channels is
   * currently recording (status 409), or one of the channels is not in the
   * Stasis application (status 422).
   */
  addChannel(params = {}) {
    const { channel, role, bridgeId } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges/${id}/addChannel`,
      qs: {
        channel: [].concat(channel).join(','),
        role
      }
    });
  }

  /**
   * POST /bridges/{bridgeId}/removeChannel
   *
   * Remove a channel from a bridge.
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifier of the bridge to remove
   *  the channels from.
   * @param {string|Array.<string>} params.channel The channel or list of
   *  channels to remove from the bridge.
   * @return {Promise} Resolves if the channels are successfully removed from
   * the bridge. Rejected if one of the channels is not found (status 400),
   * the bridge could not be found (status 404), the bridge is not in the
   * Stasis application (status 409), or one of the channels is not in the
   * bridge (status 422).
   */
  removeChannel(params = {}) {
    const { channel, bridgeId } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges/${id}/removeChannel`,
      qs: { channel: [].concat(channel).join(',') }
    });
  }

  /**
   * POST /bridges/{bridgeId}/moh
   *
   * Play music on hold to a bridge or change the music on hold class
   * that is currently playing.
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifier of the bridge to play
   *  music on hold into.
   * @param {string} params.mohClass The class of music on hold to play.
   * @returns {Promise} Resolves when the music has successfully started playing
   *  in the bridge. Rejects if the bridge could not be found (status 404)
   *  or the bridge is not in the Stasis application (status 409).
   */
  startMusicOnHold(params = {}) {
    const { bridgeId, mohClass } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges/${id}/moh`,
      qs: { mohClass }
    });
  }

  /**
   * DELETE /bridges/{bridgeId}/moh
   *
   * Stop playing music on hold to a bridge. This will only stop music on hold
   * that had been previously started via ARI.
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifier of the bridge to stop
   *  playing music on hold to.
   * @returns {Promise} Resolves when the music has successfully stopped playing
   *  in the bridge. Rejects if the bridge could not be found (status 404)
   *  or the bridge is not in the Stasis application (status 409).
   */
  stopMusicOnHold(params = {}) {
    const { bridgeId } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/bridges/${id}/moh`
    });
  }

  /**
   * POST /bridges/{bridgeId}/play
   *
   * Start playback of media on a bridge. The media URI may be any of a number
   * of URIs. The currently support URIs are 'sound:', 'recording:', 'number:',
   * 'digits:', 'characters:', and 'tone:'. This operation creates a playback
   * resource that can be used to control the playback of media (pause,
   * rewind, fast-forward, etc.)
   *
   * *'tone:' playback uri added in Asterisk 12.3*
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifier of the bridge to play media
   *  into.
   * @param {string|Array.<string>} params.media The media's URI to play. *Allows
   *  multiple media to be passed since Asterisk 14.0*
   * @param {string} params.playbackId The playback identifier to attach to
   *  the Playback instance. *Param available since Asterisk 12.2*
   * @param {string} [params.lang] For sounds, the language of the sound to play.
   * @param {number} [params.offsetms=0] The number of milliseconds to skip from
   *  the beginning of the media before starting playback. Allowed range: 0+
   * @param {number} [params.skipms=3000] The number of milliseconds to skip
   *  for forward/reverse operations. Allowed range: 0+
   * @returns {Promise.<Playback>} Resolved with the Playback instance when
   *  the playback is successfully started. Rejects when the bridge is not
   *  found (status 404) or the bridge is not in the Stasis application
   *  (status 409).
   */
  play(params = {}) {
    const {
      bridgeId,
      media,
      playbackId,
      lang,
      offsetms = 0,
      skipms = 3000
    } = params;

    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges/${id}/play`,
      qs: {
        media: [].concat(media).join(','),
        lang,
        offsetms,
        skipms,
        playbackId
      }
    });
  }

  /**
   * POST /bridges/{bridgeId}/play/{playbackId}
   *
   * Start playback of media on a bridge. The media URI may be any of a
   * number of URIs. The currently support URIs are 'sound:', 'recording:',
   * 'number:', 'digits:', 'characters:', and 'tone:'. This operation creates
   * a playback resource that can be used to control the playback of media
   * (pause, rewind, fast-forward, etc.)
   *
   * *API available since Asterisk 12.2*
   * *'tone:' playback uri added in Asterisk 12.3*
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifier of the bridge to play media
   *  into.
   * @param {string|Array.<string>} params.media The media's URI to play.
   *  *Allows multiple media to be passed since Asterisk 14.0*
   * @param {string} params.playbackId The playback identifier to attach to
   *  the Playback instance.
   * @param {string} [params.lang] For sounds, the language of the sound to play.
   * @param {number} [params.offsetms=0] The number of milliseconds to skip from
   *  the beginning of the media before starting playback. Allowed range: 0+
   * @param {number} [params.skipms=3000] The number of milliseconds to skip
   *  for forward/reverse operations. Allowed range: 0+
   * @returns {Promise.<Playback>} Resolved with the Playback instance when
   *  the playback is successfully started. Rejects when the bridge is not
   *  found (status 404) or the bridge is not in the Stasis application
   *  (status 409).
   */
  playWithId(params = {}) {
    const {
      bridgeId,
      media,
      playbackId,
      lang,
      offsetms = 0,
      skipms = 3000
    } = params;
    const id = encodeURIComponent(bridgeId);
    const playId = encodeURIComponent(playbackId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges/${id}/play/${playId}`,
      qs: {
        media: [].concat(media).join(','),
        lang,
        offsetms,
        skipms
      }
    });
  }

  /**
   * POST /bridges/{bridgeId}/record
   *
   * Start a recording. This records the mixed audio from all channels
   * participating in this bridge.
   *
   * @param {object} params
   * @param {string} params.bridgeId The identifier of the bridge to record.
   * @param {string} params.name The recordings filename.
   * @param {string} [params.format=wav] The format to encode the audio in.
   * @param {number} [params.maxDurationSeconds=0] The maximum duration of
   *  the recording, in seconds. Pass 0 for no limit. Allowed range: 0+
   * @param {number} [params.maxSilenceSeconds=0] The maximum duration of
   *  silence, in seconds. Pass 0 for no limit. Allowed range: 0+
   * @param {string} [params.ifExists=fail] The action to take if a recording
   *  with the same name already exists. Allowed values: 'fail', 'overwrite',
   *  or 'append'.
   * @param {boolean} [params.beep=true] Play a beep when recording begins.
   * @param {string} [params.terminateOn=none] DTMF input to terminate
   *  recording. Allowed values: 'none', 'any', '*', or '#'.
   * @returns {Promise.<LiveRecording>} Resolves with the created LiveRecording
   *  instance if the recording is successfully started. Rejects if invalid
   *  parameters are passed (status 400), the bridge is not found (status 404),
   *  the bridge is not in the Stasis application (status 409), a recording
   *  with the same name already exists on the system and cannot be overwritten
   *  because it is already in progress or the `ifExists` param is set to 'fail'
   *  (status 409), or the specified format is unknown (status 422).
   */
  record(params = {}) {
    const {
      bridgeId,
      name,
      format = 'wav',
      maxDurationSeconds = 0,
      maxSilentSeconds = 0,
      ifExists = 'fail',
      beep = true,
      terminateOn = 'none'
    } = params;
    const id = encodeURIComponent(bridgeId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/bridges/${id}/record`,
      qs: {
        name,
        format,
        maxDurationSeconds,
        maxSilentSeconds,
        ifExists,
        beep,
        terminateOn
      }
    });
  }
}

module.exports = BridgesAPI;

/**
 * @name Bridge
 * @typedef Bridge
 * @description The merging of media from one or more channels.
 * @property {string} bridge_class The bridging class.
 * @property {string} bridge_type The type of bridge technology.
 * @property {Array.<string>} channels The Ids of channels participating in this bridge.
 * @property {string} id The unique identifier for this bridge.
 * @property {string} technology The name of the current bridging technology.
 * @property {string} name The name the creator gave to this bridge. *Property available since Asterisk 12.1*
 * @property {string} creator The entity that created the bridge. *Property available since Asterisk 12.1*
 */

/**
 * @name LiveRecording
 * @typedef LiveRecording
 * @description A recording that is in progress.
 * @property {string} [cause] The cause for the recording failure if it failed.
 * @property {string} format The recording format (wav, gsm, etc.)
 * @property {string} name The base name for the recording.
 * @property {string} state The state the recording is currently in.
 * @property {string} target_uri The uri for the channel or bridge being recorded. *Property available since Asterisk 12.2*
 * @property {number} [duration] The duration in seconds of the recording. *Property available since Asterisk 12.5*
 * @property {number} [talking_duration] The duration of talkin, in seconds, detected in the recording. This is only available if the recording was initiated with a non-zero maxSilenceSeconds. *Property available since Asterisk 12.5*
 * @property {number} [silence_duration] The duration of silence, in seconds, detected in the recording. This is only available if the recording was initiated with a non-zero maxSilenceSeconds. *Property available since Asterisk 12.5*
 */
