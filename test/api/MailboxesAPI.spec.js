'use strict';
const MailboxesAPI = require('../../src/api/MailboxesAPI');
const nock = require('nock');

describe('the Mailboxes API', () => {

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe('list method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .get('/ari/mailboxes')
        .reply(200, { foo: 'bar' });

      const api = new MailboxesAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.list().then(() => {
        mock.done();
      });
    });
  });

  describe('get method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .get('/ari/mailboxes/foo')
        .reply(200, { foo: 'bar' });

      const api = new MailboxesAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.get({
        mailboxName: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('update method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .put('/ari/mailboxes/foo')
        .query({ oldMessages: 5, newMessages: 0 })
        .reply(200, { foo: 'bar' });

      const api = new MailboxesAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.update({
        mailboxName: 'foo',
        oldMessages: 5,
        newMessages: 0
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('destroy method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .delete('/ari/mailboxes/foo')
        .reply(200, { foo: 'bar' });

      const api = new MailboxesAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.destroy({
        mailboxName: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });
});
