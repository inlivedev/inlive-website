---
date: 2023-11-06
lastmod: 2023-11-06
name: conference-app-with-javascript-sdk
title: Conference App with JavaScript SDK
description: This tutorial explains about how to use the inLive JavaScript SDK to develop a simple room-based conference application.
ogimage:
slug: conference-app-with-javascript-sdk
menu:
  docs_sidebar:
    identifier: conference-app-with-javascript-sdk
    name: Conference App with JavaScript SDK
    parent: hub-api
    weight: 2
---

# Conference App with JavaScript SDK

This tutorial explains about how to use the inLive JavaScript SDK to develop a simple room-based conference application.

## Overview

We will create a simple web-based video conferencing room application. When the user opens the page, there is no room exists yet. User will click the "join" button to join to the room room and click the "leave" button to leave the room. When the user tries to join to the room and the room doesn't exist, the room will be automatically created and the user is also automatically joined to the room. The page will display a URL to share. Other people can join the same room by using the URL displayed.

The implementation will have basic UI, and no authentication mechanism to keep it simple. We use the [Room module](https://github.com/inlivedev/inlive-js-sdk/tree/main/packages/room) from inLive JavaScript SDK to make integration with [inLive Hub API](https://hub.inlive.app/apidocs/index.html) easier. Under the hood, the [Room module](https://github.com/inlivedev/inlive-js-sdk/tree/main/packages/room) will use the [WebRTC technology](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) to provide real-time communication capability between each user in the room.

This tutorial is split into multiple steps:
1. Create a basic UI with HTML and CSS
2. Import and initialize the SDK
3. Create and join a room
4. Handle other users who join and leave the room
5. Leave the room

## 1. Create a basic UI with HTML and CSS

We need a basic HTML layout with button and video element to display the video and audio inputs from camera and mic. This is the HTML code we will use for this tutorial.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Video Conference Room with inLive JavaScript SDK</title>
</head>
<body>
    <div id="app">
        <main>
            <video id="local-video" autoplay playsinline muted></video>
        </main>
        <aside>
            <button id="toggle-join-btn">Join</button>
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

    video {
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

## 2. Import and initialize the SDK

We will start implementing the JavaScript for the application. We need to import the inLive JavaScript SDK and initialize global variables to use later.

```js
import { Room, RoomEvent } from 'https://cdn.jsdelivr.net/npm/@inlivedev/inlive-js-sdk@0.17.3/dist/room.js'

// Initialize the Room module
const room = Room({
    api : {
        apiKey: 'YOUR_API_KEY'
    }
});

// The ID of the room
let roomID = '';

// The ID of the client used to connect with the Room API
let clientID = '';

// Client identifier name
let clientName = '';

// The peer object
let peer = null;

// People can join to the same room with this URL
let joinUrl = '';

// A state variable as an indicator when the user joins to the room
let joined = false;
```

## 3. Create and join a room

### Toggle join button

The first thing the user will see when they open the page is a blank screen and a join button. When the join button is clicked, the user will join the room. When the leave button is clicked, the user will leave the room. We can use the code below to create the basic click listener logic on the button.

```js
document.getElementById('toggle-join-btn').addEventListener('click', async function(event) {
    if (joined) {
        await leave();
        event.target.textContent = 'Join';
        joined = false;
    } else {
        await join();
        event.target.textContent = 'Leave';
        joined = true;
    }
});
```

### Turn on the camera and mic inputs

User must allow the camera and mic permissions in order to join to the room. So, when the user clicks the join button, we need to ask for the user to turn on the camera and mic. Using the media device [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) method, the browser will ask for the user to allow and turn on the camera and mic usages. A [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object will be obtained when the permissions are allowed and we need to put it into the video element `srcObject` to display the output of camera and mic. We call the `getUserMedia()` inside the `join()` function.

```js
async function join() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    document.getElementById('local-video').srcObject = mediaStream;
}
```

### Create a new room

Let's create a logic to create a new room inside the `join()` function. In this tutorial, when the room is created, we want to store the room ID on the URL. Other users can join to the same room by using the room ID on the URL. If the room ID doesn't exist on the URL, a new room will be created by calling the `room.createRoom()` method.

```js
async function join() {
    // ...
    roomID = new URL(window.location.href).searchParams.get('roomID');

    if (!roomID) {
        const newRoom = await room.createRoom('My room');
        roomID = newRoom.data.id;
    }

    joinUrl = encodeURI(window.location.origin + window.location.pathname + `?roomID=${roomID}`);
    document.getElementById('info').innerHTML = `Join URL : <a href="${joinUrl}" target="_blank">${joinUrl}</a>`;
}
```

### Create a client

Every user who wants to join to the room needs to create a client. A client is required to make the room secure by only allowing the client who has been created to join the room. We can create a client to the room only when the room is already created because we need the ID of the room for creating a client. To create a client, simply call the `room.createClient()` method. You can create a client with a custom client ID, or custom name. The example below gives an example of creating a client with a random client name string.

```js
async function join() {
    // ...
    const random = Date.now().toString(36).slice(-5);

    const client = await room.createClient(roomID, {
        clientName: `client-${random}`
    });

    clientID = client.data.clientId;
    clientName = client.data.clientName;
}
```

### Add MediaStream input to the peer

We need to create a peer which under the hood will manage and establish the WebRTC connection automatically. By now, we are ready to establish the WebRTC connection which will connect multiple peer that communicates with each other. To establish a WebRTC connection, we need to [negotiate a WebRTC connection](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation). The negotiation flow is already configured under the hood if you are using the SDK. So, you don't need to worry about that part.

What you need to do to trigger a WebRTC negotiation is by adding a local MediaStream input. We have obtained the local MediaStream earlier when we are asking the user to turn the camera and mic on using `getUserMedia()`. To add a MediaStream, you need to create a peer object and call the `peer.addStream()` method. After this, the negotiation flow will be configured automatically and you can check the peer connection status by getting the peer connection object using `peer.getPeerConnection()`. You can check the [connectionState](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState) or [iceConnectionState](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState) properties from peer connection object. If the value is `connected`, then the connection has been successfully established and connected. The user has successfully joined to the room.

```js
async function join() {
    // ...
    peer = await room.createPeer(roomID, clientID);
    peer.addStream(mediaStream.id, {
        clientId: clientID,
        name: clientName,
        origin: 'local',
        source: 'media',
        mediaStream: mediaStream
    });
}
```

## 4. Handle other users who join and leave the room

When the user has successfully joined to the room, the join URL for that room will be displayed on the page. The user can share the URL to other people or paste it into a different browser tab to simulate the join room scenario. We need to change the UI every time a remote user joins and leaves the room.

### Handle other users who join the room

To handle a remote user who joins the room, we can listen for an event called `STREAM_AVAILABLE`. This event happens when the remote user MediaStream is already available to use. When this event happens, we can create a new video element using JavaScript, and append it into the HTML. We can exclude the local MediaStream we have obtained from turning on the camera and mic by checking the `stream.origin` is a `local` and `stream.source` is a `media`.

```js
room.on(RoomEvent.STREAM_AVAILABLE, ({ stream }) => {
    if (stream.origin === 'local' && stream.source === 'media') return;

    const video = document.createElement('video');
    video.classList.add('remote');
    video.playsInline = true;
    video.muted = false;
    video.autoplay = true;
    video.srcObject = stream.mediaStream;
    video.setAttribute('id', `video-${stream.id}`);

    document.querySelector('main').appendChild(video);
});
```

### Handle other users who leave the room

When a remote user leaves the room, we can a listen for an event called `STREAM_REMOVED`. This event happens when the remote user no longer sends streaming data. We will remove the video element based on the ID of the removed stream.

```js
room.on(RoomEvent.STREAM_REMOVED, ({ stream }) => {
    const videoElement = document.getElementById(`video-${stream.id}`);

    if (videoElement) {
        videoElement.remove();
    }
});
```

## 5. Leave the room

By default, when the user reloads the page, the user will be forced to leave from the room automatically. You can also make the user leave from the room when they click a leave button. We will create a function called `leave()` and this function will be called when the user clicks a leave button. The `leave()` function will call a `room.leaveRoom()` and `peer.disconnect()` methods to properly leave from the room and disconnect the WebRTC connection. Then we will change the UI to initial state before joining to the room.

```js
async function leave() {
    await room.leaveRoom(roomID, clientID, false);
    peer.disconnect();

    document.getElementById('local-video').srcObject = null;
    joinUrl = '';
    document.getElementById('info').innerHTML = '';
}
```

## Closing

We have created a simple video conferencing room application using inLive JavaScript SDK. You can check the full source code of this tutorial on [this repository](https://github.com/inlivedev/inlivedev.github.io/tree/main/examples/conference-app-with-sdk).