---
date: 2022-03-11
lastmod: 2022-09-06
name: Tutorial with inLive JS SDK
title: Tutorial building a live stream app with inLive JS SDK
description: This tutorial will show you how to build a live video stream web app using inLive JS SDK.
slug: tutorial-app-with-inlive-js-sdk
weight: 4002
menu:
  docs_sidebar:
    identifier: Tutorial with SDK
    name: Tutorial with SDK
    weight: 4002
    parent: Tutorial
---
# Tutorial building a live stream app with inLive JS SDK

The previous tutorial with WebRTC, is showing you how to interact directly with inLive API using WebRTC API. To make it easier, we're provide a JavaScript SDK, so you don't need to write that much codes. This tutorial will guide you how to use the inLive JavaScript SDK to build the a live streaming web app.

This tutorial will show you how to create a streamer client and viewer page with inLive JS SDK.
We will create a web page for the streamer client to capture our webcam directly and send it to Inlive encoder as a video source input once the user clicks the start button.
We will create a web page that can use by live stream viewers to watch the live video stream.

The example code for this tutorial is available on our [Github repo](https://github.com/inlivedev/inlive-app-with-sdk). 

## A. Requirement
### 1. Get the API key
Before coding your web app, you need to create an application key as stated in our [getting started documentation](/docs/getting-started). Please make sure you write down that key after you create it because it is used in this web app that we will create.

### 2. Install inLive JS SDK
inLive JS SDK is distributed through NPM library. Means you need to have [NPM installed and setup](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) before able to install our SDK. For development you can link the published SDK directly to this URL:
```js

```
But for production, it is recommended to host it by your self. To install the SDK using NPM you can run the command below in your terminal:
```js
npm i @inlivedev/inlive-js-sdk
```

Once the SDK is installed, the SDK should available in your directory under `node_modules/@inlivedev/inlive-js-sdk`. There is a ready to use script under `dist` directory. You can import it in your JavaScript module like this:

```js
import {InliveApp,InliveStream,Stream} from './node_modules/@inlivedev/inlive-js-sdk/dist/inlive-js-sdk.js'
```

Please note, the above code is not good for production because usually we're never upload the whole node_modules directory into our web server. It is recommend to use a JavaScript bundler like Rollup, Webpack, or Vite, you can import our SDK into your code like this:

```js
import {InliveApp,InliveStream,Stream} from '@inlivedev/inlive-js-sdk'
```

Once you import it then we can start write our code.

## B. Create a streamer client
A streamer client will be using a video capture to capture your webcam video and send it to Inlive encoder. Inlive encoder will encode and publish the video that we watch later with a video player. In this tutorial we will create a streamer client that will create a stream with the name with set, then start a stream.

The streamer client will have two files:
* `index.html` to render the page
* `script.mjs` JavaScript module where we will write our code

We will show you how it looks like later.

### 1. Create a live stream
Before going live, a streamer will always need to create a live stream. This live stream is unique, and it will provide single video input and single video output that can watch through a video player. To create a live stream with our SDK, use `InliveStream.createStream()` that will request to endpoint to create a stream. But before able to use the ``InliveStream.createStream()`, we need the `InliveApp` instance first with an API key that we generated before.

Starting from here, all JavaScript code will be coded in `script.mjs` file unless we explicitly mention to code it in other files.

```js
const app = InliveApp.init({
  apiKey:'<your-api-key>'
 })
```

Then we use the function above to create a create stream function that will be binded to create stream button. When the button clicked, the function will called and create a stream with a stream name `my first stream`.

```js
let stream;

async function createStream(){
    try{
      stream = await InliveStream.createStream(app,{name:'my first stream'})
    } catch(err) {
      console.error(err)
    }
}
```

Beside `createStream()` method, we also create a stream global variable for the stream object that we receive when we create a stream. The stream object can also initiate with `InliveStream.getStream()` method.

### 2. Create a web page for monitoring and create or start stream.
Use the code below to create a simple web page named `index.html` that contain a video element to monitor the captured video stream from your video, and buttons for create a stream, start the stream, and end the stream.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Go Live Stream</title>
    <script type="module" defer>
        import {createStream,startStream,endStream,getStream} from './script.mjs'
            window.addEventListener('DOMContentLoaded',()=>{
                document.querySelector('#btnCreate').addEventListener('click',(e)=>createStream())
                document.querySelector('#btnStart').addEventListener('click',(e)=>startStream())
                document.querySelector('#btnEnd').addEventListener('click',(e)=>endStream())
            })
    </script>
    <body>
        <video autoplay muted controls playsinline></video>
        <button id="btnCreate">Create Stream</button>
        <button id="btnStart">Start Stream</button>
        <button id="btnEnd">End Stream</button>
    </body>
</html>
```

We're using JavaScript module here so we basically import the functions from script.mjs where we put the `createStream()`

Since we've already made a create stream function, then when we click on the `Create Stream` button, the API response will return data like this it can accessible with `stream.data` in stream variable:

```json
{
    "code": 200,
    "message": "OK",
    "data": {
        "id": 2,
        "name": "my first stream",
        "slug": "my-first-stream",
        "start_time": null,
        "end_time": null,
        "hls_url": "",
        "dash_url": "",
        "description": "",
        "billing_start": null,
        "billing_end": null,
        "created_by": 3,
        "created_at": "2022-02-22T10:28:20.69262Z",
        "prepared_at": null,
        "updated_by": null,
        "updated_at": "2022-02-22T10:51:31.050747Z",
        "quality": "360"
    }
}
```

We need to set the video element to be muted and autoplay to make the video plays automatically once it's loaded.

### 3. Capture the video.
Read the [WebRTC APIs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) and learn about [how to capture the video from your webcam](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API). You need to understand how to get permission from users to allow you to capture the video from their webcam. To capture the video and audio with your browser, we can use the `InliveStream.media` like this:

```js
async function startStream(){
    const constraints = {
    video: {
      frameRate: 30,
      width: 1200,
      height: 720,
    },
    audio: true,
  };

  const localStream = await InliveStream.media.getUserMedia(constraints);
  const videoEl = document.querySelector('video')
  
  InliveStream.media.attachMediaElement(videoEl,localStream)
}
```

### 4. Prepare the live stream
We need you to call this `prepare` API endpoint before starting to initiate the WebRTC connection. This is to start your live stream session, and this is where the billing will start counting your live streaming duration. This method will take a little bit time to complete because we need to start a WebRTC stream server. 

We will call the prepare endpoint before we initiate the WebRTC connection that will be explain next.

Please note that when we call `stream.prepare()` method, it also will start waiting the ice-candidate events from the API server using server-sent events. The ice-candidate events is used for WebRTC connection. To make sure the event listener is keep alive, the sequence call between `stream.prepare()` and the next call of `stream.init()` should be from the same `stream` instance. 

### 5. Initiate the WebRTC connection and start the live stream
Once the prepare method is complete, we're ready to send the video stream to Inlive WebRTC server and start publishing our live video stream. We will do two steps in one button click. Once the start button is clicked, we will do this steps:

1. Listen for `streamStarted` event use `stream.on()` method, so we know when the live video is ready to watch. This method also can be use from the viewer side to know when we should start the live stream video in the player.
2. Call the `stream.prepare()` to prepare the stream server as explain before.
3. Send the live video stream by calling `stream.init()` method and passing the video stream that we got from `InliveStream.media.getUserMedia` above.
4. After `stream.init()` has completed, we need to call `stream.start()` method to start broadcast the live stream video. 
   

The three steps below will be put together in one function.

```js
async function startStreaming(){
    try {
        // listen for stream started event
        stream.on(Stream.STARTED,()=>{
             a = document.createElement("a")
             a.href=`/live.html?id=${stream.id}`
             a.target = "_blank"
             a.append("Watch here")
             document.body.append(a)
        })

        // prepare the stream server first
        await stream.prepare()

       stream.init(localStream)
       stream.start()
    } catch (error) {
        console.error(error);
    }

}
```
From our code above, the page should append a anchor element to the page that include a link to another HTML page where we can watch the live stream video. Let's create this page in the next step.

### 6. Create a page to watch the live stream
Once we streamed the video from our webcam through WebRTC, we can watch the video by getting the video URL through `InliveStream.getStream()` method. 

Remember on `startStream` function that we created above, we pass the `stream.id` through URL query. Let's create a get stream function use that streamId.
```js
async function getStream(slug,options){
    try{
        const params = new URL(document.location).searchParams;
        const streamId = params.get('id');
        stream = InliveStream.getStream(app,streamId)
    } catch(err) {
        console.error(err)
    }
}
```

When the functionc called our `stream` variable will contain the stream instance that we can use to access the adaptive video manifest at `stream.manifests.dash` or `stream.manifests.hls`. This adaptive video manifest can be use to play the video.

There are two options to play the video, and you can [read more detail here](/docs/learn/playing-video). But in this tutorial, we will use the shaka player to embed the video player to our website. The code below will show you how to use `stream.manifests.dash` to play it with Shaka Player. We use the modified version of [Shaka basic tutorial example](https://shaka-player-demo.appspot.com/docs/api/tutorial-basic-usage.html) for this. Create a new page and use the code below:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Watch Live Stream</title>
    <!-- Import the stylesheet -->
    <link rel="stylesheet" href="/style.css" />
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Import the javascript file -->
    <script
      defer
      src="https://ajax.googleapis.com/ajax/libs/shaka-player/3.3.2/shaka-player.compiled.js"
    ></script>
    <script defer type="module">
      import {getStream,Stream} from './script.mjs'
      // get the id parameter from the url link for the manifestUri
      let params = new URL(document.location).searchParams;
      let streamId = parseInt(params.get('id'));
      

      function initApp() {
        shaka.polyfill.installAll();

        if (shaka.Player.isBrowserSupported()) {
          initPlayer();
        } else {
          console.error('Browser not supported!');
        }
      }

      async function initPlayer() {
        const video = document.getElementById('video');
        const player = new shaka.Player(video);

        window.player = player;

        player.addEventListener('error', onErrorEvent);

        try {
          const stream = await getStream(streamId)

          // check the manifest, if empty means stream is not started
          if (stream.manifests.dash ===''){
            stream.on(Stream.STARTED, async ()=>{
              await player.load(stream.manifests.dash);
            })
          } else {
            // not working on iOS, Dash is not supported in iOS. Use HLS instead in iOS
            await player.load(stream.manifests.dash);
          }

          console.log('The video has now been loaded!');
        } catch (e) {
          onError(e);
        }
      }

      function onErrorEvent(event) {
        onError(event.detail);
      }

      function onError(error) {
        console.error('Error code', error.code, 'object', error);
      }

      document.addEventListener('DOMContentLoaded', initApp);
    </script>
  </head>
  <body>
    <h1 class="text-center text-[28px] font-bold my-2">Watch Live Stream</h1>
    <hr />
    <div class="flex justify-center items-center">
      <video
        autoplay
        muted
        controls
        playsinline
        id="video"
        class="w-3/4 border rounded-xl my-4"
      ></video>
    </div>
  </body>
</html>
```

As you can see, we only import `getStream()` function from `script.mjs` because we use it to get the stream instance that we can use to get the adaptive media stream manifests for both HLS and Dash format.

Once we have the manifests, we play the video by load the manifest into Shaka player. Then the video should automatically play because we have autoplay attribute in the video player.


## Summary

The tutorial above shows you how we use the SDK to create a live stream client where you can capture video and audio from your browser and send it for live streaming using WebRTC. The tutorial is only applied for web application, but using the basic WebRTC as explain in this[WebRTC tutorial](../app-with-webrtc/index.md) you can easily build a live streaming client for Android or iOS by use directly our API endpoints for WebRTC connection.

Let us knows if you have any question by posting your question to our [Github Discussion](https://github.com/orgs/inlivedev/discussions/categories/q-a).