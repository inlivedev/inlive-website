---
date: 2022-03-08
lastmod: 2022-03-08
name: Getting Started
title: Getting Started
description: To start developing with Inlive, you will need three simple steps to integrate inlive with your app.
slug: getting-started
weight: 2000
menu:
  docs_sidebar:
    identifier: Getting Started
    name: Getting Started
    weight: 2000
---
# Get Started
To start developing with Inlive, you will need three simple steps to integrate inlive with your app.

## Get an application key
To allow your app to access the Inlive APIs, you need an application key. This API key is unique per application, and you will need to use it will all your API request. Follow these steps to create your application key:
1. Register <a href="{{< getenv env=`_HUGO_INLIVE_STUDIO_ORIGIN` >}}" target="_blank" rel="noopener noreferrer" data-tracking-event="open-link" data-tracking-label="Register an account link">an Inlive account</a>.
2. Go to <a href="{{< getenv env=`_HUGO_INLIVE_STUDIO_ORIGIN` >}}/settings/integration/" target="_blank" rel="noopener noreferrer" data-tracking-event="open-link" data-tracking-label="Integration page link">the integration page</a>.
3. Create an application key. Make sure you copy the key after you create it because you won't be able to see it again later.

## Use Inlive APIs
After having your application key, you will need to use your application key as a bearer token to authenticate all your API requests. We use a standard HTTP REST API, so you can use any library to help you make an HTTP request like Axios, CURL, or just a simple fetch function.

### REST API Endpoints
Check out our <a href="{{< getenv env=`_HUGO_INLIVE_API_ORIGIN` >}}/apidocs/" target="_blank" rel="noopener noreferrer" data-tracking-event="open-link" data-tracking-label="REST API endpoint documentation link">REST API Endpoint documentation</a> to see all the available endpoints. We have a mix of HTTP methods and URL combinations to build our API endpoints, so you can use the same URL endpoint for different purposes depending on the HTTP method you use.

### Inlive SDK
Use our SDK to simplify your development. Currently our SDK only available in JavaScript. Let us know the platform that we must support for our SDK by requesting it through our [Github Discussion](https://github.com/orgs/inlivedev/discussions).

With our SDK, going live is simple as this code below:

```js
import {InliveStream, InliveApp} from '@inlivedev/inlive-js-sdk'

const app = InliveApp.init({apiKey:'<your-api-key>'})
const stream = InliveStream.createStream(app,{name:'my first stream'})

const media = await InliveStream.media.getUserMedia()
media.attachTo(document.querySelector('video'))

await stream.prepare()
await stream.init(media.stream)
await stream.start()

// or use getStream for viewer client
const stream = InliveStream.getStream(app,streamID)

console.log(stream.manifests)
// {
//   "hls": "master.m8eu"
//   "dash":"manifest.mpd"
// }

```

Check out our [tutorial with SDK](../tutorial/app-with-sdk/index.md) for more details.

## API Authentication
You can use the application key as a bearer token for an authenticated request. Below is an example of making authenticated requests to get all the streams you have created with the same application key with Fetch API.

``` js
const request = await fetch('https://api.inlive.app/v1/streams',{
    method: 'GET',
    mode: 'cors', // no-cors, *cors, same-origin,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${applicationKey}` //your application key variable
    }
  });

const streams = await request.json();
```

Check [other endpoints](https://api.inlive.app/apidocs) to know the HTTP method, body, or URL parameters used to make different API requests. 

With our SDK, you only need to pass the application key to `InliveApp.init()` like this:

```js
const app = InliveApp.init({apiKey: applicationKey}) //your application key variable
const stream = InliveStream.createStream(app,{name:'my first stream'})
```



## Capture and stream the video
To create a live streaming video, the video need to be captured from the camera or you can also stream it from a file. Depend on your case. But once you get the video stream, you need to send the video stream to our server in order to process it and publish it as a live video streaming.

Check out [our WebRTC tutorial](/docs/tutorial/tutorial-app-with-webrtc/#3-capture-the-video) to understand how to capture the video from your device camera and send it to our platform.

## Play or embed the video
When you send the video source input through WebRTC or RTMP protocol, the Inlive live stream encoder will start the live streaming, and you can play or embed the live video to your app. Inlive is producing a live video stream in two standard formats:
- Low latency Dash(LL-Dash), with ~3 seconds playback latency
- HLS with ~7 seconds playback latency.

_We still working on the latency because it involve not only our side but also on the video player part. We're working on a guideline how to achieve the target latency above._

You can choose which format you want to use if you're using your own or an open-source video player. But if you use our embedded HTML player, the player will automatically use low latency Dash if your browser is supported but will fall back to HLS format if not.

Check the [play video section in our complete tutorial](/docs/tutorial/tutorial-app-with-webrtc/#6-get-the-video) on using Inlive APIs to get the video and play it in your app.