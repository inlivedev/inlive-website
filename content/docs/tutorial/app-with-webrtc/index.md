---
date: 2022-03-11
lastmod: 2022-03-11
name: Tutorial with WebRTC
title: Tutorial building a live stream app with WebRTC
description: This tutorial will show you how to build a live video stream web app with WebRTC video source input.
slug: tutorial-app-with-webrtc
weight: 3001
menu:
  docs_sidebar:
    identifier: Tutorial with WebRTC
    name: Tutorial with WebRTC
    weight: 3001
    parent: Tutorial
---
# Tutorial building a live stream app with WebRTC

This tutorial will show you how to build a live video stream web app with WebRTC video source input. Please read it on [video input documentation](/docs/video-input/) to understand what the WebRTC is and how it's compared with RTMP.

This tutorial will show you how to create a streamer client and viewer page.
We will create a web page for the streamer client to capture our webcam directly and send it to Inlive encoder as a video source input once the user clicks the start button.
We will create a web page that can use by live stream viewers to watch the live video stream.

## A. Requirement
Before coding your web app, you need to create an application key as stated in our [getting started documentation](/docs/getting-started). Please make sure you write down that key after you create it because it is used in this web app that we will create.

## B. Create a streamer client
A streamer client will be using a video capture to capture your webcam video and send it to Inlive encoder. Inlive encoder will encode and publish the video that we watch later with a video player. In this tutorial we will create a streamer client that will create a stream with the name with set, then start a stream.

### 1. Create a live stream
Before going live, a streamer will always need to create a live stream. This live stream is unique, and it will provide single video input and single video output that can watch through a video player. To create a live stream, use `https://api.inlive.app/v1/streams/create` endpoint to create a stream. But before interacting with the API, first, we need to create a function called `APIRequest` and default options for customized and reusable API request function.

```js
let options ={
    origin: 'https://api.inlive.app',
    apiVersion: 'v1',
    apiKey:'<your-api-key>'

}

async function apiRequest(apiKey, url, method, body){
    const opts = {
        method:method,
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
        }
    };

    if(typeof body!== 'undefined')
        opts.body = JSON.stringify(body);

    const res = await fetch(url,opts);

    try{
        const bodyJSON = await res.json();
        return bodyJSON;

    } catch(err) {
        console.error(err);
        throw err;
    }
}
```

Then we use the function above to create a create stream function that will binded to create stream button. When the button clicked, the function will called and create a stream with a stream name `my first stream`.

```js
async function createStream(){
    const url = `${options.origin}/${options.apiVersion}/streams/create`;
    try{
      resp = await apiRequest(options.apiKey, url, 'POST',{
        name:'my first stream',
        slug:'my-first-stream'
      });

    } catch(err) {
      console.error(err)
    }
}
```

### 2. Create a web page for monitoring and create or start stream.
Use the code below to create a simple web page that contain a video element to monitor the captured video stream from your video, and buttons for create a stream, and start the stream.

```html
<video autoplay muted controls playsinline></video>
<button onclick="createStream()">Create Stream</button>
<button onclick="startStream()">Start Stream</button>
```

We need to set the video element to be muted and autoplay to make the video plays automatically once it's loaded.

### 3. Capture the video.
Read the [WebRTC APIs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) and learn about [how to capture the video from your webcam](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API). You need to understand how to get permission from users to allow you to capture the video from their webcam. Below is an example of how we capture the video from the webcam when the start stream button is clicked.

```js
async function startStream(){
    const videoEl = document.querySelector('video');
    const constraints = {
            video: {
            frameRate: 30,
            width: 1280,
            height: 720,
            },
            audio: true
        };

    const localStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoEl.srcObject = localStream;
}
```

### 3. Initiate the WebRTC connection by sending offer SDP and receiving an answer from inLive API
Once the video stream input is available, we're ready to send the video stream to Inlive encoder and start publishing our live video stream. To send the video, these are the steps we need to follow:
1. Create `RTCPeerConnection` object and add the media stream tracks to this RTCPeerConnection. This is an important step to make sure the Offer SDP that we will generate will have information about our media tracks, like video and audio codec information. The RTCPeerConnection also will need to have a media track before being able to start the ice gathering process.

    We modify the start stream function and adding some lines to send the video through WebRTC connection.

   ```js
    async function startStream(){
        const videoEl = document.querySelector('video');
        const constraints = {
                video: {
                frameRate: 30,
                width: 1280,
                height: 720,
                },
                audio: true
            };

        const localStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoEl.srcObject = localStream;

        const servers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                {
                    urls: 'turn:34.101.121.241:3478',
                    username: 'username',
                    credential: 'password'
                }
            ]
        }

        const peerConnection = new RTCPeerConnection(servers);

        peerConnection.oniceconnectionstatechange = () => {
            // handle state change (disconnect, connected)
            const iceConnectionState = peerConnection.iceConnectionState;
            console.log('iceConnectionState', iceConnectionState);

        }

        peerConnection.onicecandidate = async (event) => {
            // initiate the stream process once ice gathering is finished
            if (event.candidate === null) {
                await initStream(slug,peerConnection,options);
            }
        }

        // we use stream from the webcam that we captured from previous step
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        try {
            const offerSession = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offerSession);
        } catch (err) {
            console.error(err);
        }
    }
    ```

