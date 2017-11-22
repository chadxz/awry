# awry

[![Build Status][Build Status Image]][Build Status Link]
[![Codecov][Codecov Image]][Codecov Link]
[![Greenkeeper Badge][Greenkeeper Image]][Greenkeeper Link]

An [Asterisk REST Interface][] websocket and API client library for node.js
v6+.

[Build Status Image]: https://travis-ci.org/chadxz/awry.svg?branch=master
[Build Status Link]: https://travis-ci.org/chadxz/awry
[Codecov Image]: https://img.shields.io/codecov/c/github/chadxz/awry.svg
[Codecov Link]: https://codecov.io/gh/chadxz/awry
[Greenkeeper Image]: https://badges.greenkeeper.io/chadxz/awry.svg
[Greenkeeper Link]: https://greenkeeper.io/
[Asterisk REST Interface]: https://wiki.asterisk.org/wiki/pages/viewpage.action?pageId=29395573

### installation

`npm install awry`

### usage

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

For more details see the [full API documentation](http://chadmcelligott.com/awry). 

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

### contributing

See [CONTRIBUTING.md](https://github.com/chadxz/awry/CONTRIBUTING.md).

### license

[MIT](https://github.com/chadxz/awry/LICENSE-MIT)
