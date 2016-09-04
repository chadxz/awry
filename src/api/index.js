'use strict';
const ApplicationsAPI = require('./ApplicationsAPI');
const AsteriskAPI = require('./AsteriskAPI');

class API {
  constructor(params) {
    this.applications = new ApplicationsAPI(params);
    this.asterisk = new AsteriskAPI(params);
  }
}

module.exports = API;
