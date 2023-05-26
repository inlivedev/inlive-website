---
date: 2023-05-26
lastmod: 2023-05-26
name: Tutorial with WHIP
title: Tutorial building a live stream app with WHIP standard
description: This tutorial will show you how to build a live video stream web app using WHIP standard.
slug: tutorial-app-with-whip
weight: 4003
menu:
  docs_sidebar:
    identifier: Tutorial with WHIP
    name: Tutorial with WHIP
    weight: 4003
    parent: Tutorial
---
# Tutorial building a live stream app with WHIP

WHIP(WebRTC-HTTP ingestion protocol) is a standard protocol for live video stream ingestion. It is designed to be simple, flexible and extensible. It is based on WebRTC and HTTP. It is a good choice for building live video stream apps. Because it's standard, you can use any WHIP compatible client to publish video stream to your server. OBS will have a WHIP support soon, so you will able to do live streaming with OBS to inLive.

You can use any WHIP compatible server to publish video stream to your server. Means the app that you develop with WHIP will easily to use with other streaming provider.

This tutorial will show you how to build a live video stream web app using WHIP standard to go live with inLive API.

## Prerequisites
Before starting, you need to prepare the following things:
1. API key generated from [inLive Studio](https://studio.inlive.app)
2. WHIP JS library. There are several options for WHIP library like
   * [medooze/whip-whep-js](https://github.com/medooze/whip-whep-js) (JavaScript)
   * [@eyevinn/whip-web-client](https://www.npmjs.com/package/@eyevinn/whip-web-client) (Typescript)
   * [whip-go](https://github.com/ggarber/whip-go) (Go)
   * [gst-plugins-rs](https://gitlab.freedesktop.org/gstreamer/gst-plugins-rs) (Gstreamer plugins, written in Rust)
   * [Larix Broadcaster](https://softvelum.com/larix/)  (free apps for iOS and Android with WebRTC based on Pion, SDK available)

    For this tutorial we will be using [medooze/whip-whep-js](https://github.com/medooze/whip-whep-js) 
3. Understand the flow of doing a live streaming with inLive which are:
   1. Create a live stream
   2. Prepare the live stream
   3. Ingest the video stream
   4. Start the live stream to get the Dash/HLS manifest

    For the second and third step, ingest the video stream, we will be using WHIP standard instead of using the WebRTC normal procedure. Calling the WHIP ingest endpoint will automatically start prepare the live stream.

## Create a simple web app
To begin with, we will need a simple HTML file as our web app. Create a file named `index.html` and put the following code in it:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>inLive WHIP Tutorial</title>
</head>
<body>
    <h1>inLive WHIP Tutorial</h1>
    <video id="video" controls></video>
    <button>Go live</button>
    <script src="app.js"></script>
</body>
</html>
```

Our HTML file only have a video element and a button. The video element will be used to display the live stream. The button will be used to start the live stream. We also include the WHIP JS library in the HTML file. We will use this library to publish the video stream to our server.

## Download the WHIP JS library and put it in the same folder as the HTML file
Download the WHIP JS library from [medooze/whip-whep-js](https://github.com/medooze/whip-whep-js/blob/main/whip.js) and put it in the same folder as the HTML file.

Then in the `app.js` file, we will import the WHIP JS library. Put the following code in `app.js`:
```js
import { WHIPClient } from "./whip.js"
```

## Get the API key from inLive Dashboard 
Before we start writing the JavaScript function. We need the API key that you can get from inLive Dashboard. Put the API key as global variable in `app.js`. We also put the `API_ORIGIN` variable to make it easier to change the API origin in the future. Put the following code in `app.js`:
````js
const API_KEY = '<api-key-here>'
const API_ORIGIN = 'https://api.inlive.app'
````


## Create a function to create stream with inLive API
Before able to publish the video stream, we need to create a live stream first. To create a live stream, we will use inLive API. We will use the `createStream` function to create a live stream. In real app, you need to pass the stream name to the function. But to simplify this tutorial, we will hardcode the stream name.

Create a Javascript file named `app.js` and put the following code in it:
```js
async function createStream(){
    const resp = await fetch(`${API_ORIGIN}/v1/streams/create`,{
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            name: 'My live stream',
        })
    })

    if (resp.status === 200){
        const respJSON = await resp.json()
        return respJSON.data
    } else {
        throw new Error(resp.statusText)
    }
}
```

## Create a WHIP ingestion function with WHIP JS library
Next we add the go live function. This function will be called when the button is clicked. This function will create a live stream and publish the video stream to the live stream. Put the following code in `app.js`:

```js
async function WHIP(stream, mediaStream){
    const client = new WHIPClient({
    endpoint: `${API_ORIGIN}/v1/streams/${stream.id}/whip`,
    opts: { 
            debug: true, 
            iceServers: [{ urls: "stun:stun.l.google.com:19320" }],
            authkey: API_KEY
        }
    });

    await client.setIceServersFromEndpoint();
    await client.ingest(mediaStream);
}
```

## Create a function to start the live stream
Next we add the go live function. This function will be called when the button is clicked after we ingest the video with WHIP function. This function will start the live stream and will return the Dash and HLS manifest. Put the following code in `app.js`:

```js
async function startStream(stream, mediaStream){
    const resp = await fetch(`${API_ORIGIN}/v1/streams/${stream.id}/start`, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${API_KEY}`
        }
    })

    if (resp.status === 200){
        const respJSON = await resp.json()
        return respJSON.data
    } else {
        throw new Error(resp.statusText)
    }
}
```

## Handle on load page and button click
Last, we are wired everything into a load event that will be triggered when the page is loaded. The page will load the media stream from camera and microphone when page loaded, and we will go live when the button is clicked. 

When the button is clicked and we succesfully go live, we will get the Dash and HLS manifest. We will create a link to watch the live stream with the manifest and open it in a new tab.

Put the following code in `app.js`:

```js
document.addEventListener('DOMContentLoaded', async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    const video = document.getElementById('video')
    video.srcObject = mediaStream
    const button = document.querySelector('button')
    
    button.addEventListener('click', async () => {
        const stream = await createStream()
        await WHIP(stream, mediaStream)
        const manifest = await startStream(stream)
        document.CreateElement('a')
        a.href = manifest
        a.innerText = 'Watch live stream'
        a.target = '_blank'
        document.body.appendChild(a)
    })
})
```

## Run the app
Now we have everything we need. We just need to open the web app, allow the browser to access the camera and microphone, and click the button to go live. You can see the live stream in the video element and you can also open the link to watch the live stream in a new tab.

## Conclusion
We put together the example code above in our [Github repository](https://github.com/inlivedev/inlivedev.github.io/tree/main/examples/whip-webrtc-dash-hls). You can clone the repository and run the app in your local machine.

