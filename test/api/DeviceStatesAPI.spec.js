import nock from "nock";
import DeviceStatesAPI from "../../src/api/DeviceStatesAPI";

describe("the DeviceStates API", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("list method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/deviceStates")
        .reply(200, { foo: "bar" });

      const api = new DeviceStatesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api.list().then(() => {
        mock.done();
      });
    });
  });

  describe("get method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/deviceStates/foo")
        .reply(200, { foo: "bar" });

      const api = new DeviceStatesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .get({
          deviceName: "foo",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("update method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .put("/ari/deviceStates/foo")
        .query({ deviceState: "INUSE" })
        .reply(200, { foo: "bar" });

      const api = new DeviceStatesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .update({
          deviceName: "foo",
          deviceState: "INUSE",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("destroy method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/deviceStates/foo")
        .reply(200, { foo: "bar" });

      const api = new DeviceStatesAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .destroy({
          deviceName: "foo",
        })
        .then(() => {
          mock.done();
        });
    });
  });
});
