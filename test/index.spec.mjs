import awry from "../src";
import Events from "../src/events";
import assert from "power-assert";

describe("awry", () => {
  it("exposes the Events module", () => {
    assert.equal(awry.Events, Events);
  });

  it("exposes an API constructor", () => {
    assert.equal(typeof awry.API, "function");
  });
});
