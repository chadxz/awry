# Change Log

All notable changes to this project will be documented in this file.

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
