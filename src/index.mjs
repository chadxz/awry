import Events from "./events";
import API from "./api";

/**
 * An ARI websocket and API client library.
 *
 * @typedef {object} Awry
 * @property {Events} Events Client for interacting with the Asterisk REST
 *  Interface server-sent events.
 * @property {API} API Client for interacting with the Asterisk Rest
 *  Interface.
 */
export default { Events, API };
