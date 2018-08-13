# Change Log

All notable changes to this project will be documented in this file.

## 7.0.0 - 2018-08-13

`ws` has been updated to v6, bringing along it's breaking changes. [See the ws@6
release notes for more details](https://github.com/websockets/ws/releases/tag/6.0.0).

## 6.0.0 - 2018-04-14

Fixed package.json entrypoint. Previously this was set to src/index.js, which
was the correct entrypoint prior to the library being migrated to esm. The
entrypoint is now correctly set to index.js, the main entrypoint that handles
parsing esm as normal javascript.

## 5.0.0 - 2018-03-26

`ws` has been updated to v5, improving the error handling in disconnect situations
among some other minor changes. This update contains breaking changes. [See the ws@5
release notes for more details](https://github.com/websockets/ws/releases/tag/5.0.0).

This release also includes some development tool updates that do not affect the
consumption of the library.

## 4.0.1 - 2018-01-19

The `@std/esm` library has been updated to 0.19.x, which includes some changes
that may be considered breaking. See the
[0.19.0 release notes](https://github.com/standard-things/esm/releases/tag/0.19.0)
for full details.

In hindsight, I should have lumped this update in with the `ws@4` update. Will
try to do better with major version revs in the future.

Version 4.0.0 had to be skipped due to an issue with the npm registry.

## 3.0.0 - 2018-01-19

The `ws` library has been updated to 4.0.0, which includes many breaking changes.
See the [4.0.0 release notes](https://github.com/websockets/ws/releases/tag/4.0.0)
for full details.

## 2.0.1 - 2018-01-02

Small fix to account for a change in error handling behavior in the upstream `ws`
project. See [\#55](https://github.com/chadxz/awry/pull/55).

## 2.0.0 - 2017-11-21

Many public properties have now been made private via the `_` naming convention.
These properties were not previously advertised as being public, but since they
were not explicitly marked private, I'm bumping the major version. The properties
that are now private are:

- `request` and `baseUrl` properties on all API clients
- `ws`, `wsOptions`, `retryOptions`, `url`, `reconnect` properties on the
ARIWebSocket class returned by `Events.connect()`.

Internally, the entire library was rewritten to use the ecmascript modules syntax.
This syntax is still backwards-compatible as far back as Node v4 thanks to the
[@std/esm][] module, so compatibility for this library was not altered at all.

Converting the internals to ecmascript modules opened up a happy path for
generating comprehensive API documentation for the library with the [esdoc][]
tool. This documentation now lives in the /docs folder and can be accessed at
[https://chadmcelligott.com/awry][docs].

[@std/esm]: https://github.com/standard-things/esm
[esdoc]: https://github.com/esdoc/esdoc
[docs]: https://chadmcelligott.com/awry

## 1.0.0 - 2017-10-17

`ws` library upgraded to 3.2.0, which included some backwards-incompatible
changes. See the [ws library releases page](https://github.com/websockets/ws/releases)
for details.

Marking this library 1.0 at this time. It will now follow traditional semver
rules moving forward.

## 0.2.0 - 2016-10-27

The return value of `Events.connect()` is an EventEmitter that emits
'message' events. The first argument to a registered 'message'
event handler used to be passed the raw JSON string from Asterisk.
This argument is now a Javascript object representation of that JSON
(the result of `JSON.parse()` on the raw data sent from Asterisk).
Any messages that fail to parse as JSON will be passed along raw, but
this should never happen.

## 0.1.3 - 2016-10-26

Fixed JSDoc to address instances of params being marked required when
they were actually optional.

## 0.1.2 - 2016-10-23

Added missing request dependency to package.json.

## 0.1.1 - 2016-09-24

Asterisk 14 changes have been implemented.

#### Added

- New method `api.channels.create()` provides access to the new API
`POST /channels/create`.

- New method `api.channels.dial()` provides access to the new API
`POST /channels/{channelId}/dial`.

- New method `api.recordings.getStoredFile()` provides access to the new API
`GET /recordings/stored/{recordingName}/file`.

#### Changed

- For the `bridges` API, the `play()` and `playWithId()` methods' 'media' param
now allows for passing an array as well as a single value.

- For the `channels` API, the `play()` and `playWithId()` methods' 'media'
param now allows for passing an array as well as a single value.

## 0.1.0 - 2016-09-17

#### Added

- Initial npm release.


For more information about keeping a changelog, check out
[keepachangelog.com/](http://keepachangelog.com/)
