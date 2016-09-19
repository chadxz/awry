# ARI History

The change notes listed here are extracted from the `CHANGES` and `UPGRADE-#.txt` 
files from the Asterisk source tree. A copy of the full files can be found 
[in the Asterisk github mirror](https://github.com/asterisk/asterisk).
This file is a lens into the ARI changes made to Asterisk since ARI was 
introduced in Asterisk 12.

#### Asterisk 14.0.0

* A new ARI method has been added to the channels resource. "create" allows for
you to create a new channel and place that channel into a Stasis application.
This is similar to origination except that the specified channel is not
dialed. This allows for an application writer to create a channel, perform
manipulations on it, and then delay dialing the channel until later.

* To complement the "create" method, a "dial" method has been added to the
channels resource in order to place a call to a created channel.

* All operations that initiate playback of media on a resource now support
a list of media URIs. The list of URIs are played in the order they are
presented to the resource. A new event, "PlaybackContinuing", is raised when
a media URI finishes but before the next media URI starts. When a list is
played, the "Playback" model will contain the optional attribute
"next_media_uri", which specifies the next media URI in the list to be played
back to the resource. The "PlaybackFinished" event is raised when all media
URIs are done.

* Stored recordings now allow for the media associated with a stored recording
to be retrieved. The new route, GET /recordings/stored/{name}/file, will
transmit the raw media file to the requester as binary.

* "Dial" events have been modified to not only be sent when dialing begins and ends.
They now are also sent for intermediate states, such as "RINGING", "PROGRESS", and
"PROCEEDING".

* The policy for when to send "Dial" events has changed. Previously, "Dial"
events were sent on the calling channel's topic. However, starting in Asterisk
14, if there is no calling channel on which to send the event, the event is
instead sent on the called channel's topic. Note that for the ARI channels
resource's dial operation, this means that the "Dial" events will always be
sent on the called channel's topic.
   
#### Asterisk 13.10.0

* Added 'formats' to channel create/originate to allow setting the allowed
formats for a channel when no originator channel is available.  Especially
useful for Local channel creation where no other format information is
available.  'core show codecs' can now be used to look up suitable format
names.

#### Asterisk 13.6.0

* Two new endpoint related events are now available: PeerStatusChange and
ContactStatusChange. In particular, these events are useful when subscribing
to all event sources, as they provide additional endpoint related
information beyond the addition/removal of channels from an endpoint.

* Added the ability to subscribe to all ARI events in Asterisk, regardless
of whether the application 'controls' the resource. This is useful for
scenarios where an ARI application merely wants to observe the system,
as opposed to control it. There are two ways to accomplish this:
    1. Via the WebSocket connection URI. A new query paramter, 'subscribeAll',
    has been added that, when present and True, will subscribe all
    specified applications to all ARI event sources in Asterisk.
    2. Via the applications resource. An ARI client can, at any time, subscribe
    to all resources in an event source merely by not providing an explicit
    resource. For example, subscribing to an event source of 'channels:'
    as opposed to 'channels:12345' will subscribe the application to all
    channels.

#### Asterisk 13.5.0

* A new feature has been added that enables the retrieval of modules and
module information through an HTTP request. Information on a single module
can be also be retrieved. Individual modules can be loaded to Asterisk, as
well as unloaded and reloaded.

* A new resource has been added to the 'asterisk' resource, 'config/dynamic'.
This resource allows for push configuration of sorcery derived objects
within Asterisk. The resource supports creation, retrieval, updating, and
deletion. Sorcery derived objects that are manipulated by this resource
must have a sorcery wizard that supports the desired operations.

* A new feature has been added that allows for the rotation of log channels
through HTTP requests.

#### Asterisk 13.4.0

* Two new events, 'ChannelHold' and 'ChannelUnhold', have been added to the
events data model. These events are raised when a channel indicates a hold
or unhold, respectively.

#### Asterisk 13.3.0

* The ARI /channels resource now supports a new operation, 'redirect'. The
redirect operation will perform a technology and state specific redirection
on the channel to a specified endpoint or destination. In the case of SIP
technologies, this is either a 302 Redirect response to an on-going INVITE
dialog or a SIP REFER request.

#### Asterisk 13.2.0

* The Originate operation now takes in an originator channel. The linked ID of
this originator channel is applied to the newly originated outgoing channel.
If using CEL this allows an association to be established between the two so
it can be recognized that the originator is dialing the originated channel.

* "language" (the default spoken language for the channel) is now included in
the standard channel state output for suitable events.

* The POST channels/{id} operation and the POST channels/{id}/continue operation
now have a new "label" parameter. This allows for origination or continuation
to a labeled priority in the dialplan instead of requiring a specific priority
number. The ARI version has been bumped to 1.7.0 as a result.

#### Asterisk 13.1.0

* Event ChannelConnectedLine is emitted when the connected line information
on a channel changes.

#### Asterisk 13.0.0

* A bug fix in bridge creation has caused a behavioural change in how
subscriptions are created for bridges. A bridge created through ARI, does
not, by itself, have a subscription created for any particular Stasis
application. When a channel in a Stasis application joins a bridge, an
implicit event subscription is created for that bridge as well. Previously,
when a channel left such a bridge, the subscription was leaked; this allowed
for later bridge events to continue to be pushed to the subscribed
applications. That leak has been fixed; as a result, bridge events that were
delivered after a channel left the bridge are no longer delivered. An
application must subscribe to a bridge through the applications resource if
it wishes to receive all events related to a bridge.

#### Asterisk 12.5.0

* Stored recordings now support a new operation, copy. This will take an
existing stored recording and copy it to a new location in the recordings
directory.

* LiveRecording objects now have three additional fields that can be reported
in a RecordingFinished ARI event:
    * total_duration: the duration of the recording
    * talking_duration: optional. The duration of talking detected in the
    recording. This is only available if max_silence_seconds was specified
    when the recording was started.
    * silence_duration: optional. The duration of silence detected in the
    recording. This is only available if max_silence_seconds was specified
    when the recording was started.
Note that all duration values are reported in seconds.

* Users of ARI can now send and receive out of call text messages. Messages
can be sent directly to a particular endpoint, or can be sent to the
endpoints resource directly and inferred from the URI scheme. Text
messages are passed to ARI clients as TextMessageReceived events. ARI
clients can choose to receive text messages by subscribing to the particular
endpoint technology or endpoints that they are interested in.

* The applications resource now supports subscriptions to all endpoints of
a particular channel technology. For example, subscribing to an eventSource
of 'endpoint:PJSIP' will subscribe to all PJSIP endpoints.

#### Asterisk 12.4.0

* New event models have been aded for the TALK_DETECT function. When the
function is used on a channel, ChannelTalkingStarted/ChannelTalkingFinished
events will be emitted to connected WebSockets subscribed to the channel,
indicating the start/stop of talking on the channel.

#### Asterisk 12.3.0

* A new Playback URI 'tone' has been added. Tones are specified either as
an indication name (e.g. 'tone:busy') from indications.conf or as a tone
pattern (e.g. 'tone:240/250,0/250'). Tones differ from normal playback
URIs in that they must be stopped manually and will continue to occupy
a channel's ARI control queue until they are stopped. They also can not
be rewound or fastforwarded.

* User events can now be generated from ARI.  Events can be signalled with
arbitrary json variables, and include one or more of channel, bridge, or
endpoint snapshots.  An application must be specified which will receive
the event message (other applications can subscribe to it).  The message
will also be delivered via AMI provided a channel is attached.  Dialplan
generated user event messages are still transmitted via the channel, and
will only be received by a stasis application they are attached to or if
the channel is subscribed to.

#### Asterisk 12.2.0

* The live recording object on recording events now contains a target_uri
field which contains the URI of what is being recorded.

* The bridge type used when creating a bridge is now a comma separated list of
bridge properties. Valid options are: mixing, holding, dtmf_events, and
proxy_media.

* A channelId can now be provided when creating a channel, either in the
uri (POST channels/my-channel-id) or as query parameter.  A local channel
will suffix the second channel id with ';2' unless provided as query
parameter otherChannelId.

* A bridgeId can now be provided when creating a bridge, either in the uri
(POST bridges/my-bridge-id) or as a query parameter.

* A playbackId can be provided when starting a playback, either in the uri
(POST channels/my-channel-id/play/my-playback-id /
POST bridges/my-bridge-id/play/my-playback-id)  or as a query parameter.

* A snoop channel can be started with a snoopId, in the uri or query.

#### Asterisk 12.1.0

* The Bridge data model now contains the additional fields 'name' and
'creator'. The 'name' field conveys a descriptive name for the bridge;
the 'creator' field conveys the name of the entity that created the bridge.
This affects all responses to HTTP requests that return a Bridge data model
as well as all event derived data models that contain a Bridge data model.
The POST /bridges operation may now optionally specify a name to give to
the bridge being created.

* Added a new ARI resource 'mailboxes' which allows the creation and
modification of mailboxes managed by external MWI. Modules res_mwi_external
and res_stasis_mailbox must be enabled to use this resource. For more
information on external MWI control, see res_mwi_external.

* Added new events for externally initiated transfers. The event
BridgeBlindTransfer is now raised when a channel initiates a blind transfer
of a bridge in the ARI controlled application to the dialplan; the
BridgeAttendedTransfer event is raised when a channel initiates an
attended transfer of a bridge in the ARI controlled application to the
dialplan.

* Channel variables may now be specified as a body parameter to the
POST /channels operation. The 'variables' key in the JSON is interpreted
as a sequence of key/value pairs that will be added to the created channel
as channel variables. Other parameters in the JSON body are treated as
query parameters of the same name.

#### Asterisk 12.0.0

* ARI added to Asterisk
