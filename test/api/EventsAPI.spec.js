'use strict';
const EventsAPI = require('../../src/api/EventsAPI');
const nock = require('nock');

describe('the Events API', () => {

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe('generateUserEvent method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/events/user/fooCreated', {
          variables: { var1: 'cool', var2: 'excellent' }
        })
        .query({
          application: 'fooApp',
          source: 'endpoint:pjsip/6001,deviceStatus:someDevice'
        })
        .reply(200, { foo: 'bar' });

      const api = new EventsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.generateUserEvent({
        eventName: 'fooCreated',
        application: 'fooApp',
        source: ['endpoint:pjsip/6001', 'deviceStatus:someDevice'],
        variables: { var1: 'cool', var2: 'excellent' }
      }).then(() => {
        mock.done();
      });
    });
  });
});
