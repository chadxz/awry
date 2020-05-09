import nock from "nock";
import EndpointsAPI from "../../src/api/EndpointsAPI";

describe("the Endpoints API", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("list method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/endpoints")
        .reply(200, { foo: "bar" });

      const api = new EndpointsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api.list().then(() => {
        mock.done();
      });
    });
  });

  describe("sendMessage method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .put("/ari/endpoints/sendMessage", {
          variables: { var1: "cool", var2: "rad" },
        })
        .query({
          to: "pjsip/foo",
          from: "pjsip/baz",
          body: "hidey ho",
        })
        .reply(200, { foo: "bar" });

      const api = new EndpointsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .sendMessage({
          to: "pjsip/foo",
          from: "pjsip/baz",
          body: "hidey ho",
          variables: { var1: "cool", var2: "rad" },
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("listByTechnology method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/endpoints/pjsip")
        .reply(200, { foo: "bar" });

      const api = new EndpointsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .listByTechnology({
          technology: "pjsip",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("get method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/endpoints/pj%20sip/foo%20bar")
        .reply(200, { foo: "bar" });

      const api = new EndpointsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .get({
          technology: "pj sip",
          resource: "foo bar",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("sendMessageToEndpoint method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .put("/ari/endpoints/pjsip/foo/sendMessage", {
          variables: { var1: "cool", var2: "nice" },
        })
        .query({
          from: "pjsip/jenkins",
          body: "hidey ho",
        })
        .reply(200, { foo: "bar" });

      const api = new EndpointsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .sendMessageToEndpoint({
          technology: "pjsip",
          resource: "foo",
          from: "pjsip/jenkins",
          body: "hidey ho",
          variables: { var1: "cool", var2: "nice" },
        })
        .then(() => {
          mock.done();
        });
    });
  });
});
