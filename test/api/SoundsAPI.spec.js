import nock from "nock";
import SoundsAPI from "../../src/api/SoundsAPI";

describe("the Sounds API", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("list method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/sounds")
        .query({ lang: "en", format: "ogg" })
        .reply(200, { foo: "bar" });

      const api = new SoundsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .list({
          lang: "en",
          format: "ogg",
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("get method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/sounds/foo")
        .reply(200, { foo: "bar" });

      const api = new SoundsAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234",
      });

      return api
        .get({
          soundId: "foo",
        })
        .then(() => {
          mock.done();
        });
    });
  });
});
