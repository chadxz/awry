# awry

[![Build Status][Build Status Image]][Build Link]

An [Asterisk REST Interface][] websocket and API client library for node.js
v6+.

#### installation

`npm install awry`

#### example

```js
const awry = require('awry');

const api = new awry.API({
  baseUrl: 'http://asterisk.local:8088/ari',
  username: 'asterisk',
  password: 'asterisk'
});

api.applications.list().then(apps => {
  console.log(apps);
});

const events = awry.Events.connect({
  app: 'someApp',
  url: 'http://asterisk.local:8088/ari/events',
  username: 'asterisk',
  password: 'asterisk'
});

events.on('message', message => {
  console.log(message);
});
```

### debugging
awry uses the [debug](https://github.com/visionmedia/debug) module to log
debugging output. To enable this output to print to the console, set the
environment variable `DEBUG` to one of the following when running your app:

- `awry:*` - shows all debug output from this library.
- `awry:ARIWebSocket` - shows only the debug output from the ARIWebSocket 
sub-module.
- `awry:ReconnectingWebSocket` - shows only the debug output from the
ReconnectingWebSocket sub-module.

For example: `DEBUG=awry:* node myapp.js`

### license
[MIT](LICENSE-MIT)

[Asterisk REST Interface]: https://wiki.asterisk.org/wiki/pages/viewpage.action?pageId=29395573
[Build Status Image]: https://travis-ci.org/chadxz/awry.svg?branch=master
[Build Link]: https://travis-ci.org/chadxz/awry
[Dependencies Status Image]: https://david-dm.org/chadxz/awry.svg
[Dependencies Status Link]: https://david-dm.org/chadxz/awry
