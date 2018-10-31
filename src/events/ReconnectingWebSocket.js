import WebSocket from "ws";
import events from "events";
import retry from "retry";
import debugModule from "debug";
const debug = debugModule("awry:ReconnectingWebSocket");

/**
 * A wrapper over the normal WebSocket object exported from the `ws`
 * library that automatically performs reconnection attempts when it
 * receives an 'error' or 'close' event from the underlying websocket.
 *
 * Events:
 *
 * - 'open' - fired when the websocket successfully connects to the
 *   provided url. Can fire multiple times if the socket disconnects and
 *   reconnects. signature ()
 *
 * - 'message' - fired when data is received on the underlying WebSocket.
 *   signature (data: any, flags: { binary, masked })
 *
 * - 'disconnected' - fired when the websocket disconnects, but reconnect
 *   attempts are about to be made.
 *   signature (details: { reason, err, code, message })
 *
 * - 'reconnected' - fired when the websocket was previously disconnected
 *   but has been reconnected automatically. signature ()
 *
 * - 'error' - fired directly before a 'close' event when the websocket has
 *   been disconnected for some reason and has exhaused its reconnection
 *   attempts. This event indicates why the websocket could not be reconnected.
 *   signature (mainError: Error)
 *
 * - 'close' - fired when the websocket disconnects and will not be
 *   reconnected, due to either having exhaused all reconnect attempts or
 *   reconnects being disabled. signature ()
 */
export default class ReconnectingWebSocket extends events.EventEmitter {
  /**
   * Create a websocket connection that can automatically reconnect upon
   * disconnect.
   *
   * @param {object} params
   * @param {string} params.url The url to connect to
   * @param {boolean} [params.reconnect=true] Whether to attempt a reconnect
   *  upon being disconnected either by an error or by having the socket close
   * @param {object} [params.retryOptions={ maxTimeout: 60000 }] Any
   *  advanced options to pass to the 'node-retry' retry.operation() method.
   * @param {object} [params.wsOptions={}] Any advanced options to pass
   *  directly to the 'ws' library constructor.
   */
  constructor(params = {}) {
    super();
    const {
      url,
      reconnect = true,
      retryOptions = { maxTimeout: 60000 },
      wsOptions = {}
    } = params;

    /** @private */
    this._url = url;

    /** @private */
    this._wsOptions = wsOptions;

    /** @private */
    this._retryOptions = retryOptions;

    /** @private */
    this._reconnect = reconnect;

    debug("attempting initial connection", { url });
    this.connect(err => {
      if (err) {
        this.emit("error", err);
        this.close();
        return;
      }

      this.emit("open");
    });
  }

  /**
   * Connect to the websocket server, using an exponential backoff
   * algorithm if an error occurs while connecting.
   *
   * @param {function} callback function with signature (err). Called upon
   *  successful connection to the server, or when the maxRetries has
   *  been exceeded.
   */
  connect(callback) {
    const operation = retry.operation(this._retryOptions);

    operation.attempt(attemptNumber => {
      const numRetries = attemptNumber - 1;

      // cleanup any existing instance
      if (this._ws) {
        this._ws.removeAllListeners();
        this._ws.close();
      }

      /** @private */
      this._ws = new WebSocket(this._url, this._wsOptions);

      const handleConnectError = err => {
        debug("connection attempt failed", err);

        if (!this._reconnect) {
          callback(err);
          return;
        }

        if (operation.retry(err)) {
          return;
        }

        // prettier-ignore
        debug('connection attempts exhaused',
          { err, reconnect: this._reconnect, numRetries });

        callback(operation.mainError());
      };

      this._ws.once("error", handleConnectError);
      this._ws.once("open", () => {
        debug("connected", { numRetries });
        this._ws.removeListener("error", handleConnectError);
        this._ws.on("message", this.emit.bind(this, "message"));
        this._ws.once("error", this.handleError.bind(this));
        this._ws.once("close", this.handleClose.bind(this));
        callback();
      });
    });
  }

  /**
   * Websocket 'error' handler that attempts to reconnect if reconnect is
   * enabled. Otherwise, it only feeds the 'error' that occurred back up
   * the chain and closes the connection.
   *
   * @private
   */
  handleError(err) {
    debug("an error occurred.", err);

    if (!this._reconnect) {
      this.emit("error", err);
      this.close();
      return;
    }

    this.emit("disconnected", { reason: "error", err });
    debug("attempting to reconnect");

    this.connect(err => {
      if (err) {
        this.emit("error", err);
        this.close();
        return;
      }

      this.emit("reconnected");
    });
  }

  /**
   * Websocket 'close' handler that attempts to reconnect if reconnect is
   * enabled. Otherwise, it only feeds the 'close' event back up the chain.
   *
   * @private
   */
  handleClose(code, message) {
    debug("connection closed", code, message);

    if (!this._reconnect) {
      this.close();
      return;
    }

    this.emit("disconnected", { reason: "close", code, message });
    debug("attempting to reconnect");

    this.connect(err => {
      if (err) {
        this.emit("error", err);
        this.close();
        return;
      }

      this.emit("reconnected");
    });
  }

  /**
   * Closes the underlying websocket instance and removes all event
   * listeners from this object.
   */
  close() {
    if (this._ws) {
      this._ws.removeAllListeners();
      this._ws.close();
      this._ws = null;
      this.emit("close");
    }

    this.removeAllListeners();
  }

  /**
   * Wrapper around the underlying EventEmitter's `emit()`
   * to provide some visibility into the events being emitted
   * when debugging is enabled.
   *
   * @param {...*} args The originally emitted arguments
   */
  emit(...args) {
    debug("emitting event", ...args);
    super.emit(...args);
  }

  /**
   * Send a health check down the websocket. If the connection
   * is healthy, you will receive a 'pong' message event.
   *
   * @param {*} [data] The data to send
   * @param {boolean} [mask] Indicates whether or not to mask `data`
   * @see https://github.com/websockets/ws/blob/master/doc/ws.md#websocketpingdata-mask-callback
   */
  ping(data, mask) {
    if (!this._ws) {
      this.emit(
        "error",
        new Error("Websocket unavailable for ping. Connect first.")
      );
      return;
    }

    debug("sending ping", { data, mask });
    this._ws.ping(data, mask, err => {
      if (err) {
        this.emit("error", err);
      }
    });
  }
}
