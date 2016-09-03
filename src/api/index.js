'use strict';
const ApplicationsAPI = require('./Applications');

class API {
  constructor(params) {
    this.applications = new ApplicationsAPI(params);
  }
}

module.exports = API;
