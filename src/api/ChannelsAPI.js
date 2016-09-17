'use strict';
const rp = require('request-promise-native');

/**
 * REST API Resource for interacting with Asterisk Channels.
 */
class ChannelsAPI {

  /**
   * Create an instance of the Bridges API client, providing access to the
   * `/channels` endpoint.
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
   * GET /channels
   *
   * List all active channels in Asterisk.
   *
   * @returns {Promise.<Array.<Channel>>} Resolves with the list of all active
   *  channels in Asterisk.
   */
  list() {
    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/channels`
    });
  }

  /**
   * POST /channels
   *
   * Create a new channel (originate). The new channel is created immediately
   * and a snapshot of it is returned. If a stasis application is provided,
   * that application will be automatically subscribed to the originated
   * channel for further events and updates.
   *
   * @param {object} params
   * @param {string} params.endpoint The endpoint to call
   * @param {string} [params.extension] The extension to dial after the endpoint
   *  answers. Mutually exclusive with `app`.
   * @param {string} [params.context] The context to dial after the endpoint
   *  answers. If omitted, uses 'default'. Mutually exclusive with `app`.
   * @param {number} [params.priority] The priority to dial after the endpoint
   *  answers. If omitted, uses 1. Mutually exclusive with `app`.
   * @param {string} [params.label] The label to dial after the endpoint
   *  answers. Will supersede `params.priority` if both are provided. Mutually
   *  exclusive with `app`.
   * @param {string} [params.app] The application that is subscribed to the
   *  originated channel. When the channel is answered, it will be passed to
   *  this stasis application. Mutually exclusive with `context`, `extension`,
   *  `priority`, and `label`.
   * @param {string} [params.appArgs] The application arguments to pass to
   *  the stasis application provided by `app`. Mutually exclusive with
   *  `context`, `extension`, `priority`, and `label`.
   * @param {string} [params.callerId] CallerID to use when dialing the
   *  endpoint or extension.
   * @param {number} [params.timeout=30] The timeout in seconds before giving
   *  up dialing, or -1 for no timeout.
   * @param {string} [params.channelId] The unique id to assign the channel
   *  on creation.
   * @param {string} [params.otherChannelId] The unique id to assign the
   *  second channel when using local channels.
   * @param {string} [params.originator] The unique id of the channel which
   *  is originating this one.
   * @param {string|Array.<string>} [params.formats] The format name
   *  capability list to use if originator is not specified. For example,
   *  ['ulaw', 'slin16']. Format names can be found by executing the
   *  `core show codecs` command in the Asterisk console.
   * @param {object} [params.variables] An object of key/value pairs that
   *  should be set on the channel on creation.
   * @returns {Promise.<Channel>} Resolves with the newly created channel.
   *  Rejects when invalid params are passed (status 400).
   */
  originate(params) {
    const {
      endpoint,
      extension,
      context,
      priority,
      label,
      app,
      appArgs,
      callerId,
      timeout = 30,
      channelId,
      otherChannelId,
      originator,
      formats,
      variables
    } = params;


    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels`,
      qs: {
        endpoint,
        extension,
        context,
        priority,
        label,
        app,
        appArgs,
        callerId,
        timeout,
        channelId,
        otherChannelId,
        originator,
        formats: [].concat(formats).join(',')
      },
      body: { variables }
    });
  }

  /**
   * GET /channels/{channelId}
   *
   * Retrieve details about the specified channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to retrieve.
   * @returns {Promise.<Channel>} Resolves with the details of the specified
   *  channel. Rejects when a channel matching the provided channelId cannot
   *  be found (status 404).
   */
  get(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/channels/${id}`
    });
  }

  /**
   * POST /channels/{channelId}
   *
   * Create a new channel (originate with id). The new channel is created
   * immediately and a snapshot of it is returned. If a stasis application
   * is provided, that application will be automatically subscribed to the
   * originated channel for further events and updates.
   *
   * @param {object} params
   * @param {string} params.channelId The unique id to assign the channel
   *  on creation.
   * @param {string} params.endpoint The endpoint to call
   * @param {string} [params.extension] The extension to dial after the endpoint
   *  answers. Mutually exclusive with `app`.
   * @param {string} [params.context] The context to dial after the endpoint
   *  answers. If omitted, uses 'default'. Mutually exclusive with `app`.
   * @param {number} [params.priority] The priority to dial after the endpoint
   *  answers. If omitted, uses 1. Mutually exclusive with `app`.
   * @param {string} [params.label] The label to dial after the endpoint
   *  answers. Will supersede `params.priority` if both are provided. Mutually
   *  exclusive with `app`.
   * @param {string} [params.app] The application that is subscribed to the
   *  originated channel. When the channel is answered, it will be passed to
   *  this stasis application. Mutually exclusive with `context`, `extension`,
   *  `priority`, and `label`.
   * @param {string} [params.appArgs] The application arguments to pass to
   *  the stasis application provided by `app`. Mutually exclusive with
   *  `context`, `extension`, `priority`, and `label`.
   * @param {string} [params.callerId] CallerID to use when dialing the
   *  endpoint or extension.
   * @param {number} [params.timeout=30] The timeout in seconds before giving
   *  up dialing, or -1 for no timeout.
   * @param {string} [params.otherChannelId] The unique id to assign the
   *  second channel when using local channels.
   * @param {string} [params.originator] The unique id of the channel which
   *  is originating this one.
   * @param {string|Array.<string>} [params.formats] The format name
   *  capability list to use if originator is not specified. For example,
   *  ['ulaw', 'slin16']. Format names can be found by executing the
   *  `core show codecs` command in the Asterisk console.
   * @param {object} [params.variables] An object of key/value pairs that
   *  should be set on the channel on creation.
   * @returns {Promise.<Channel>} Resolves with the newly created channel.
   *  Rejects when invalid params are passed (status 400).
   */
  originateWithId(params) {
    const {
      channelId,
      endpoint,
      extension,
      context,
      priority,
      label,
      app,
      appArgs,
      callerId,
      timeout = 30,
      otherChannelId,
      originator,
      formats,
      variables
    } = params;

    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}`,
      qs: {
        endpoint,
        extension,
        context,
        priority,
        label,
        app,
        appArgs,
        callerId,
        timeout,
        otherChannelId,
        originator,
        formats: [].concat(formats).join(',')
      },
      body: { variables }
    });
  }

  /**
   * DELETE /channels/{channelId}
   *
   * Delete (i.e. hangup) a channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to hangup.
   * @param {string} params.reason The reason for hanging up the channel.
   *  Allowed values: 'normal', 'busy', 'congestion', or 'no_answer'.
   * @returns {Promise} Resolves when the hangup is successful. Rejects when
   *  an invalid reason for hangup is provided (status 400) or the specified
   *  channel cannot be found (status 404).
   */
  hangup(params) {
    const { channelId, reason } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/channels/${id}`,
      qs: { reason }
    });
  }

  /**
   * POST /channels/{channelId}/continue
   *
   * Exit the ARI application; Continue execution in the dialplan.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to continue in
   *  dialplan.
   * @param {string} params.context The context to continue to.
   * @param {string} params.extension The extension to continue to.
   * @param {number} params.priority The priority to continue to.
   * @param {string} params.label The label to continue to. Will supersede
   *  `priority` if both are provided.
   * @returns {Promise} Resolves when the operation is successful. Rejects
   *  when the specified channel cannot be found (status 404) or the specified
   *  channel is not in a stasis application (status 409).
   */
  continueInDialplan(params) {
    const { channelId, context, extension, priority, label } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/continue`,
      qs: { context, extension, priority, label }
    });
  }

  /**
   * POST /channels/{channelId}/redirect
   *
   * Redirect the channel to a different location.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to redirect.
   * @param {string} params.endpoint The endpoint to redirect the channel to.
   * @returns {Promise} Resolves when the redirect is successful. Rejects when
   *  the endpoint param is not provided (status 400), the specified channel
   *  or endpoint is not found (status 404), the specified channel is not in
   *  a stasis application (status 409), or the specified endpoint is not the
   *  same type as the channel (status 422).
   */
  redirect(params) {
    const { channelId, endpoint } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/redirect`,
      qs: { endpoint }
    });
  }

  /**
   * POST /channels/{channelId}/answer
   *
   * Answer the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to answer.
   * @returns {Promise} Resolves when the channel is successfully answered.
   *  Rejects when the specified channel cannot be found (status 404) or
   *  the specified channel is not in a stasis application (status 409).
   */
  answer(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/answer`
    });
  }

  /**
   * POST /channels/{channelId}/ring
   *
   * Indicate ringing on the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to indicate
   *  ringing to.
   * @returns {Promise} Resolves when the ringing has begun. Rejects when the
   *  specified channel cannot be found (status 404) or the specified channel
   *  is not in a stasis application (status 409).
   */
  ring(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/ring`
    });
  }

  /**
   * DELETE /channels/{channelId}/ring
   *
   * Stop ringing indication on the channel if locally generated.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to stop indicating
   *  ringing to.
   * @returns {Promise} Resolves when the ringing has successfully stopped.
   *  Rejects when the specified channel cannot be found (status 404) or the
   *  specified channel is not in a stasis application (status 409).
   */
  ringStop(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/channels/${id}/ring`
    });
  }

  /**
   * POST /channels/{channelId}/dtmf
   *
   * Send the provided DTMF to the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to send DTMF to.
   * @param {string} params.dtmf The DTMF to send to the channel.
   * @param {number} [params.before=0] The amount of time to wait before DTMF
   *  digits are started (specified in milliseconds).
   * @param {number} [params.between=100] The amount of time in between DTMF
   *  digits (specified in milliseconds).
   * @param {number} [params.duration=100] The length of each DTMF digit
   *  (specified in milliseconds).
   * @param {number} [params.after=0] The amount of time to wait after the DTMF
   *  digits end (specified in milliseconds).
   * @returns {Promise} Resolves when the specified DTMF have been successfully
   *  played. Rejects when the DTMF is not specified (status 400), the specified
   *  channel is not found (status 404), or when the specified channel is not
   *  in a stasis application (status 409).
   */
  sendDTMF(params) {
    const {
      channelId,
      dtmf,
      before = 0,
      between = 100,
      duration = 100,
      after = 0
    } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/dtmf`,
      qs: { dtmf, before, between, duration, after }
    });
  }

  /**
   * POST /channels/{channelId}/mute
   *
   * Mute the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to mute.
   * @param {string} [params.direction=both] The direction in which to mute
   *  audio. Valid values: 'both', 'in', or 'out'.
   * @returns {Promise} Resolves when the channel is successfully muted.
   *  Rejects when the channel is not found (status 404) or when the channel
   *  is not in a stasis application (status 409).
   */
  mute(params) {
    const { channelId, direction = 'both' } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/mute`,
      qs: { direction }
    });
  }

  /**
   * DELETE /channels/{channelId}/mute
   *
   * Unmute the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to unmute.
   * @param {string} [params.direction=both] The direction in which to unmute
   *  audio. Valid values: 'both', 'in', or 'out'.
   * @returns {Promise} Resolves when the channel is successfully unmuted.
   *  Rejects when the channel is not found (status 404) or when the channel
   *  is not in a stasis application (status 409).
   */
  unmute(params) {
    const { channelId, direction = 'both' } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/channels/${id}/mute`,
      qs: { direction }
    });
  }

  /**
   * POST /channels/{channelId}/hold
   *
   * Hold the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to hold.
   * @returns {Promise} Resolves when the channel is successfully held.
   *  Rejects when the channel is not found (status 404) or when the channel
   *  is not in a stasis application (status 409).
   */
  hold(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/hold`
    });
  }

  /**
   * DELETE /channels/{channelId}/hold
   *
   * Remove the channel from hold.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to unhold.
   * @returns {Promise} Resolves when the channel is successfully unheld.
   *  Rejects when the channel is not found (status 404) or when the channel
   *  is not in a stasis application (status 409).
   */
  unhold(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/channels/${id}/hold`
    });
  }

  /**
   * POST /channels/{channelId}/moh
   *
   * Play music on hold to the channel. Using media operations such as /play
   * on a channel playing music on hold in this manner will suspend music on
   * hold without resuming automatically. If continuing music on hold is desired,
   * the stasis application must re-initiate it.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to play music on
   *  hold to.
   * @param {string} params.mohClass The class of music on hold to play.
   * @returns {Promise} Resolves when the music has successfully started
   *  playing. Rejects when the channel is not found (status 404) or the
   *  channel is not in a stasis application (status 409).
   */
  startMusicOnHold(params) {
    const { channelId, mohClass } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/moh`,
      qs: { mohClass }
    });
  }

  /**
   * DELETE /channels/{channelId}/moh
   *
   * Stop playing music on hold to the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to stop music on hold.
   * @returns {Promise} Resolves when the music on hold has successfully stopped.
   *  Rejects when the channel is not found (status 404) or the channel is
   *  not in a stasis application (status 409).
   */
  stopMusicOnHold(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/channels/${id}/moh`
    });
  }

  /**
   * POST /channels/{channelId}/silence
   *
   * Play silence to a channel. Using media operations such as /play on a
   * channel playing silence in this manner will suspend silence without
   * resuming it automatically.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to play silence to.
   * @returns {Promise} Resolves when the silence is successfully playing to
   *  the channel. Rejects when the channel is not found (status 404) or the
   *  channel is not in a stasis application (status 409).
   */
  startSilence(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/silence`
    });
  }

  /**
   * DELETE /channels/{channelId}/silence
   *
   * Stop playing silence to the channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to stop playing
   *  silence to.
   * @returns {Promise} Resolves when the silence is successfully stopped in
   *  the channel. Rejects when the channel is not found (status 404) or the
   *  channel is not in a stasis application (status 409).
   */
  stopSilence(params) {
    const { channelId } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/channels/${id}/silence`
    });
  }

  /**
   * POST /channels/{channelId}/play
   *
   * Start playback of media. The media URI may be any of a number of URIs.
   * `sound:`, `recording:`, `number:`, `digits:`, `characters:`, and `tone:`
   * URIs are supported. This operation creates a playback resource that can
   * be used to control the playback of media (pause, rewind, fast forward, etc.)
   *
   * @param {object} params
   * @param {string} params.channelId the id of the channel to play the media
   *  to.
   * @param {string} params.media The media's URI to play.
   * @param {string} [params.lang] For sounds, the language for the sound.
   * @param {number} [params.offsetms=0] The number of milliseconds to skip
   *  before playing the media URI. Allowed range: 0+
   * @param {number} [params.skipms=3000] The number of milliseconds to
   *  skip for forward/reverse operations. Allowed range: 0+
   * @param {string} [params.playbackId] The identifier of the playback that
   *  is started.
   * @returns {Promise.<Playback>} Resolves with the details of the started
   *  playback.
   */
  play(params) {
    const {
      channelId,
      media,
      lang,
      offsetms = 0,
      skipms = 3000,
      playbackId
    } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/play`,
      qs: { media, lang, offsetms, skipms, playbackId }
    });
  }

  /**
   * POST /channels/{channelId}/play/{playbackId}
   *
   * Start playback of media and specify the playbackId. The media URI may
   * be any of a number of URIs. `sound:`, `recording:`, `number:`, `digits:`,
   * `characters:`, and `tone:` URIs are supported. This operation creates
   * a playback resource that can be used to control the playback of media
   * (pause, rewind, fast forward, etc.)
   *
   * @param {object} params
   * @param {string} params.channelId the id of the channel to play the media
   *  to.
   * @param {string} params.playbackId The identifier of the playback that
   *  is started.
   * @param {string} params.media The media's URI to play.
   * @param {string} [params.lang] For sounds, the language for the sound.
   * @param {number} [params.offsetms] The number of milliseconds to skip
   *  before playing the media URI. Allowed range: 0+
   * @param {number} [params.skipms=3000] The number of milliseconds to
   *  skip for forward/reverse operations. Allowed range: 0+

   * @returns {Promise.<Playback>} Resolves with the details of the started
   *  playback.
   */
  playWithId(params) {
    const {
      channelId,
      playbackId,
      media,
      lang,
      offsetms = 0,
      skipms = 3000
    } = params;
    const id = encodeURIComponent(channelId);
    const playId = encodeURIComponent(playbackId);
    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/play/${playId}`,
      qs: { media, lang, offsetms, skipms }
    });
  }

  /**
   * POST /channels/{channelId}/record
   *
   * Start a recording. Record audio from the channel. Note that this will
   * not capture audio send to the channel. The bridge itself has a record
   * feature if that's what you want.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to record.
   * @param {string} params.name The recording's filename.
   * @param {string} params.format The format to record the audio in.
   * @param {number} [params.maxDurationSeconds=0] The maximum duration of
   *  the recording, in seconds. 0 for no limit. Allowed range: 0+
   * @param {number} [params.maxSilenceSeconds=0] The maximum duration of
   *  silence, in seconds. o for no limit. Allowed range: 0+
   * @param {string} [params.ifExists=fail] The action to take if a recording
   *  with the same name already exists. Allowed values: 'fail', 'overwrite',
   *  or 'append'.
   * @param {boolean} [params.beep=true] Play beep when recording begins.
   * @param {string} [params.terminateOn=none] DTMF input to terminate
   *  recording. Allowed values: 'none', 'any', '*', or '#'.
   * @returns {Promise.<LiveRecording>} Resolves with the details of the
   *  ongoing recording. Rejects if invalid parameters are provided (status 400),
   *  if the channel is not found (status 404); if the channel is not in
   *  a stasis application (status 409); if the channel is currently bridged
   *  with other channels (status 409); if a recording of the same name
   *  already exists on the system and cannot be overwritten because it is
   *  in progress or ifExists was set to 'fail' (status 409); or if the format
   *  specified is unknown on the system (status 422).
   */
  record(params) {
    const {
      channelId,
      name,
      format,
      maxDurationSeconds = 0,
      maxSilenceSeconds = 0,
      ifExists = 'fail',
      beep = true,
      terminateOn = 'none'
    } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/record`,
      qs: {
        name,
        format,
        maxDurationSeconds,
        maxSilenceSeconds,
        ifExists,
        beep,
        terminateOn
      }
    });
  }

  /**
   * GET /channels/{channelId}/variable
   *
   * Retrieve the value of a channel variable or function.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to get a variable
   *  from.
   * @param {string} params.variable The channel variable or function to retrieve.
   * @returns {Promise.<Variable>} Resolves with the specified variable. Rejects
   *  if the variable parameter is not provided (status 400), if the channel
   *  or variable is not found (status 404), or if the channel is not in a
   *  stasis application (status 409).
   */
  getChannelVariable(params) {
    const { channelId, variable } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/channels/${id}/variable`,
      qs: { variable }
    });
  }

  /**
   * POST /channels/{channelId}/variable
   *
   * Set the value of a channel variable or function.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to set the variable
   *  on.
   * @param {string} params.variable The channel variable or function to set.
   * @param {string} params.value The value to set the variable to.
   * @returns {Promise} Resolves when the specified variable is set on the
   *  channel. Rejects if the variable parameter is not provided (status 400),
   *  if the channel or variable is not found (status 404), or if the channel
   *  is not in a stasis application (status 409).
   */
  setChannelVariable(params) {
    const { channelId, variable, value } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/variable`,
      qs: { variable, value }
    });
  }

  /**
   * POST /channels/{channelId}/snoop
   *
   * Snoop (spy/whisper) on the specified channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to snoop on.
   * @param {string} params.app the application the snooping channel is
   *  placed into.
   * @param {string} [params.spy=none] The direction of audio to spy on.
   *  Allowed values: 'none', 'both', 'out', or 'in'.
   * @param {string} [params.whisper=none] The direction of audio to whisper
   *  into. Allowed values: 'none', 'both', 'out', or 'in'.
   * @param {string} [params.appArgs] The application arguments to pass to
   *  the stasis application.
   * @param {string} [params.snoopId] The id to assign to the snooping channel.
   * @returns {Promise.<Channel>} Resolves with the newly created snoop channel.
   *  Rejects if invalid parameters are passed (status 400) or if the channel
   *  cannot be found (status 404).
   */
  snoopChannel(params) {
    const {
      channelId,
      app,
      spy = 'none',
      whisper = 'none',
      appArgs,
      snoopId
    } = params;
    const id = encodeURIComponent(channelId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/snoop`,
      qs: { app, spy, whisper, appArgs, snoopId }
    });
  }

  /**
   * POST /channels/{channelId}/snoop/{snoopId}
   *
   * Snoop (spy/whisper) on the specified channel.
   *
   * @param {object} params
   * @param {string} params.channelId The id of the channel to snoop on.
   * @param {string} params.snoopId The id to assign to the snooping channel.
   * @param {string} params.app the application the snooping channel is
   *  placed into.
   * @param {string} [params.spy=none] The direction of audio to spy on.
   *  Allowed values: 'none', 'both', 'out', or 'in'.
   * @param {string} [params.whisper=none] The direction of audio to whisper
   *  into. Allowed values: 'none', 'both', 'out', or 'in'.
   * @param {string} [params.appArgs] The application arguments to pass to
   *  the stasis application.
   * @returns {Promise.<Channel>} Resolves with the newly created snoop channel.
   *  Rejects if invalid parameters are passed (status 400) or if the channel
   *  cannot be found (status 404).
   */
  snoopChannelWithId(params) {
    const {
      channelId,
      snoopId,
      app,
      spy = 'none',
      whisper = 'none',
      appArgs
    } = params;
    const id = encodeURIComponent(channelId);
    const sid = encodeURIComponent(snoopId);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/channels/${id}/snoop/${sid}`,
      qs: { app, spy, whisper, appArgs }
    });
  }
}

module.exports = ChannelsAPI;

/**
 * @name Channel
 * @typedef Channel
 * @description A specific communication connection between Asterisk and an Endpoint.
 * @property {string} accountcode
 * @property {object} caller
 * @property {string} caller.name
 * @property {string} caller.number
 * @property {object} connected
 * @property {string} connected.name
 * @property {string} creationtime The timestamp when the channel was created.
 * @property {object} dialplan The current location in the dialplan.
 * @property {string} dialplan.context The context in the dialplan.
 * @property {string} dialplan.exten The extension in the dialplan.
 * @property {number} dialplan.priority The priority in the dialplan.
 * @property {string} id The unique identifier of the channel. This is the same as the Uniqueid field in AMI.
 * @property {string} language The default spoken language.
 * @property {string} name The name of the channel (i.e. SIP/foo-0000a7e3).
 * @property {string} state
 */
