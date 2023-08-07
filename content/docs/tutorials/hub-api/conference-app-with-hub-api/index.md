---
date: 2023-08-02
lastmod: 2023-08-02
name: conference-app-with-hub-api
title: Conference App with Hub API
description: The goal of this tutorial is to make you understand how you can use the inLive Hub API to develop a simple room-based application.
ogimage:
slug: conference-app-with-hub-api
menu:
  docs_sidebar:
    identifier: conference-app-with-hub-api
    name: Conference App with Hub API
    parent: hub-api
    weight: 1
---

# Conference App with Hub API

The goal of this tutorial is to make you understand how you can use the inLive Hub API to develop a simple room-based application.

## Overview

We will create a simple web-based video conferencing room application. When the host opens the app, there is no room exists yet so the host will create a room and get the URL to share with other participants to join. When the host clicks the join button, it will automatically create a new room, and join that room. The page will show a URL to share with other participants to join the room.

The participants will automatically join the room when they open the URL and click the join button. There is no authentication and other protection mechanism to keep the implementation simple. The tutorial is split into multiple steps:
1. Create a basic UI with simple HTML and CSS
2. Create a room where local peer client can join
3. Register a peer client to the room
4. Join and connect to the room
5. Handle other participants who enter and leave in the room
6. Leave the room
7. End the conference room

## 1. Create a basic UI with simple HTML and CSS

We need a basic HTML layout with button and video element to display the local and remote media streams. For example, this is the HTML code that we will use for this tutorial.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Simple Video Conference Room</title>
</head>
<body>
    <div id="app">
       <main>
            <video id="local" autoplay playsinline muted></video>
       </main>
       <aside>
            <div>
                <button id="togglejoin" onclick="toggleJoin()">Join</button>
            </div>
            <div id="info"></div>
        </aside>
    </div>
</body>
</html>
```

If you want to add basic CSS for styling purpose, you can put the CSS code below in the HTML code.

```html
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: sans-serif;
        font-size: 1rem;
    }
    #app {
        padding: 1rem;
    }
    main {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(576px, 1fr));
        gap: 1rem;
    }
    video{
        width: 100%;
        height: auto;
        object-fit: cover;
        background-color: black;
        border-radius: 0.5rem;
    }
    aside {
        margin-top: 2rem;
        width: 100%;
        text-align: center;
    }

    #info {
        margin-top: 1rem;
    }
</style>
```

## 2. Create a room where local peer client can join

This is where we start to implement the JavaScript logics for the application. Let's define some global variables that we can use later.

```js
// The room object contains the room ID and room name
const room = {
    id: null,
    name: ''
}

// The client object contains the client ID data
const client = {
    id: null,
}

// inLive Hub API host origin and API version
const apiOrigin = 'https://hub.inlive.app';
const apiVersion = 'v1'

// Map object to store all remote media streams from other clients
const streams = new Map();

// The sharable join URL for inviting other participants to the room.
let joinUrl = '';

// Variable to store the RTCPeerConnection instance
let peer = null;

