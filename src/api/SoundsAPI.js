import rp from "request-promise-native";

/**
 * REST API Resource for interacting with Asterisk sounds.
 */
export default class SoundsAPI {
  /**
   * Create an instance of the Sounds API client, providing access
   * to the `/sounds` endpoint.
   *
   * @param {object} params
   * @param {string} params.username The username to send with the request.
   * @param {string} params.password The password to send with the request.
   * @param {string} params.baseUrl The base url, without trailing slash,
   *  of the root Asterisk ARI endpoint. i.e. 'http://myserver.local:8088/ari'.
   */
  constructor(params) {
    const { username, password } = params;

    /** @private */
    this._baseUrl = params.baseUrl;

    /** @private */
    this._request = rp.defaults({
      auth: { username, password },
      json: true,
    });
  }

  /**
   * GET /sounds
   *
   * List all the sounds in Asterisk.
   *
   * @param {object} params
   * @param {string} [params.lang] Retrieve sounds in a specific language.
   * @param {string} [params.format] Retrieve sounds in a specific format.
   * @returns {Promise.<Array.<Sound>>} Resolves when the request completes
   *  successfully.
   */
  list(params = {}) {
    const { lang, format } = params;

    return this._request({
      method: "GET",
      uri: `${this._baseUrl}/sounds`,
      qs: { lang, format },
    });
  }

  /**
   * GET /sounds/{soundId}
   *
   * Retrieve the details about a specific sound.
   *
   * @param {object} params
   * @param {string} params.soundId The sound's unique id.
   * @returns {Promise.<Sound>} Resolves when the request completes
   *  successfully.
   */
  get(params) {
    const { soundId } = params;
    const id = encodeURIComponent(soundId);

    return this._request({
      method: "GET",
      uri: `${this._baseUrl}/sounds/${id}`,
    });
  }
}

/**
 * A media file that may be played back.
 *
 * @typedef {object} Sound
 * @property {Array.<FormatLangPair>} formats The formats and languages in
 *  which the sound is available.
 * @property {string} id The sound's identifier
 * @property {string} [text] The text description of the sound, usually
 *  indicating the words spoken.
 *
 */

/**
 * Identifies the format and language of a sound file.
 *
 * @typedef {object} FormatLangPair
 * @property {string} format
 * @property {string} language
 */
