import awry from "../src";
import Events from "../src/events";
import assert from "assert";

describe("awry", () => {
  it("exposes the Events module", () => {
    assert.strictEqual(awry.Events, Events);
  });

  it("exposes an API constructor", () => {
    assert.strictEqual(typeof awry.API, "function");
  });
});
