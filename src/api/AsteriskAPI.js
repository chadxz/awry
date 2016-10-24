'use strict';
const rp = require('request-promise-native');

/**
 * REST API Resource for interacting with Asterisk variables, modules,
 * logging, and configuration.
 */
class AsteriskAPI {

  /**
   * Create an instance of the Asterisk API client, providing access to the
   * `/asterisk` endpoint.
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
   * GET /asterisk/config/dynamic/{configClass}/{objectType}/{id}
   *
   * Retrieve a dynamic configuration object.
   *
   * *API available since Asterisk 13.5*
   *
   * @param {object} params
   * @param {string} params.configClass The configuration class containing
   *  dynamic configuration objects.
   * @param {string} params.objectType The type of configuration object to
   *  retrieve.
   * @param {string} params.id The unique identifier of the object to retrieve.
   * @returns {Promise.<Array.<ConfigTuple>>} Resolves with an array of key/value
   *  pairs. Rejects if the `configClass`, `objectType`, or `id` do not exist
   *  (404 status)
   */
  getObject(params = {}) {
    const configClass = encodeURIComponent(params.configClass);
    const objectType = encodeURIComponent(params.objectType);
    const id = encodeURIComponent(params.id);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/asterisk/config/dynamic/${configClass}/${objectType}/${id}`
    });
  }

  /**
   * PUT /asterisk/config/dynamic/{configClass}/{objectType}/{id}
   *
   * Create or update a dynamic configuration object.
   *
   * *API available since Asterisk 13.5*
   *
   * @param {object} params
   * @param {string} params.configClass The configuration class containing
   *  dynamic configuration objects.
   * @param {string} params.objectType The type of configuration object to
   *  update.
   * @param {string} params.id The unique identifier of the object to update.
   * @param {Array.<ConfigTuple>} params.fields The config key/value pairs
   *  to update.
   * @returns {Promise.<Array.<ConfigTuple>>} Resolves with an array of key/value
   *  pairs. Rejects if the `configClass`, `objectType`, or `id` do not exist
   *  (404 status), or if the `fields` param is malformed (400 status). Could
   *  potentially also reject due to a permissions issue creating or updating
   *  the specified object (403 status).
   */
  updateObject(params = {}) {
    const { fields } = params;
    const configClass = encodeURIComponent(params.configClass);
    const objectType = encodeURIComponent(params.objectType);
    const id = encodeURIComponent(params.id);

    return this.request({
      method: 'PUT',
      uri: `${this.baseUrl}/asterisk/config/dynamic/${configClass}/${objectType}/${id}`,
      body: { fields }
    });
  }

  /**
   * DELETE /asterisk/config/dynamic/{configClass}/{objectType}/{id}
   *
   * Delete a dynamic configuration object
   *
   * *API available since Asterisk 13.5*
   *
   * @param {object} params
   * @param {string} params.configClass The configuration class containing
   *  dynamic configuration objects.
   * @param {string} params.objectType The type of configuration object to
   *  delete.
   * @param {string} params.id The unique identifier of the object to delete.
   * @returns {Promise} Resolves if the specified dynamic configuration
   *  object was successfully deleted. Rejects if the `configClass`,
   *  `objectType`, or `id` do not exist (404 status), or if a permissions
   *  issue prevented the deletion (403 status).
   */
  deleteObject(params = {}) {
    const configClass = encodeURIComponent(params.configClass);
    const objectType = encodeURIComponent(params.objectType);
    const id = encodeURIComponent(params.id);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/asterisk/config/dynamic/${configClass}/${objectType}/${id}`
    });
  }

  /**
   * GET /asterisk/info
   *
   * Gets Asterisk system information.
   *
   * @param {object} params
   * @param {string|Array.<string>} [params.only] Optionally limit the data
   *  returned. Valid values are 'build', 'system', 'config', or 'status'.
   *  Multiples may be specified as an array.
   * @returns {Promise.<AsteriskInfo>} Resolves with the requested Asterisk
   *  system information.
   */
  getInfo(params = {}) {
    const { only } = params;

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/asterisk/info`,
      qs: { only: [].concat(only).join(',') }
    });
  }

  /**
   * GET /asterisk/modules
   *
   * List all loaded Asterisk modules.
   *
   * *API available since Asterisk 13.5*
   *
   * @returns {Promise.<Array.<Module>>} Resolves with an array of module
   *  details.
   */
  listModules() {
    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/asterisk/modules`
    });
  }

  /**
   * GET /asterisk/modules/{moduleName}
   *
   * Retrieve details about a specific Asterisk module.
   *
   * *API available since Asterisk 13.5*
   *
   * @param {object} params
   * @param {string} params.moduleName Case-sensitive module name.
   * @returns {Promise.<Module>} Resolves with the module details. Rejects if
   *  the module could not be found in the loaded modules (status 404) or
   *  the module information could not be retrieved for some reason (status 409).
   */
  getModule(params = {}) {
    const { moduleName } = params;
    const name = encodeURIComponent(moduleName);

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/asterisk/modules/${name}`
    });
  }

  /**
   * POST /asterisk/modules/{moduleName}
   *
   * Load an Asterisk module.
   *
   * *API available since Asterisk 13.5*
   *
   * @param {object} params
   * @param {string} params.moduleName Case-sensitive module name.
   * @returns {Promise} Resolves if the module was successfully loaded.
   *  Rejects if the module could not be loaded for some reason (status 409).
   */
  loadModule(params = {}) {
    const { moduleName } = params;
    const name = encodeURIComponent(moduleName);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/asterisk/modules/${name}`
    });
  }

  /**
   * DELETE /asterisk/modules/{moduleName}
   *
   * Unload an Asterisk module.
   *
   * *API available since Asterisk 13.5*
   *
   * @param {object} params
   * @param {string} params.moduleName Case-sensitive module name.
   * @returns {Promise} Resolves if the module was successfully loaded.
   *  Rejects if the module could not be found in the loaded modules (status 404)
   *  or the module information could not be unloaded for some reason (status 409).
   */
  unloadModule(params = {}) {
    const { moduleName } = params;
    const name = encodeURIComponent(moduleName);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/asterisk/modules/${name}`
    });
  }

  /**
   * PUT /asterisk/modules/{moduleName}
   *
   * Reload an Asterisk module.
   *
   * *API available since Asterisk 13.5*
   *
   * @param {object} params
   * @param {string} params.moduleName Case-sensitive module name.
   * @returns {Promise} Resolves if the module was successfully reloaded.
   *  Rejects if the module could not be found in the loaded modules (status 404)
   *  or the module information could not be reloaded for some reason (status 409).
   */
  reloadModule(params = {}) {
    const { moduleName } = params;
    const name = encodeURIComponent(moduleName);

    return this.request({
      method: 'PUT',
      uri: `${this.baseUrl}/asterisk/modules/${name}`
    });
  }

  /**
   * GET /asterisk/logging
   *
   * Retrieve Asterisk log channel information.
   *
   * *API available since Asterisk 13.6*
   *
   * @returns {Promise.<Array.<LogChannel>>} Resolves with the list of all
   *  log channel details in Asterisk.
   */
  listLogChannels() {
    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/asterisk/logging`
    });
  }

  /**
   * POST /asterisk/logging/{logChannelName}
   *
   * Add a log channel.
   *
   * *API available since Asterisk 13.6*
   *
   * @param {object} params
   * @param {string} params.logChannelName The log channel to add.
   * @param {string} params.configuration The levels of the log channel.
   * @returns {Promise} Resolves if the log channel was successfully added.
   *  Rejects if the configuration data is malformed (status 400) or if the
   *  log channel could not be added for some reason {status 409)
   */
  addLog(params = {}) {
    const { logChannelName, configuration } = params;
    const name = encodeURIComponent(logChannelName);

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/asterisk/logging/${name}`,
      qs: { configuration }
    });
  }

  /**
   * DELETE /asterisk/logging/{logChannelName}
   *
   * Remove a log channel.
   *
   * *API available since Asterisk 13.6*
   *
   * @param {object} params
   * @param {string} params.logChannelName The log channel to remove.
   * @returns {Promise} Resolves if the log channel was successfully removed.
   *  Rejects if the log channel could not be found (status 404).
   */
  deleteLog(params = {}) {
    const { logChannelName } = params;
    const name = encodeURIComponent(logChannelName);

    return this.request({
      method: 'DELETE',
      uri: `${this.baseUrl}/asterisk/logging/${name}`
    });
  }

  /**
   * PUT /asterisk/logging/{logChannelName}/rotate
   *
   * Rotate a log channel.
   *
   * *API available since Asterisk 13.6*
   *
   * @param {object} params
   * @param {string} params.logChannelName The log channel to rotate.
   * @returns {Promise} Resolves if the log channel was successfully rotated.
   *  Rejects if the log channel could not be found (status 404).
   */
  rotateLog(params = {}) {
    const { logChannelName } = params;
    const name = encodeURIComponent(logChannelName);

    return this.request({
      method: 'PUT',
      uri: `${this.baseUrl}/asterisk/logging/${name}/rotate`
    });
  }

  /**
   * GET /asterisk/variable
   *
   * Retrieve the value of a global variable.
   *
   * @param {object} params
   * @param {string} params.variable The name of the variable to retrieve
   *  the value of.
   * @returns {Promise.<Variable>} Resolves with an object containing the value
   *  of the specified variable. Rejects if the variable name is not properly
   *  specified (status 400).
   */
  getGlobalVariable(params = {}) {
    const { variable } = params;

    return this.request({
      method: 'GET',
      uri: `${this.baseUrl}/asterisk/variable`,
      qs: { variable }
    });
  }

  /**
   * POST /asterisk/variable
   *
   * Set the value of a global variable.
   *
   * @param {object} params
   * @param {string} params.variable The name of the variable to set the value
   *  for.
   * @param {string} params.value The value to set to the specified variable.
   * @returns {Promise} Resolves when the variable has successfully been set.
   *  Rejects if the variable name is not properly set (status 400).
   */
  setGlobalVariable(params = {}) {
    const { variable, value } = params;

    return this.request({
      method: 'POST',
      uri: `${this.baseUrl}/asterisk/variable`,
      qs: { variable, value }
    });
  }
}

module.exports = AsteriskAPI;

/**
 * @name ConfigTuple
 * @typedef ConfigTuple
 * @property {string} attribute A configuration object attribute
 * @property {string} value The value for the attribute
 */

/**
 * @name BuildInfo
 * @typedef BuildInfo
 * @property {string} date The date and time that Asterisk was built.
 * @property {string} kernel The kernel version Asterisk was built on.
 * @property {string} machine The machine architecture (x86_64, i686, ppc, etc.).
 * @property {string} options The compile time options, or an empty string if default.
 * @property {string} os The Operating System that Asterisk was built on.
 * @property {string} user The username that built Asterisk.
 */

/**
 * @name ConfigInfo
 * @typedef ConfigInfo
 * @property {string} default_language The default language for media playback.
 * @property {number} [max_channels] The maximum number of simultaneous channels.
 * @property {number} [max_load] The maximum load average on the system.
 * @property {number} [max_open_files] The maximum number of open file handles (files, sockets).
 * @property {string} name The Asterisk system name.
 * @property {object} setid The effective user/group id running Asterisk.
 * @property {string} setid.user The effective user id.
 * @property {string} setid.group The effective group id.
 */

/**
 * @name StatusInfo
 * @typedef StatusInfo
 * @property {Date} last_reload_time The last time that Asterisk was reloaded.
 * @property {Date} startup_time The time that Asterisk was started.
 */

/**
 * @name SystemInfo
 * @typedef SystemInfo
 * @property {string} entity_id
 * @property {string} version The Asterisk version.
 */

/**
 * @name AsteriskInfo
 * @typedef AsteriskInfo
 * @property {BuildInfo} [build] Information about how Asterisk was built.
 * @property {ConfigInfo} [config] Information about how Asterisk is configured.
 * @property {StatusInfo} [status] Information about the current Asterisk status.
 * @property {SystemInfo} [system] Information about the system running Asterisk.
 */

/**
 * @name Module
 * @typedef Module
 * @property {string} description The description of this module.
 * @property {string} name The name of this module.
 * @property {string} status The running status of this module.
 * @property {string} support_level The support state of this module.
 * @property {number} use_count The number of times this module is being used.
 */

/**
 * @name LogChannel
 * @typedef LogChannel
 * @property {string} channel The log channel path.
 * @property {string} configuration The various log levels.
 * @property {string} status Whether or not the log channel is enabled.
 * @property {string} type The types of logs for the log channel.
 */

/**
 * @name Variable
 * @typedef Variable
 * @property {string} value The value of the variable.
 */
