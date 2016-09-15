'use strict';
const ApplicationsAPI = require('./ApplicationsAPI');
const AsteriskAPI = require('./AsteriskAPI');
const BridgesAPI = require('./BridgesAPI');
const DeviceStatesAPI = require('./DeviceStatesAPI');
const EndpointsAPI = require('./EndpointsAPI');
const EventsAPI = require('./EventsAPI');
const MailboxesAPI = require('./MailboxesAPI');
const PlaybacksAPI = require('./PlaybacksAPI');
const RecordingsAPI = require('./RecordingsAPI');
const SoundsAPI = require('./SoundsAPI');
const ChannelsAPI = require('./ChannelsAPI');

/**
 * Client for interacting with the Asterisk Rest Interface.
 */
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
    this.deviceStates = new DeviceStatesAPI(params);
    this.endpoints = new EndpointsAPI(params);
    this.events = new EventsAPI(params);
    this.mailboxes = new MailboxesAPI(params);
    this.playbacks = new PlaybacksAPI(params);
    this.recordings = new RecordingsAPI(params);
    this.sounds = new SoundsAPI(params);
    this.channels = new ChannelsAPI(params);
  }
}

module.exports = API;
