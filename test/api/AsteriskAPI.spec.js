import nock from "nock";
import AsteriskAPI from "../../src/api/AsteriskAPI";

describe("the Asterisk API", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("getObject method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/asterisk/config/dynamic/fooClass/barType/baz")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .getObject({
          configClass: "fooClass",
          objectType: "barType",
          id: "baz"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("updateObject method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .put("/ari/asterisk/config/dynamic/fooClass/barType/baz", {
          fields: [{ field1: "field1val" }, { field2: "field2val" }]
        })
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .updateObject({
          configClass: "fooClass",
          objectType: "barType",
          id: "baz",
          fields: [{ field1: "field1val" }, { field2: "field2val" }]
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("deleteObject method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/asterisk/config/dynamic/fooClass/barType/baz")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .deleteObject({
          configClass: "fooClass",
          objectType: "barType",
          id: "baz"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("getInfo method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/asterisk/info")
        .query({ only: "system,build" })
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .getInfo({
          only: ["system", "build"]
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("listModules method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/asterisk/modules")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api.listModules().then(() => {
        mock.done();
      });
    });
  });

  describe("getModule method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/asterisk/modules/myModule")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .getModule({
          moduleName: "myModule"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("loadModule method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/asterisk/modules/my%20Module")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .loadModule({
          moduleName: "my Module"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("unloadModule method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/asterisk/modules/my%20Module")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .unloadModule({
          moduleName: "my Module"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("reloadModule method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .put("/ari/asterisk/modules/my%20Module")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .reloadModule({
          moduleName: "my Module"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("listLogChannels method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/asterisk/logging")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api.listLogChannels().then(() => {
        mock.done();
      });
    });
  });

  describe("addLog method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/asterisk/logging/my%20log%20channel")
        .query({ configuration: "i have no idea what i'm doing" })
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .addLog({
          logChannelName: "my log channel",
          configuration: "i have no idea what i'm doing"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("deleteLog method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .delete("/ari/asterisk/logging/my%20log%20channel")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .deleteLog({
          logChannelName: "my log channel"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("rotateLog method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .put("/ari/asterisk/logging/my%20log%20channel/rotate")
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .rotateLog({
          logChannelName: "my log channel"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("getGlobalVariable method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .get("/ari/asterisk/variable")
        .query({ variable: "something cool" })
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .getGlobalVariable({
          variable: "something cool"
        })
        .then(() => {
          mock.done();
        });
    });
  });

  describe("setGlobalVariable method", () => {
    it("makes the right request", () => {
      const mock = nock("http://fake.local")
        .post("/ari/asterisk/variable")
        .query({
          variable: "something cool",
          value: "do what now"
        })
        .reply(200, { foo: "bar" });

      const api = new AsteriskAPI({
        baseUrl: "http://fake.local/ari",
        username: "user",
        password: "1234"
      });

      return api
        .setGlobalVariable({
          variable: "something cool",
          value: "do what now"
        })
        .then(() => {
          mock.done();
        });
    });
  });
});
