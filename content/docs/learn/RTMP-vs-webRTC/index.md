---
date: 2022-05-31
lastmod: 2023-08-02
name: choosing-rtmp-vs-webrtc
title: Choosing RTMP vs WebRTC
description: Inlive uses WebRTC which supports video ingestion on all platforms including web, has better latency than RTMP, and can be used to build your own OBS client.
ogimage: /images/docs/og-image.png
slug: rtmp-vs-webrtc
menu:
  docs_sidebar:
    identifier: choosing-rtmp-vs-webrtc
    name: Choosing RTMP vs WebRTC
    parent: learn
    weight: 1
---

# WebRTC vs RTMP Video Ingestion
Talking about video ingestion for live streaming, the most common ingestion video use is [RTMP](https://wowza.medium.com/rtmp-streaming-the-real-time-messaging-protocol-explained-3306cfae5474). This has been a default option for video ingestion for most live streaming platforms out there. The reason is a common way to do live streaming these days is by using [OBS](https://obsproject.com/) live streaming client that is able to produce a professional-quality live streaming video. And by default RTMP is the only way to ingest video with OBS.

## Why WebRTC?
[WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) is a popular protocol if we’re talking about online communication apps like Google Meet or Zoom. It’s a web standard API that is supported on all platforms, not only on all modern browsers but also on native platforms like Android and iOS. This is the main reason why we choose WebRTC as the video ingestion protocol for our live streaming APIs. It’s because it works everywhere including the web. RTMP can’t be used with the web, and we saw web is really important if we’re talking about applications.

## When to use WebRTC or RTMP?
Another main difference between WebRTC and RTMP besides RTMP doesn’t work on the web is the network protocol. WebRTC is by default based on [UDP](https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/), which means it’s for better latency, not quality. WebRTC could use [TCP](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/) protocol as well, but it will need some settings. Read more why WebRTC is better with UDP than TCP in [this article](https://bloggeek.me/why-you-should-prefer-udp-over-tcp-for-your-webrtc-sessions/). RTMP is based on TCP means it’s based on quality, not latency. With that, choosing WebRTC or RTMP should be based on the use case you’re developing.

If you’re building live streaming that required a good quality, for example, a live event that required a broadcast-quality video like music concerts, or conferences, then RTMP is a must choice. Because you can guarantee a better quality compared with WebRTC. But if you don’t need a broadcast-quality video, then WebRTC should be your choice because it will give you a better latency. And latency is always important for all live streaming use cases.

## WebRTC on the web
As we mentioned before the main reason we choose WebRTC for our live streaming APIs is because it works everywhere including the web. But why the web is important for us? Because we think, if we’re talking about developing an application, the web is the simplest way to let the user use our application. They can just open our URL and they can go live streaming directly from their browser without installing anything.

You might be thinking the web is not as capable as OBS as a streaming client that allows the video to be filtered or modified on the fly before ingesting it to the streaming server. For example, you want to stack multiple layers of videos, one is your camera that captures your face, and another one is the screen capture that captures your screen. This is possible to build on the web, and the user doesn’t need to install anything to use this feature. You only need to develop a streaming client with your JavaScript skills to do this. You can capture each video frame with [requestVideoFrameCallback()](https://web.dev/requestvideoframecallback-rvfc/) API, put it in canvas, and render it as a video with [HTMLCanvasElement.captureStream()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) that you can use as a video stream that you can send through WebRTC with our APIs. With this, you can build your own simple OBS client.

Check our [tutorial](/docs/tutorials/live-stream-api/tutorial-app-with-webrtc/) about developing a WebRTC broadcast client on the web using our live streaming API.