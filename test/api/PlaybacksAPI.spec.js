"use strict";
const PlaybacksAPI = require("../../src/api/PlaybacksAPI");
const nock = require("nock");

describe("the Playbacks API", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("get method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/playbacks/foo")
        .reply(200, { foo: "bar" });

      const api = new PlaybacksAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .get({
          playbackId: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("stop method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/playbacks/foo")
        .reply(200, { foo: "bar" });

      const api = new PlaybacksAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .stop({
          playbackId: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("control method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/playbacks/foo/control")
        .query({ operation: "restart" })
        .reply(200, { foo: "bar" });

      const api = new PlaybacksAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .control({
          playbackId: "foo",
          operation: "restart"
        })
        .then(() => {
          mock.done();
        });
    });
  });
});
