# Change Log

All notable changes to this project will be documented in this file.

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
