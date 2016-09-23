'use strict';
const rp = require('request-promise-native');

/**
 * REST API Resource for interacting with Asterisk mailboxes.
 *
 * *APIs available since Asterisk 12.1*
 */
class MailboxesAPI {

  /**
   * Create an instance of the Mailboxes API client, providing access
   * to the `/mailboxes` endpoint.
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
   * GET /mailboxes
   *
   * List all mailboxes.
   *
   * *API available since Asterisk 12.1*
   *
   * @returns {Promise.<Array.<Mailbox>>} Resolves with all mailboxes in
   *  Asterisk.
   */
  list() {
    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/mailboxes`
    });
  }

  /**
   * GET /mailboxes/{mailboxName}
   *
   * Retrieve the current state of a mailbox.
   *
   * *API available since Asterisk 12.1*
   *
   * @param {object} params
   * @param {string} params.mailboxName The name of the mailbox to retrieve
   *  details of.
   * @returns {Promise.<Mailbox>} Resolves to the current state of the
   *  specified mailbox. Rejects if the mailbox cannot be found (status 404).
   */
  get(params) {
    const { mailboxName } = params;
    const name = encodeURIComponent(mailboxName);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/mailboxes/${name}`
    });
  }

  /**
   * PUT /mailboxes/{mailboxName}
   *
   * Change the state of a mailbox. This will implicitly create the mailbox
   * if it does not already exist.
   *
   * *API available since Asterisk 12.1*
   *
   * @param {object} params
   * @param {string} params.mailboxName The name of the mailbox to update.
   * @param {number} params.oldMessages The count of old messages in the mailbox.
   * @param {number} params.newMessages The count of new messages in the mailbox.
   * @returns {Promise} Resolves if the operation completed successfully.
   */
  update(params) {
    const { mailboxName, oldMessages, newMessages } = params;
    const name = encodeURIComponent(mailboxName);

    return this.request({
      method: 'PUT',
      uri: `${this.baseUrl}/mailboxes/${name}`,
      qs: { oldMessages, newMessages }
    });
  }

  /**
   * DELETE /mailboxes/{mailboxName}
   *
   * Destroy the specified mailbox.
   *
   * *API available since Asterisk 12.1*
   *
   * @param {object} params
   * @param {string} params.mailboxName The name of the mailbox to destroy.
   * @returns {Promise} Resolves if the specified mailbox is successfully
   *  destroyed. Rejets if the specified mailbox cannot be found (status 404).
   */
  destroy(params) {
    const { mailboxName } = params;
    const name = encodeURIComponent(mailboxName);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/mailboxes/${name}`
    });
  }
}

module.exports = MailboxesAPI;

/**
 * @name Mailbox
 * @typedef Mailbox
 * @property {string} name The name of the mailbox
 * @property {number} new_messages The count of new messages in the mailbox.
 * @property {number} old_messages The count of old messages in the mailbox.
 */
