'use strict';
const ApplicationsAPI = require('./ApplicationsAPI');
const AsteriskAPI = require('./AsteriskAPI');
const BridgesAPI = require('./BridgesAPI');

class API {
  constructor(params) {
    this.applications = new ApplicationsAPI(params);
    this.asterisk = new AsteriskAPI(params);
    this.bridges = new BridgesAPI(params);
  }
}

module.exports = API;
