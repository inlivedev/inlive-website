---
date: 2022-03-11
lastmod: 2023-08-02
name: video-input
title: Video Input
description: Inlive supports 2 ways to sending the video source input to our encoder. You can use either WebRTC or RTMP.
ogimage: /images/docs/og-image.png
slug: video-input
menu:
  docs_sidebar:
    identifier: video-input
    parent: learn
    weight: 2
pagination:
  prev:
    text: Choosing RTMP vs WebRTC
    link: /docs/learn/rtmp-vs-webrtc/
  next:
    text: Playing Video with HLS and MPEG-DASH
    link: /docs/learn/playing-video-with-hls-and-mpeg-dash/
---

# Video Input
Inlive is support 2 ways to send the video source input to our encoder. You can use either [WebRTC](https://webrtc.org/)(Web Real Time Communication) or RTMP(Real-Time Messaging Protocol - coming soon). This page will explain the difference between these two and how you can choose which input method fits your case.

## WebRTC
WebRTC is a web standard protocol for video communication that is used by Google Meet. It's a UDP-based network transport by default which is known to reduce latency, but we still can make it work through TCP if needed. The better latency is the main reason why we focus on WebRTC input first instead of the RTMP that is already standard input in the live streaming app. Another reason is WebRTC can work everywhere including in the browser, something that RTMP can't do. With this, we can build a live streaming broadcaster app like OBS but on the web. No need to install anything.

So if you want to build a live streaming app that can capture the camera on all platforms, not only in the mobile apps but also on the web, then WebRTC is your choice. Check out [our tutorial](/docs/tutorials/live-stream-api/tutorial-app-with-webrtc/) on how to capture a camera on the web and send it as a video stream input. For mobiles, there are some tutorials and examples that you can use as well.


## RTMP
RTMP is the most popular standard protocol for live streaming. It was used by Adobe Flash to stream the video from the server to a Flash player. But now RTMP is mostly known as a video input standard for YouTube, Twitch, and other live stream services. The main issue with RTMP is it's not supporting the web. So we can't build a broadcaster client on the web and use it as video stream input like WebRTC can do. And compared with WebRTC, RTMP is using TCP as their network transport. It's more reliable because TCP can guarantee all the network packets will be received by the server.

## Conclusion
WebRTC and RTMP can be used as a video input protocol for our live stream, but which one you should use? It depends. The main difference between WebRTC and RTMP is the network transport protocol. WebRTC has better latency but can't guarantee reliability, which means you might have better latency but you probably will see some glitch in the video when the broadcaster host internet network is not that good.

If you're hosting a live stream that doesn't need interactivity, like a live concert, sports event, or any one-way broadcasting where the quality of the video is important and that broadcast usually can be seen on TV as well, then you probably want to use RTMP because it will have a better video quality of the live stream. But if you're hosting an interactive live stream, like a live shopping, trivia quiz, online bidding, or any live stream where the low latency is a must, then WebRTC will be a good option.

Another consideration is the platform support, if you're thinking to have a broadcaster feature on all platforms including the web, then WebRTC is the only way. RTMP can't be used on a browser, only on native mobile platforms like Android and iOS. Let us know if you still need more insights on which video input to choose.
