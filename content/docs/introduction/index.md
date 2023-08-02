---
date: 2022-03-08
lastmod: 2022-03-08
name: introduction
title: Introduction
description: Inlive is an infrastructure as a service that allows a developer to develop a live video capability in their web or app.
ogimage: /images/docs/og-image.png
slug: introduction
menu:
  docs_sidebar:
    identifier: introduction
    text: Introduction
    weight: 1
pagination:
  next:
    text: Using Live Stream API
    link: /docs/getting-started/live-stream-api/using-live-stream-api/
---
# Introduction
Inlive is an infrastructure as a service that allows a developer to develop a live video capability in their web or app. We provide APIs to create a live stream, send video input, and watch the live video. Developers can use our APIs without thinking about server requirements, scalability, and video hosting.

## Use Inlive vs. build your own
### Easy to use and scale
A video live stream infrastructure can be costly and very complicated to set up because this involves many components to develop. Ours is built with WebRTC and RTMP input to send video input either directly from a webcam or a professional video live stream client app like OBS. Usually, on the server, you will need a video encoder like FFMPEG, then you need to package the live video into a standard video live stream format like Dash or HLS. With Inlive, you don't need to learn about all of those. You only need to use our APIs and video player to embed the video into your app.

### No upfront commitment and pay what you use
Setting up a server for a live stream will cost you upfront. It will need a high specification server to run a single live stream. And you might need to turn it on when you go live and turn it off manually after it ends if you want to save the cost. We designed our system to automate the server deployment when running a live video stream.

Our designed server deployment automation allows us to charge you only when used. You will pay what you use, and no commitment upfront.

## What you can do
These are some of the examples of what you can do with our APIs:
Create a live video stream.
Send a video input with WebRTC or RTMP protocol.
Get a list of all created video live streams.
Get the HLS and Dash playlist manifest to use for any compatible video player.
Get an embedded video player code that you use directly on your website.
Get the live stream status in real-time when the stream starts or ends.