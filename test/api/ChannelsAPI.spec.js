'use strict';
const ChannelsAPI = require('../../src/api/ChannelsAPI');
const nock = require('nock');

describe('the Channels API', () => {

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe('list method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .get('/ari/channels')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.list().then(() => {
        mock.done();
      });
    });
  });

  describe('originate method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels', {
          variables: { foo: 'bar' }
        })
        .query({
          endpoint: 'pjsip/foobar',
          app: 'super cool app',
          appArgs: 'somearg=excellent',
          callerId: 'jack bauer',
          timeout: 45,
          channelId: 'someChannelId',
          otherChannelId: 'someOtherChannelId',
          originator: 'someOriginator',
          formats: 'ulaw,slin16',
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.originate({
        endpoint: 'pjsip/foobar',
        app: 'super cool app',
        appArgs: 'somearg=excellent',
        callerId: 'jack bauer',
        timeout: 45,
        channelId: 'someChannelId',
        otherChannelId: 'someOtherChannelId',
        originator: 'someOriginator',
        formats: ['ulaw', 'slin16'],
        variables: { foo: 'bar' }
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('get method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .get('/ari/channels/foo')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.get({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('originateWithId method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo', {
          variables: { foo: 'bar' }
        })
        .query({
          endpoint: 'pjsip/foobar',
          app: 'super cool app',
          appArgs: 'somearg=excellent',
          callerId: 'jack bauer',
          timeout: 45,
          otherChannelId: 'someOtherChannelId',
          originator: 'someOriginator',
          formats: 'ulaw,slin16',
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.originateWithId({
        channelId: 'foo',
        endpoint: 'pjsip/foobar',
        app: 'super cool app',
        appArgs: 'somearg=excellent',
        callerId: 'jack bauer',
        timeout: 45,
        otherChannelId: 'someOtherChannelId',
        originator: 'someOriginator',
        formats: ['ulaw', 'slin16'],
        variables: { foo: 'bar' }
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('hangup method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .delete('/ari/channels/foo')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.hangup({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('continueInDialplan method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/continue')
        .query({
          context: 'someContext',
          extension: 'someExtension',
          priority: 'somePriority',
          label: 'someLabel'
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.continueInDialplan({
        channelId: 'foo',
        context: 'someContext',
        extension: 'someExtension',
        priority: 'somePriority',
        label: 'someLabel'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('redirect method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/redirect')
        .query({ endpoint: 'PJSIP/4004' })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.redirect({
        channelId: 'foo',
        endpoint: 'PJSIP/4004'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('answer method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/answer')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.answer({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('ring method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/ring')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.ring({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('ringStop method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .delete('/ari/channels/foo/ring')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.ringStop({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('sendDTMF method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/dtmf')
        .query({
          dtmf: '1234',
          before: 200,
          between: 300,
          duration: 350,
          after: 250,
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.sendDTMF({
        channelId: 'foo',
        dtmf: '1234',
        before: 200,
        between: 300,
        duration: 350,
        after: 250
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('mute method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/mute')
        .query({ direction: 'out' })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.mute({
        channelId: 'foo',
        direction: 'out'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('unmute method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .delete('/ari/channels/foo/mute')
        .query({ direction: 'out' })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.unmute({
        channelId: 'foo',
        direction: 'out'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('hold method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/hold')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.hold({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('unhold method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .delete('/ari/channels/foo/hold')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.unhold({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('startMusicOnHold method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/moh')
        .query({ mohClass: 'classical' })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.startMusicOnHold({
        channelId: 'foo',
        mohClass: 'classical'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('stopMusicOnHold method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .delete('/ari/channels/foo/moh')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.stopMusicOnHold({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('startSilence method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/silence')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.startSilence({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('stopSilence method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .delete('/ari/channels/foo/silence')
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.stopSilence({
        channelId: 'foo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('play method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/play')
        .query({
          media: 'sound:tt-monkeys',
          lang: 'en',
          offsetms: 150,
          skipms: 1500,
          playbackId: 'monkeyAttack'
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.play({
        channelId: 'foo',
        media: 'sound:tt-monkeys',
        lang: 'en',
        offsetms: 150,
        skipms: 1500,
        playbackId: 'monkeyAttack'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('playWithId method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/play/monkeyAttack')
        .query({
          media: 'sound:tt-monkeys',
          lang: 'en',
          offsetms: 150,
          skipms: 1500
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.playWithId({
        channelId: 'foo',
        playbackId: 'monkeyAttack',
        media: 'sound:tt-monkeys',
        lang: 'en',
        offsetms: 150,
        skipms: 1500
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('record method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/record')
        .query({
          name: 'recording.wav',
          format: 'wav',
          maxDurationSeconds: 60,
          maxSilenceSeconds: 10,
          ifExists: 'overwrite',
          beep: false,
          terminateOn: '#'
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.record({
        channelId: 'foo',
        name: 'recording.wav',
        format: 'wav',
        maxDurationSeconds: 60,
        maxSilenceSeconds: 10,
        ifExists: 'overwrite',
        beep: false,
        terminateOn: '#'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('getChannelVariable method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .get('/ari/channels/foo/variable')
        .query({ variable: 'jenkins' })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.getChannelVariable({
        channelId: 'foo',
        variable: 'jenkins'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('setChannelVariable method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/variable')
        .query({
          variable: 'jenkins',
          value: 'bamboo'
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.setChannelVariable({
        channelId: 'foo',
        variable: 'jenkins',
        value: 'bamboo'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('snoopChannel method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/snoop')
        .query({
          app: 'myApp',
          spy: 'both',
          whisper: 'both',
          appArgs: 'foo=bar',
          snoopId: 'snoopyDoopy'
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.snoopChannel({
        channelId: 'foo',
        app: 'myApp',
        spy: 'both',
        whisper: 'both',
        appArgs: 'foo=bar',
        snoopId: 'snoopyDoopy'
      }).then(() => {
        mock.done();
      });
    });
  });

  describe('snoopChannelWithId method', () => {

    it('makes the right request', () => {
      const mock = nock('http://fake.local')
        .post('/ari/channels/foo/snoop/snoopyDoopy')
        .query({
          app: 'myApp',
          spy: 'both',
          whisper: 'both',
          appArgs: 'foo=bar'
        })
        .reply(200, { foo: 'bar' });

      const api = new ChannelsAPI({
        baseUrl: 'http://fake.local/ari',
        username: 'user',
        password: '1234'
      });

      return api.snoopChannelWithId({
        channelId: 'foo',
        snoopId: 'snoopyDoopy',
        app: 'myApp',
        spy: 'both',
        whisper: 'both',
        appArgs: 'foo=bar'
      }).then(() => {
        mock.done();
      });
    });
  });
});
