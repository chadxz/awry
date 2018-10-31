import { URL } from "url";
import assert from "power-assert";
import ws from "ws";
import Events from "../../src/events";
const WebSocketServer = ws.Server;

describe("Events connect() returned emitter", () => {
  describe("when passed a single app", () => {
    let server;
    let emitter;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      if (emitter) emitter.close();
      server.close();
    });

    it("subscribes to a single app", done => {
      emitter = Events.connect({
        app: "myApp",
        url: "ws://localhost:8088/",
        username: "foo",
        password: "bar"
      });

      server.once("connection", (conn, req) => {
        emitter.once("open", () => {
          const parts = new URL(req.url, "ws://localhost:8088/");
          assert.equal(parts.searchParams.get("app"), "myApp");
          done();
        });
      });
    });
  });

  describe("when passed multiple apps", () => {
    let server;
    let emitter;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it("subscribes to all of the apps", done => {
      emitter = Events.connect({
        app: ["app1", "app2", "app3"],
        url: "ws://localhost:8088/",
        username: "foo",
        password: "bar"
      });

      server.once("connection", (conn, req) => {
        emitter.once("open", () => {
          const parts = new URL(req.url, "ws://localhost:8088/");
          assert.equal(parts.searchParams.get("app"), "app1,app2,app3");
          done();
        });
      });
    });
  });

  describe("when connecting", () => {
    let server;
    let emitter;

    beforeEach(() => {
      server = new WebSocketServer({ port: 8088 });
    });

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it("sets api_key with username and password", done => {
      emitter = Events.connect({
        app: "myApp",
        url: "ws://localhost:8088/",
        username: "foo",
        password: "bar"
      });

      server.once("connection", (conn, req) => {
        emitter.once("open", () => {
          const parts = new URL(req.url, "ws://localhost:8088/");
          assert.equal(parts.searchParams.get("api_key"), "foo:bar");
          done();
        });
      });
    });

    it("defaults to subscribeAll of true", done => {
      emitter = Events.connect({
        app: "myApp",
        url: "ws://localhost:8088/",
        username: "foo",
        password: "bar"
      });

      server.once("connection", (conn, req) => {
        emitter.once("open", () => {
          const parts = new URL(req.url, "ws://localhost:8088/");
          assert.equal(parts.searchParams.get("subscribeAll"), "true");
          done();
        });
      });
    });

    it("passes along a subscribeAll of false", done => {
      emitter = Events.connect({
        app: "myApp",
        url: "ws://localhost:8088/",
        username: "foo",
        password: "bar",
        subscribeAll: false
      });

      server.once("connection", (conn, req) => {
        emitter.once("open", () => {
          const parts = new URL(req.url, "ws://localhost:8088/");
          assert.equal(parts.searchParams.get("subscribeAll"), "false");
          done();
        });
      });
    });
  });

  describe("when disconnected", () => {
    describe("and reconnect not explicitly set", () => {
      let server;
      let emitter;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        emitter.close();
        server.close();
      });

      it("reconnects", done => {
        emitter = Events.connect({
          app: "myApp",
          url: "ws://localhost:8088/",
          username: "foo",
          password: "bar"
        });

        // the initial connection...
        server.once("connection", conn => {
          // the reconnect!
          server.once("connection", () => {
            emitter.once("reconnected", () => {
              done();
            });
          });

          emitter.once("open", () => {
            conn.close();
          });
        });
      });
    });

    describe("and reconnect explicitly set", () => {
      let server;
      let emitter;

      beforeEach(() => {
        server = new WebSocketServer({ port: 8088 });
      });

      afterEach(() => {
        emitter.close();
        server.close();
      });

      it("reconnects", done => {
        emitter = Events.connect({
          app: "myApp",
          url: "ws://localhost:8088/",
          username: "foo",
          password: "bar",
          reconnect: true
        });

        // the initial connection...
        server.once("connection", conn => {
          // the reconnect!
          server.once("connection", () => {
            emitter.once("reconnected", () => {
              done();
            });
          });

          emitter.once("open", () => {
            conn.close();
          });
        });
      });
    });

    describe("and reconnect set to false", () => {
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
        emitter = Events.connect({
          app: "myApp",
          url: "ws://localhost:8088/",
          username: "foo",
          password: "bar",
          reconnect: false
        });

        server.once("connection", conn => {
          emitter.once("close", done);

          emitter.once("open", () => {
            conn.close();
          });
        });
      });
    });
  });

  describe("when a message is emitted on the socket", () => {
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
      server.once("connection", conn => {
        conn.send("hidey ho");
      });

      emitter = Events.connect({
        app: "myApp",
        url: "ws://localhost:8088/",
        username: "foo",
        password: "bar"
      });

      emitter.on("message", message => {
        assert.equal(message, "hidey ho");
        done();
      });
    });
  });

  describe("when an error is emitted on the socket", () => {
    let server;
    let emitter;

    afterEach(() => {
      emitter.close();
      server.close();
    });

    it("emits an 'error' event", done => {
      server = new WebSocketServer({
        port: 8088,
        verifyClient(info, verify) {
          verify(false, 666, "die die die");
        }
      });

      emitter = Events.connect({
        app: "myApp",
        url: "ws://localhost:8088/",
        username: "foo",
        password: "bar",
        reconnect: false
      });

      emitter.on("error", err => {
        assert(err);
        done();
      });
    });
  });
});
