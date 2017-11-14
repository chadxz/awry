"use strict";
import nock from "nock";
import RecordingsAPI from "../../src/api/RecordingsAPI";

describe("the Recordings API", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("listStored method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/recordings/stored")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api.listStored().then(() => {
        mock.done();
      });
    });
  });

  describe("getStored method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/recordings/stored/foo")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .getStored({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("destroyStored method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/recordings/stored/foo")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .destroyStored({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("getStoredFile method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/recordings/stored/foo/file")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .getStoredFile({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("copyStored method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/recordings/stored/foo/copy")
        .query({ destinationRecordingName: "bar" })
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .copyStored({
          recordingName: "foo",
          destinationRecordingName: "bar"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("getLive method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/recordings/live/foo")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .getLive({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("cancel method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/recordings/live/foo")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .cancel({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("stop method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/recordings/live/foo/stop")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .stop({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("pause method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/recordings/live/foo/pause")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .pause({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("unpause method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/recordings/live/foo/pause")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .unpause({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("mute method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/recordings/live/foo/mute")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .mute({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("unmute method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/recordings/live/foo/mute")
        .reply(200, { foo: "bar" });

      const api = new RecordingsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .unmute({
          recordingName: "foo"
        })
        .then(() => {
          mock.done();
        });
    });
  });
});
