import ReconnectingWebSocket from "./ReconnectingWebSocket";
import debugModule from "debug";
const debug = debugModule("awry:ARIWebSocket");

/**
 * Convenience wrapper around {@link ReconnectingWebSocket}
 */
export default class ARIWebSocket extends ReconnectingWebSocket {
  /**
   * Wrapper around the {@link ReconnectingWebSocket}'s `emit` method to provide
   * automatic JSON parsing of 'message' events, falling back to the original
   * payload if it cannot be parsed.
   *
   * @param {...*} args The original arguments passed
   */
  emit(...args) {
    const eventIsMessage = args[0] === "message";
    const payloadIsString = args[1] && typeof args[1] === "string";

    if (!eventIsMessage || !payloadIsString) {
      super.emit(...args);
      return;
    }

    try {
      args[1] = JSON.parse(args[1]);
    } catch (e) {
      debug("error parsing data as JSON", `'${args[1]}'`, e);
    }

    super.emit(...args);
  }
}
