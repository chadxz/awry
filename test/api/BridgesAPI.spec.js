import nock from "nock";
import BridgesAPI from "../../src/api/BridgesAPI";

describe("the Bridges API", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("list method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/bridges")
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api.list().then(() => {
        mock.done();
      });
    });
  });

  describe("create method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges")
        .query({
          type: "mixing,dtmf_events",
          bridgeId: "foo",
          name: "fooBridge",
        })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .create({
          bridgeId: "foo",
          name: "fooBridge",
          type: ["mixing", "dtmf_events"],
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("createOrUpdate method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges/foo")
        .query({
          type: "mixing,dtmf_events",
          name: "fooBridge",
        })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .createOrUpdate({
          bridgeId: "foo",
          name: "fooBridge",
          type: ["mixing", "dtmf_events"],
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("get method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/bridges/foo")
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .get({
          bridgeId: "foo",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("destroy method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/bridges/foo")
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .destroy({
          bridgeId: "foo",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("addChannel method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges/foo%20bar/addChannel")
        .query({
          role: "announcer",
          channel: "chan1,chan2",
        })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .addChannel({
          bridgeId: "foo bar",
          channel: ["chan1", "chan2"],
          role: "announcer",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("removeChannel method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges/foo%20bar/removeChannel")
        .query({ channel: "chan1,chan2" })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .removeChannel({
          bridgeId: "foo bar",
          channel: ["chan1", "chan2"],
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("startMusicOnHold method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges/foo%20bar/moh")
        .query({ mohClass: "rock_and_roll" })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .startMusicOnHold({
          bridgeId: "foo bar",
          mohClass: "rock_and_roll",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("stopMusicOnHold method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/bridges/foo%20bar/moh")
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .stopMusicOnHold({
          bridgeId: "foo bar",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("play method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges/foo%20bar/play")
        .query({
          media: "sound:foo/bar.wav,sound:foo/baz.wav",
          playbackId: "myPlaybackId",
          offsetms: 2000,
          skipms: 5000,
        })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .play({
          bridgeId: "foo bar",
          media: ["sound:foo/bar.wav", "sound:foo/baz.wav"],
          playbackId: "myPlaybackId",
          offsetms: 2000,
          skipms: 5000,
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("playWithId method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges/foo%20bar/play/my%20playback")
        .query({
          media: "sound:foo/bar.wav,sound:foo/baz.wav",
          offsetms: 2000,
          skipms: 5000,
        })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .playWithId({
          bridgeId: "foo bar",
          media: ["sound:foo/bar.wav", "sound:foo/baz.wav"],
          playbackId: "my playback",
          offsetms: 2000,
          skipms: 5000,
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("record method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/bridges/foo%20bar/record")
        .query({
          name: "myRecording",
          format: "wav",
          maxDurationSeconds: 60,
          maxSilentSeconds: 0,
          ifExists: "overwrite",
          beep: true,
          terminateOn: "none",
        })
        .reply(200, { foo: "bar" });

      const api = new BridgesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .record({
          bridgeId: "foo bar",
          name: "myRecording",
          maxDurationSeconds: 60,
          ifExists: "overwrite",
        })
        .then(() => {
          mock.done();
        });
    });
  });
});