// A state variable as an indicator if the user already joined a room
let joined = false;
```

### Build the create room function

Once we have defines the variables, we can start implementing the room logic. When the host visits the application, the room doesn't exist and the host needs to create a room by clicking the join button. The room can be created by sending HTTP `POST` request to `/rooms/create` endpoint. We can write a function to create a new room which will be called when the host clicks the join room button.

```js
async function createRoom(roomName = '') {
    const response = await fetch(`${apiOrigin}/${apiVersion}/rooms/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: roomName
        })
    })

    const newRoom = await response.json();

    return newRoom.data;
}
```

The `createRoom()` function will expect a string that will be submit as the name of the room. The name of the room is optional, so you can leave it as an empty string.

### Call the create room function

The join room button calls the `toggleJoin()` function which is a function that toggles between the join room and leave room logic.

```js
function toggleJoin() {
    if (!joined) {
        join();
    } else {
        leave();
    }
}
```

We will call the `createRoom()` function inside the `join()` function.

```js
async function join() {
    room.id = new URL(location.href).searchParams.get('roomId');
    room.name = new URL(location.href).searchParams.get('roomName');

    if (!room.id) {
        const newRoom = await createRoom('My room');
        room.id = newRoom.id;
        room.name = newRoom.name;
    }

    joinUrl = encodeURI(location.origin + `?roomId=${room.id}&roomName=${room.name}`);

    document.querySelector('#info').innerHTML = `Join URL : <a href="${joinUrl}" target="_blank">${joinUrl}</a>`
}
```

The `join()` function above calls the `createRoom()` function which returns the ID and name of the room. After the room is created, the `join()` function will create an invitation URL that enables the host of the room to invite other participants into the room. Using the invitation URL, the other participants can join to the room when they click the join button.


## 3. Register a peer client to the room
Every peer client (participant) who wants to join to the room needs to be registered. This way we can make the room secure by only allowing the peer client who has already registered to join the room. We can register a peer client to the room only when the room is already created because we need the ID of the room for registering the peer client.

### Build the register client function

The peer client can be registered by sending HTTP `POST` request to `/rooms/<ROOM_ID>/register` endpoint. We can write `registerClient()` function which will be called after the room has been created.

```js
async function registerClient(roomId, uid = Math.floor(Math.random() * 1000)) {
    const response = await fetch(`${apiOrigin}/${apiVersion}/rooms/${roomId}/register`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            uid: uid
        })
    });

    const responseJSON = await response.json();

    return responseJSON.data.client_id
}
```

The `registerClient()` function will expect the `roomId` string that will be used to determine which room the peer client should be registered. It also optionally expect a `uid` which is a unique identifier for the client and should be in a number format. You can leave this `uid` field empty if you want. On successfull registration, this function will return a new client ID which can be used for other operations later.

### Call the register function

The `registerClient()` function will be called inside the `join()` function after the room has been created.

```js
async function join() {
    // ...

    client.id = await registerClient(room.id);
}
```

## 4. Join and connect to the room

This tutorial and the Hub API heavily use the [WebRTC technology](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) to provide real-time communication capability between each participant in the room. The way each participant joins the room is by establishing the connectivity and communication session between peers known as [signaling and negotiation process](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling). The signaling process notifies each peer when another peer wants to connect and establish the connection through [ICE](https://developer.mozilla.org/en-US/docs/Glossary/ICE) protocol. The negotiation process allows each individual peer to exchange metadata such as offer, answer, and ICE candidates with another peer to establish a connection.

The way signaling process is handled through the Hub API signaling channel that triggers [server-sent event (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) mechanism to each individual peer and receive a real-time signal from the channel. We will cover more about this in the next section.

This is the overview for each individual step in order to establish the connection through signaling and negotiation process:
1. Get and capture the transmission of user [media stream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) which consists of video (camera) and audio (microphone) tracks.
2. Add each individual track from user media stream to the [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) instance. This will trigger [negotiationneeded event](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event).
3. Handle the `negotiationneeded` event by exchanging the local offer [SDP](https://developer.mozilla.org/en-US/docs/Glossary/SDP) with answer SDP returned by the Hub API. After a successful exchange, the process of ice candidate gathering will begin. This ice candidate gathering process will trigger peer connection [icecandidate](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icecandidate_event) and SSE `candidate` events.
4. The [RTCIceCandidate](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate) instance should be handled after it is received from the peer connection `icecandidate` and SSE `candidate` events. We can handle this by exchanging ICE candidates between the local `RTCPeerConnection` instance and the Hub API.
5. If the SDP negotiation and ICE candidate gathering process has finished, the connection between peer should be established and ICE connection state should be changed to "connected". The way to detect the ICE connection state change is using the peer connection [iceconnectionstatechange event](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceconnectionstatechange_event).
6. Additional thing is to display the captured user media stream transmission in a HTML video element so the participant can see what content their own camera transmit.

All these steps are executed when the participant tries to join the room using the join button. We need to implement and execute these functionalities inside our existing `join()` function.

### Get the user media stream

We need to get and capture the [media stream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) transmitted from the participants camera and microphone. Let's create a function called `getUserMediaStream()` which calls the [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) web API and returns a promise of media stream. Note that you can modify the [custom constraints](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Constraints). Then we call the function in the `join()` again.

```js
async function getUserMediaStream(constraints) {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        return mediaStream;
    } catch (error) {
        console.error(error);
    }
}

async function join() {
    // ...

    const mediaStream = await getUserMediaStream({
        video: true,
        audio: true
    });
}
```

### Add each individual track from media stream to peer connection

The media stream we have captured from the [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) consists of two different kind of tracks, the audio and video tracks. In order to be able to transmit these tracks to another peer, we need to add start establishing the peer connection and adding these tracks into the peer connection.

```js
function establishPeerConnection(roomId, clientId, mediaStream) {
    peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "turn:turn.inlive.app:3478",
                username: "inlive",
                credential: "inlivesdkturn"
            },
            {
                urls: "stun:turn.inlive.app:3478",
            },
            // {
            //     urls: "stun:stun.l.google.com:19302",
            // },
        ]
    });

    // listen when the ice connection state changes
    peer.addEventListener('iceconnectionstatechange', (event) => {
        console.log('ice connection state change to ', peer.iceConnectionState);
    });

    // this will trigger negotiationneeded event
    mediaStream.getTracks().forEach((track) => {
        peer.addTrack(track, mediaStream);
    });
}

async function join() {
    // ...

    establishPeerConnection(room.id, client.id, mediaStream);
}
```

The `establishPeerConnection()` function is called inside the `join()` function and has the responsibility of handling all connectivity establishment in the room. This function expects three parameters, the room ID, the client ID, and the captured media stream.

We start from the simple thing by creating a new [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) instance with [iceServers configurations](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer). Then, each individual track is added into the peer connection. Doing this will trigger a peer connection `negotiationneeded` event. We will handle this event soon. Notice that we also listen for `iceconnectionstatechange` event. This is an event to detect whether the ICE connection state is successfully established or whether there is an issue with the ICE connection state.

### Handle the negotiation needed event

The process of SDP negotiation exchange between the local offer SDP and answer SDP returned by the Hub API is done in the `negotiationneeded` event. We will modify the `establishPeerConnection()` function.

```js
function establishPeerConnection(roomId, clientId, mediaStream) {
    // ...

    peer.addEventListener('negotiationneeded', async () => {
        const allowNegotiateResponse = await fetch(`${apiOrigin}/${apiVersion}/rooms/${roomId}/isallownegotiate/${clientId}`, {
            method: 'POST',
        });

        if (allowNegotiateResponse.ok) {
            if (!peer) return;

            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            const negotiateResponse = await fetch(`${apiOrigin}/${apiVersion}/rooms/${roomId}/negotiate/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(peer.localDescription.toJSON())
            });

            const negotiateJSON = await negotiateResponse.json();
            const answer = negotiateJSON.data.answer;
            const sdpAnswer = new RTCSessionDescription(answer);
            await peer.setRemoteDescription(sdpAnswer);
        }
    });

    // ...
}
```

Both local client and Hub API server sides can initiate the SDP negotiation exchange and since there's a possibility the negotiation is requested from the Hub API, we need to check if the request to do a negotiation to Hub API is allowed when  `negotiationneeded` event happens. We can check by sending a request to the endpoint   `/rooms/<ROOM_ID>/isallownegotiate/<CLIENT_ID>` using `POST` method. If the Hub API sends back an [ok response](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok), then the client is allowed to request a negotiation.

If the client is allowed to request a negotiation, the peer will create and set the local offer SDP for local peer connection, and then send the offer SDP to the `/rooms/<ROOM_ID>/negotiate/<CLIENT_ID>` endpoint using `PUT` method. The endpoint will have a response that contains the remote answer SDP which also needs the SDP be set to the local peer connection.

If the client is not allowed to request negotiation, there is a possibility the negotiation request is sent by the Hub API to the client instead. What the client needs to do in this scenario is to wait for an `offer` SSE from the Hub API signaling channel and handle the request negotiation after the `offer` event received. We will cover the `offer` SSE in the next section.

### Handle peer connection icecandidate event

After a successful exchange, the process of ice candidate gathering will begin. This ice candidate gathering process will trigger peer connection `icecandidate` event. What you need to do to speed up the ice gathering process is to send the [RTCIceCanddiate](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate) instance received from the `icecandidate` event to the `/rooms/<ROOM_ID>/candidate/<CLIENT_ID>` endpoint using `POST` method.


```js
function establishPeerConnection(roomId, clientId, mediaStream) {
    // ...

    peer.addEventListener('icecandidate', async (event) => {
        const candidate = event.candidate;

        if (candidate) {
            await fetch(`${apiOrigin}/${apiVersion}/rooms/${roomId}/candidate/${clientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(candidate.toJSON())
            });
        }
    });

    // ...
}
```

### Handle peer connection SSE candidate event

The peer connection SSE `candidate` event will also be triggered when the ice candidate gathering process begins. To listen the SSE event, we need to create a new [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) interface that listens any event from a specific endpoint. The event endpoint we need to listen is `/rooms/<ROOM_ID>/events/<CLIENT_ID>`.

```js
function establishPeerConnection(roomId, clientId, mediaStream) {
    // ...

    const sse = new EventSource(`${apiOrigin}/${apiVersion}/rooms/${roomId}/events/${clientId}`);

    sse.addEventListener('candidate', async (event) => {
        if (!peer || !peer.remoteDescription) return;

        const candidate = new RTCIceCandidate(JSON.parse(event.data));
        await peer.addIceCandidate(candidate);
    });

    // ...
}
```

On listening the SSE `candidate` event from the Hub API, what we need to do is to add the ice candidate data which sent thorugh SSE to the local peer connection. If you have properly handled the ice gathering process, the [ice connection state](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState) will change into "connected" state. This means we have successfully established the connection.

### Display the captured user media stream transmission in a HTML video element

In order to display the local user media stream from camera and microphone, we need to insert the media stream into a HTML media element, in our case we use HTML video element.

```js

function displayUserMediaStream(mediaStream) {
    const localVideo = document.querySelector('video#local');
    localVideo.srcObject = mediaStream;
}

async function join() {
    // ...

    displayUserMediaStream(mediaStream);
}

```

We need to create a really simple function called `displayUserMediaStream()`  and call it inside the `join()` function again. The function only does one simple task which is to transmit the user media stream we have captured to the [srcObject](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject) in the HTML video element.

### Toggle the join button

The last function which needs to be called inside the `join()` function is `toggleJoinButton`. Basically this function will toggle the join button and change it into button for leaving the room.

```js
function toggleJoinButton() {
    const button = document.querySelector('button#togglejoin');

    if (joined) {
        button.textContent = 'Join';
        joined = false;
    } else {
        button.textContent = 'Leave';
        joined = true;
    }
}

async function join() {
    // ...

    toggleJoinButton();
}
```

## 5. Handle other participants who enter and leave in the room

### Receive offer SDP from SSE signaling channel to repeat the negotiation process

Incoming and leaving participant connections in the room are managed by Hub API. You need to understand that every time a new participant is connected or disconnected from the room, we may need to repeat the negotiation process. The Hub API will start the renegotiation process by sending a new remote offer SDP to all participants using server-sent event. The event is called `offer` event and what we need to do after receiving the remote offer SDP from this event is to answer back with the answer SDP created by local peer connection and send the answer SDP to the `/rooms/<ROOM_ID>/negotiate/<CLIENT_ID>` endpoint using HTTP `PUT` method.

We need to listen the server-sent `offer` event sent by Hub API signaling channel. Let's add the handler inside the `establishPeerConnection()` function from the step 4.

```js
function establishPeerConnection(roomId, clientId, mediaStream) {
    // ...

    sse.addEventListener('offer', async (event) => {
        if (!peer) return;

        const offer = JSON.parse(event.data);
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        fetch(`${apiOrigin}/${apiVersion}/rooms/${roomId}/negotiate/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(peer.localDescription.toJSON())
        });
    });

    // ...
}
```

### Handle incoming and leaving remote track

When the renegotiation process is successful and a new [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) is available, the local peer will trigger an event called [track event](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event). This track event consists the incoming remote participant media stream and tracks data. This data is useful when you want to display and present the content sent by each remote participant.

When other connected media stream is suddenly having disconnected because the participant leaves from the room, each track for that corresponding media stream is also removed. The Hub API will start the renegotiation process and send the offer SDP to all participants again. Then, the [removetrack event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/removetrack_event) is also triggered and can be listened by every active participants in the room. We can do cleaning logic such as updating the UI when a participant leaves by removing the video element from the DOM.

Additional thing about `removetrack` event is the event may be triggered with something other than participant disconnected or leaving from the room. This event can be triggered because the track is removed using local peer [removeTrack() method](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/removeTrack). The use of this `removeTrack()` method for example is to stop and remove the participant screen sharing track. When screen sharing is stopped, the screen sharing track will be removed, but the participant still stays connected in the room.

```js
function establishPeerConnection(roomId, clientId, mediaStream) {
    // ...

    peer.addEventListener('track', (event) => {
        const mediaStream = event.streams.find((stream) => stream.active === true);
        const track = event.track;

        if (streams.has(mediaStream.id)) return;

        streams.set(mediaStream.id, mediaStream);

        const video = document.createElement('video');
        video.classList.add('remote');
        video.playsInline = true;
        video.muted = false;
        video.srcObject = mediaStream;
        video.play();

        document.querySelector('main').appendChild(video);

        mediaStream.addEventListener('removetrack', (event) => {
            const target = event.target;

            if (streams.has(target.id) && target.getTracks().length === 0) {
                video.remove();
                streams.delete(target.id);
            }
        });

        track.addEventListener('ended', () => {
            video.remove();
        });
    });

    // ...
}
```

The `establishPeerConnection()` function above from the step 4 is updated again and this update add the capability to listen and handle local peer track event. Basically, when a track event is triggered, want to do these:
1. Put the track's remote media stream into the [Map object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) to track each connected remote media stream.
2. Create a HTML video element and put the remote media stream there to display and present the remote media stream content to the UI. In our case, the content is the camera video and audio from other participants.
3. Listen to the `removetrack` event and remove the disconnected remote media stream along with the HTML video element which uses the same remote media stream.
4. The leaving participant can listen for track [ended event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/ended_event) after its local peer connection is closed. In our case, the leaving participant can remove each remote participant video using track ended event.

## 6. Leave the room

Every leaving participant event can be listened with `removetrack` event because a media stream consists tracks that represents as one participant in the room. There are multiple ways for participants to leave the room such. Disconnected from internet, browser window or browser tab is closed, and an action that triggers to leave the room programmatically through Hub API are the scenarios for leaving participants. The peer connection will fail and trigger the participant to be removed from the room. The Hub API through signaling channel will let other participants know by starting the renegotiation process and send the offer SDP again using server-sent event. Then the `removetrack` event is triggered. If all participants are leaving and disconnected from the room, and there is no more participant in the room, the room will be removed automatically.

We need to create `leave()` function and this function will call two additional functions:
1. `leaveRoom()` function where all the logic for leaving the room and disconnect the connection happens.
2. `toggleJoinButton()` function to toggle the leave button into join button. We have covered this in the previous section.

```js
async function leave() {
    await leaveRoom(room.id, client.id);
    toggleJoinButton();
}
```

We need to create `leaveRoom()` function. This function expects the room ID, the client ID parameters. Inside this function where we want to write the logic to leave and disconnect from the room programmatically.

In order to leave the room, we want to do these things:
1. Send the HTTP request using `DELETE` method to the `/rooms/<ROOM_ID>/leave/<CLIENT_ID>`.
2. Stop all the tracks from local peer [getSenders()](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/getSenders) method.
3. Remove and stop displaying the HTML video screen because the transmission from each local media stream track is already stopped.
4. Close and reset the local peer connection.

Note that after sending the HTTP `DELETE` request to the `/rooms/<ROOM_ID>/leave/<CLIENT_ID>` endpoint. The Hub API will start the renegotiation process and trigger the `removetrack` for every active participants in the room.

```js
async function leaveRoom(roomId, clientId) {
    const leaveResponse = await fetch(`${apiOrigin}/${apiVersion}/rooms/${roomId}/leave/${clientId}`, {
        method: 'DELETE',
    });

    peer.getSenders().forEach((sender) => {
        if (sender.track) {
            sender.track.enabled = false;
            sender.track.stop();
        }
    });

    const localVideo = document.querySelector('video#local');
    localVideo.srcObject = null;

    // when local peer is closed, the ended event will be triggered
    peer.close();
    peer = null;

    joinUrl = '';
    document.querySelector('#info').innerHTML = '';
}
```

## 7. End the conference room

To end the room basically means stopping all participants connection and communication in the room. All participants tracks are removed, which causes to trigger the start renegotiation process and `removetrack` event. The room can be ended by sending HTTP request with `PUT` method to `/rooms/<ROOM_ID>/end` endpoint.


```js
async function endRoom(roomId) {
    fetch(`${apiOrigin}/${apiVersion}/rooms/${roomId}/end`, {
        method: 'PUT',
    });
}
```

## Closing

We have covered the basic concept of inLive Hub API to develop a simple video conferencing room application. You can check the full source code of this tutorial on [this repository](https://github.com/inlivedev/inlivedev.github.io/tree/main/examples/conference). You can also check the [live demo](https://inlivedev.github.io/examples/conference/) of this tutorial.