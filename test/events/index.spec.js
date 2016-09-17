'use strict';
const url = require('url');
const qs = require('querystring');
const assert = require('power-assert');
const WebSocketServer = require('ws').Server;
const Events = require('../../src/events');

describe('Events connect() returned emitter', () => {

  describe('when passed a single app', () => {

    let server;
    let emitter;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it('subscribes to a single app', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.app, 'myApp');
        done();
      });

      emitter = Events.connect({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      });
    });
  });

  describe('when passed multiple apps', () => {

    let server;
    let emitter;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it('subscribes to all of the apps', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.app, 'app1,app2,app3');
        done();
      });

      emitter = Events.connect({
        app: ['app1', 'app2', 'app3'],
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      });
    });
  });

  describe('when connecting', () => {

    let server;
    let emitter;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it('sets api_key with username and password', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.api_key, 'foo:bar');
        done();
      });

      emitter = Events.connect({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      });
    });

    it('defaults to subscribeAll of true', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.subscribeAll, 'true');
        done();
      });

      emitter = Events.connect({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      });
    });

    it('passes along a subscribeAll of false', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.subscribeAll, 'false');
        done();
      });

      emitter = Events.connect({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
        subscribeAll: false
      });
    });
  });

  describe('when disconnected', () => {

    describe('and reconnect not explicitly set', () => {

      let server;
      let emitter;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        emitter.close();
        server.close();
      });

      it('reconnects', done => {
        server.once('connection', conn => {
          server.once('connection', () => {
            done();
          });

          conn.close();
        });

        emitter = Events.connect({
          app: 'myApp',
          url: 'ws://localhost:8088/',
          username: 'foo',
          password: 'bar'
        });
      });
    });

    describe('and reconnect explicitly set', () => {

      let server;
      let emitter;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        emitter.close();
        server.close();
      });

      it('reconnects', done => {
        server.once('connection', conn => {
          server.once('connection', () => {
            done();
          });

          conn.close();
        });

        emitter = Events.connect({
          app: 'myApp',
          url: 'ws://localhost:8088/',
          username: 'foo',
          password: 'bar',
          reconnect: true
        });
      });
    });

    describe('and reconnect set to false', () => {

      let server;
      let emitter;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        emitter.close();
        server.close();
      });

      it("emits 'close' event", done => {
        server.once('connection', conn => {
          conn.close();
        });

        emitter = Events.connect({
          app: 'myApp',
          url: 'ws://localhost:8088/',
          username: 'foo',
          password: 'bar',
          reconnect: false
        });

        emitter.once('close', done);
      });
    });
  });

  describe('when a message is emitted on the socket', () => {

    let server;
    let emitter;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it("emits a 'message' event", done => {
      server.once('connection', conn => {
        conn.send('hidey ho');
      });

      emitter = Events.connect({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
      });

      emitter.on('message', message => {
        assert.equal(message, 'hidey ho');
        done();
      });
    });
  });

  describe('when an error is emitted on the socket', () => {

    let server;
    let emitter;

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it("emits an 'error' event", done => {
      server = new WebSocketServer({
        port: 8088,
        verifyClient(info, callback) {
          callback(false, 666, 'die die die');
        }
      });

      emitter = Events.connect({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
        reconnect: false
      });

      emitter.on('error', err => {
        assert(err);
        done();
      });
    });
  });
});
