'use strict';
const url = require('url');
const qs = require('querystring');
const assert = require('power-assert');
const WebSocketServer = require('ws').Server;
const Events = require('../../src/events');

describe('Events create() returned observable', () => {

  describe('when passed a single app', () => {

    let server;
    let subscription;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      subscription.unsubscribe();
      server.close();
    });

    it('subscribes to a single app', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.app, 'myApp');
        done();
      });

      subscription = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      }).subscribe(() => {});
    });
  });

  describe('when passed multiple apps', () => {

    let server;
    let subscription;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      subscription.unsubscribe();
      server.close();
    });

    it('subscribes to all of the apps', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.app, 'app1,app2,app3');
        done();
      });

      subscription = Events.create({
        app: ['app1', 'app2', 'app3'],
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      }).subscribe(() => {});
    });
  });

  describe('when connecting', () => {

    let server;
    let subscription;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      subscription.unsubscribe();
      server.close();
    });

    it('sets api_key with username and password', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.api_key, 'foo:bar');
        done();
      });

      subscription = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      }).subscribe(() => {});
    });

    it('defaults to subscribeAll of true', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.subscribeAll, 'true');
        done();
      });

      subscription = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar'
      }).subscribe(() => {});
    });

    it('passes along a subscribeAll of false', done => {
      server.once('connection', conn => {
        const parts = url.parse(conn.upgradeReq.url);
        const query = qs.parse(parts.query);
        assert.equal(query.subscribeAll, 'false');
        done();
      });

      subscription = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
        subscribeAll: false
      }).subscribe(() => {});
    });
  });

  describe('when disconnected', () => {

    describe('and reconnect not explicitly set', () => {

      let server;
      let subscription;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        subscription.unsubscribe();
        server.close();
      });

      it('reconnects', done => {
        server.once('connection', conn => {
          server.once('connection', () => {
            done();
          });

          conn.close();
        });

        subscription = Events.create({
          app: 'myApp',
          url: 'ws://localhost:8088/',
          username: 'foo',
          password: 'bar'
        }).subscribe(() => {});
      });
    });

    describe('and reconnect explicitly set', () => {

      let server;
      let subscription;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        subscription.unsubscribe();
        server.close();
      });

      it('reconnects', done => {
        server.once('connection', conn => {
          server.once('connection', () => {
            done();
          });

          conn.close();
        });

        subscription = Events.create({
          app: 'myApp',
          url: 'ws://localhost:8088/',
          username: 'foo',
          password: 'bar',
          reconnect: true
        }).subscribe(() => {});
      });
    });

    describe('and reconnect set to false', () => {

      let server;
      let subscription;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        subscription.unsubscribe();
        server.close();
      });

      it('calls complete on the observable', done => {
        server.once('connection', conn => {
          conn.close();
        });

        subscription = Events.create({
          app: 'myApp',
          url: 'ws://localhost:8088/',
          username: 'foo',
          password: 'bar',
          reconnect: false
        }).subscribe(
          () => {},
          () => {},
          () => done()
        );
      });
    });
  });

  describe('when a message is emitted on the socket', () => {

    let server;
    let subscription;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      subscription.unsubscribe();
      server.close();
    });

    it('calls next on the observable', done => {
      server.once('connection', conn => {
        conn.send('hidey ho');
      });

      subscription = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
      }).subscribe(message => {
        assert.equal(message, 'hidey ho');
        done();
      });
    });
  });

  describe('when an error is emitted on the socket', () => {

    let server;
    let subscription;

    afterEach(() => {
      subscription.unsubscribe();
      server.close();
    });

    it('calls error on the observable', done => {
      server = new WebSocketServer({
        port: 8088,
        verifyClient(info, callback) {
          callback(false, 666, 'die die die');
        }
      });

      subscription = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
        reconnect: false
      }).subscribe(
        () => {},
        err => {
          assert(err);
          done();
        }
      );
    });
  });

  describe('when multiple observers subscribe and a message is sent', () => {

    let server;
    const subscriptions = [];

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      subscriptions.forEach(sub => sub.unsubscribe());
      server.close();
    });

    it('calls next on both observables', done => {
      let observable;
      let received = false;

      server.once('connection', conn => {

        // putting the second subscription in this weird place
        // makes sure both observables are subscribed prior
        // to dispatching the message down the websocket
        subscriptions.push(observable.subscribe(message => {
          assert.equal(message, 'hidey ho');
          if (received) {
            done();
          } else {
            received = true;
          }
        }));

        conn.send('hidey ho');
      });

      observable = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
      });

      subscriptions.push(observable.subscribe(message => {
        assert.equal(message, 'hidey ho');
        if (received) {
          done();
        } else {
          received = true;
        }
      }));
    });
  });

  describe('when the last observer unsubscribes', () => {

    let server;
    let subscription;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      subscription.unsubscribe();
      server.close();
    });

    it('closes the underlying websocket', done => {
      server.once('connection', conn => {
        conn.once('close', () => done());
        conn.send('cya');
      });

      subscription = Events.create({
        app: 'myApp',
        url: 'ws://localhost:8088/',
        username: 'foo',
        password: 'bar',
      }).subscribe(() => {
        subscription.unsubscribe();
      });
    });
  });
});
