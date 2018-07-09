import assert from "power-assert";
import API from "../../src/api";
import ApplicationsAPI from "../../src/api/ApplicationsAPI";
import AsteriskAPI from "../../src/api/AsteriskAPI";
import BridgesAPI from "../../src/api/BridgesAPI";
import DeviceStatesAPI from "../../src/api/DeviceStatesAPI";
import EndpointsAPI from "../../src/api/EndpointsAPI";
import EventsAPI from "../../src/api/EventsAPI";
import MailboxesAPI from "../../src/api/MailboxesAPI";
import PlaybacksAPI from "../../src/api/PlaybacksAPI";
import RecordingsAPI from "../../src/api/RecordingsAPI";
import SoundsAPI from "../../src/api/SoundsAPI";
import ChannelsAPI from "../../src/api/ChannelsAPI";

describe("API constructed instance", () => {
  let api;

  beforeEach(() => {
    api = new API({
      username: "username",
      password: "password",
      baseUrl: "http://127.0.0.1/ari"
    });
  });

  it("exposes an applications API instance", () => {
    assert(api.applications instanceof ApplicationsAPI);
  });

  it("exposes an asterisk API instance", () => {
    assert(api.asterisk instanceof AsteriskAPI);
  });

  it("exposes a bridges API instance", () => {
    assert(api.bridges instanceof BridgesAPI);
  });

  it("exposes a device states API instance", () => {
    assert(api.deviceStates instanceof DeviceStatesAPI);
  });

  it("exposes a endpoints API instance", () => {
    assert(api.endpoints instanceof EndpointsAPI);
  });

  it("exposes a events API instance", () => {
    assert(api.events instanceof EventsAPI);
  });

  it("exposes a mailboxes API instance", () => {
    assert(api.mailboxes instanceof MailboxesAPI);
  });

  it("exposes a playbacks API instance", () => {
    assert(api.playbacks instanceof PlaybacksAPI);
  });

  it("exposes a recordings API instance", () => {
    assert(api.recordings instanceof RecordingsAPI);
  });

  it("exposes a sounds API instance", () => {
    assert(api.sounds instanceof SoundsAPI);
  });

  it("exposes a channels API instance", () => {
    assert(api.channels instanceof ChannelsAPI);
  });
});
