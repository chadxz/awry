'use strict';
const WebSocketServer = require('ws').Server;
const assert = require('power-assert');
const ARIWebSocket = require('../../src/events/ARIWebSocket');

describe('ARIWebSocket', () => {

  let ws;
  let server;

  beforeEach(() => {
    server = new WebSocketServer({ port: 8088 });
  });

  afterEach(() => {
    // important to close client first so it does not try
    // to reconnect and cause issues in subsequent tests
    if (ws) ws.close();
    server.close();
  });

  it('passes non-"message" events along without parsing', done => {
    ws = new ARIWebSocket({ url: 'ws://localhost:8088' });

    server.once('connection', () => {
      ws.on('bugaboo', message => {
        assert.equal(message, 'bugaloo');
        done();
      });

      ws.emit('bugaboo', 'bugaloo');
    });
  });

  it('passes "message" events without a payload along without parsing', done => {
    ws = new ARIWebSocket({ url: 'ws://localhost:8088' });

    server.once('connection', conn => {
      ws.on('message', message => {
        assert(!message);
        done();
      });

      conn.send();
    });
  });

  it('passes "message" events that are not string along without parsing', done => {
    ws = new ARIWebSocket({ url: 'ws://localhost:8088' });
    const buf = new Buffer('string');

    server.once('connection', conn => {
      ws.once('message', message => {
        assert.equal(message.toString('utf-8'), buf.toString('utf-8'));
        done();
      });

      conn.send(buf);
    });
  });

  it('passes string "message" events that cannot be parsed as JSON along as-is', done => {
    ws = new ARIWebSocket({ url: 'ws://localhost:8088' });

    server.once('connection', conn => {
      ws.once('message', message => {
        assert.equal(message, 'hidey ho');
        done();
      });

      conn.send('hidey ho');
    });
  });

  it('parses JSON "message" payloads before triggering the event', done => {
    ws = new ARIWebSocket({ url: 'ws://localhost:8088' });

    server.once('connection', conn => {
      ws.once('message', message => {
        assert.deepEqual(message, { foo: 'bar' });
        done();
      });

      conn.send('{"foo": "bar"}');
    });
  });

});