2. If you see `peerConnection.onicecandidate` line above, there is an `initStream` function called after the ice candidate gathering is finished. The `event.candidate === null` means the gathering process is finished. The `initStream` function is called to initiate a WebRTC connection with the inLive server by sending an HTTP POST request to API endpoint `https://api.inlive.app/v1/streams/${streamid}/init`.

    Then we create `initStream` function that use that `APIRequest` function.
    ```js
    async function initStream(slug,peerConnection,options){
        const body = {
            slug : slug,
            session_description: peerConnection.localDescription,
        }

        try {
            const url = `${options.origin}/${options.apiVersion}/streams/${slug}/init`

            const resp = await apiRequest(options.apiKey,url,'POST',body)

            if (resp.code === 200) {
                const answerSDP = new RTCSessionDescription(resp.data);
                peerConnection.setRemoteDescription(answerSDP);
            } else {
                throw new Error('Failed to init stream session');
            }
        } catch (error) {
            console.error(error);
            throw err;
        }

    }
    ```
    As you see above, once we got the response from the init endpoint, we set the `peerConnection` with the answer SDP that we extract from the response by calling `peerConnection.setRemoteDescription(answerSDP)`.

3. Once the RTCPeerConnection is set with both offer and answer SDP, it will initiate the connection to the remote peer, and the `peerConnection.oniceconnectionstatechange` will be triggered if the connection state is changing.

### 4. Get the video
Once we streamed the video from our webcam through WebRTC, we can watch the video by getting the video URL through the stream detail endpoint.
Get the stream detail by sending HTTP GET request to the API endpoint `https://api.inlive.app/v1/streams/${streamid}`. Let's create a get stream function that we can call later
```js
async function getStream(slug,options){
    try{
        const url = `${options.origin}/${options.apiVersion}/streams/${slug}`
        const apiResp = await apiRequest(options.apiKey, url, 'GET');
        return apiResp;
    } catch(err) {
        console.error(err)
        throw err;
    }
}
```
The API response will return data like this:

```json
{
    "code": 200,
    "message": "OK",
    "data": {
        "id": 2,
        "name": "my first stream",
        "slug": "my-first-stream",
        "start_date": "2022-02-22T10:28:33.799416Z",
        "end_date": "2022-02-22T10:51:31.049414Z",
        "hls_manifest_path": "https://bifrost.inlive.app/streams/2/master.m3u8",
        "dash_manifest_path": "https://bifrost.inlive.app/streams/2/manifest.mpd",
        "description": "my first stream",
        "created_by": 3,
        "created_at": "2022-02-22T10:28:20.69262Z",
        "updated_by": null,
        "updated_at": "2022-02-22T10:51:31.050747Z"
    }
}
```

There are two options to play the video, and you can [read more detail here](/docs/guide/playing-video). But in this tutorial, we will use the shaka player to embed the video player to our website. The code below will show you how to use HLS URL playlist from API to play it with Shaka Player. We use the modified version of [Shaka basic tutorial example](https://shaka-player-demo.appspot.com/docs/api/tutorial-basic-usage.html) for this. Create a new page and use the code below:

```html
<html>
    <head>
        <title>Watch a live stream</title>
        <script defer src="https://ajax.googleapis.com/ajax/libs/shaka-player/3.3.2/shaka-player.compiled.js"></script>
        <script defer>
            const manifestUri =
                'https://bifrost.inlive.app/streams/2/manifest.mpd';

            function initApp() {
            // Install built-in polyfills to patch browser incompatibilities.
            shaka.polyfill.installAll();

            // Check to see if the browser supports the basic APIs Shaka needs.
            if (shaka.Player.isBrowserSupported()) {
                // Everything looks good!
                initPlayer();
            } else {
                // This browser does not have the minimum set of APIs we need.
                console.error('Browser not supported!');
            }
            }

            async function initPlayer() {
            // Create a Player instance.
            const video = document.getElementById('video');
            const player = new shaka.Player(video);

            // Attach player to the window to make it easy to access in the JS console.
            window.player = player;

            // Listen for error events.
            player.addEventListener('error', onErrorEvent);

            // Try to load a manifest.
            // This is an asynchronous process.
            try {
                await player.load(manifestUri);
                // This runs if the asynchronous load is successful.
                console.log('The video has now been loaded!');
            } catch (e) {
                // onError is executed if the asynchronous load fails.
                onError(e);
            }
            }

            function onErrorEvent(event) {
            // Extract the shaka.util.Error object from the event.
            onError(event.detail);
            }

            function onError(error) {
            // Log the error.
            console.error('Error code', error.code, 'object', error);
            }

            document.addEventListener('DOMContentLoaded', initApp);
        </script>
    </head>
    <body>
        <video autoplay muted controls playsinline></video>
    </body>
    </html>
```
