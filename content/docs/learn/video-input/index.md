---
date: 2022-03-11
lastmod: 2023-08-02
name: video-input
title: Video Input
description: We will learn the difference between WebRTC and RTMP as the two popular live video input protocols
ogimage: /images/docs/og-image.png
slug: video-input
menu:
  docs_sidebar:
    identifier: video-input
    name: Video Input
    parent: learn
    weight: 2
---

# Video Input
WebRTC (Web Real Time Communication) and RTMP (Real-Time Messaging Protocol) are two popular live video input protocols which enable live video streaming over the internet. This page will explain the difference between these two and how you can choose which input protocol that fits your case.

## WebRTC
WebRTC is a web standard protocol for video communication that is used by Google Meet. It's a UDP-based network transport by default which is known to reduce latency, but we still can make it work through TCP if needed. The better latency is the main reason why we focus on WebRTC input instead of the RTMP which is already standard input in the live streaming app. Another reason is WebRTC can work everywhere including in the browser, something that RTMP can't do. With this, we can build a live streaming broadcaster app like OBS but on the web. No need to install anything.

So if you want to build a live streaming app that can capture the camera on all platforms, not only in the mobile apps but also on the web, then WebRTC is your choice. Check out [our tutorial](/docs/tutorials/live-stream-api/tutorial-app-with-webrtc/) on how to capture a camera on the web and send it as a video stream input. For mobiles, there are some tutorials and examples that you can use as well.


## RTMP
RTMP is the most popular standard protocol for live streaming. It was used by Adobe Flash to stream the video from the server to a Flash player. But now RTMP is mostly known as a video input standard for YouTube, Twitch, and other live stream services. The main issue with RTMP is it's not supporting the web. So we can't build a broadcaster client on the web and use it as video stream input like WebRTC can do. And compared with WebRTC, RTMP is using TCP as their network transport. It's more reliable because TCP can guarantee all the network packets will be received by the server.

## Conclusion
WebRTC and RTMP can be used as a video input protocol for our live stream, but which one you should use? It depends. The main difference between WebRTC and RTMP is the network transport protocol. WebRTC has better latency but can't guarantee reliability, which means you might have better latency but you probably will see some glitch in the video when the broadcaster host internet network is not that good.

If you're hosting a live stream that doesn't need interactivity, like a live concert, sports event, or any one-way broadcasting where the quality of the video is important and that broadcast usually can be seen on TV as well, then you probably want to use RTMP because it will have a better video quality of the live stream. But if you're hosting an interactive live stream, like a live shopping, trivia quiz, online bidding, or any live stream where the low latency is a must, then WebRTC will be a good option.

Another consideration is the platform support, if you're thinking to have a broadcaster feature on all platforms including the web, then WebRTC is the only way. RTMP can't be used on a browser, only on native mobile platforms like Android and iOS. Let us know if you still need more insights on which video input to choose.
