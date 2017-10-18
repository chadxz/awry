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

### example

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

### running the tests

```sh
$ npm test
```

This will check that the files are formatted correctly with [prettier][], that
you have not broken any of the non-format-related ["standard" eslint][] rules,
and that all the tests in the `test/` directory pass.

To fix code formatting issues:

```sh
$ eslint --fix
```

If you would like to format your code automatically when you save a file, there
are many ways to set that up. See the ["Editor Integration"][] of the Prettier
README for details.

[prettier]: https://github.com/prettier/prettier
["standard" eslint]: https://standardjs.com/rules.html#javascript-standard-style
["Editor Integration"]: https://github.com/prettier/prettier#editor-integration

### getting code coverage details

```sh
$ npm run cover
```

This will run the tests and generate a coverage report on the command line as
well as open a web browser with an HTML code coverage report.

### license

[MIT](LICENSE-MIT)
