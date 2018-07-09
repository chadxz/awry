import ApplicationsAPI from "./ApplicationsAPI";
import AsteriskAPI from "./AsteriskAPI";
import BridgesAPI from "./BridgesAPI";
import DeviceStatesAPI from "./DeviceStatesAPI";
import EndpointsAPI from "./EndpointsAPI";
import EventsAPI from "./EventsAPI";
import MailboxesAPI from "./MailboxesAPI";
import PlaybacksAPI from "./PlaybacksAPI";
import RecordingsAPI from "./RecordingsAPI";
import SoundsAPI from "./SoundsAPI";
import ChannelsAPI from "./ChannelsAPI";

/**
 * Client for interacting with the Asterisk Rest Interface.
 */
export default class API {
  /**
   * Creates a new awry API instance, providing clients for all available
   * Asterisk ARI endpoints.
   *
   * @param {object} params
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
   */
  constructor(params) {
    /** @type {ApplicationsAPI} */
    this.applications = new ApplicationsAPI(params);

    /** @type {AsteriskAPI} */
    this.asterisk = new AsteriskAPI(params);

    /** @type {BridgesAPI} */
    this.bridges = new BridgesAPI(params);

    /** @type {DeviceStatesAPI} */
    this.deviceStates = new DeviceStatesAPI(params);

    /** @type {EndpointsAPI} */
    this.endpoints = new EndpointsAPI(params);

    /** @type {EventsAPI} */
    this.events = new EventsAPI(params);

    /** @type {MailboxesAPI} */
    this.mailboxes = new MailboxesAPI(params);

    /** @type {PlaybacksAPI} */
    this.playbacks = new PlaybacksAPI(params);

    /** @type {RecordingsAPI} */
    this.recordings = new RecordingsAPI(params);

    /** @type {SoundsAPI} */
    this.sounds = new SoundsAPI(params);

    /** @type {ChannelsAPI} */
    this.channels = new ChannelsAPI(params);
  }
}
