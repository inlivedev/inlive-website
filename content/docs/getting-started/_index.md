---
date: 2023-08-02
lastmod: 2023-08-02
name: getting-started
title: Getting Started
description: Getting started with inLive
ogimage: /images/docs/og-image.png
slug: getting-started
menu:
  docs_sidebar:
    identifier: getting-started
    name: Getting Started
    weight: 2
---

# Getting Started with inLive

To start developing your app with inLive, you need to choose the API that fits your use case. This document will help you select the most suitable API.

As mentioned in the introduction, we offer 2 products out of the 3 we plan to build:

1. **Single Input Live Streaming API**: Allows you to create a live stream and let others watch with up to 2-second latency. This is based on HLS/Dash technology, which allows you to utilize existing CDN infrastructure to deliver the video stream to millions of viewers.
2. **Multi Input Live Streaming API**: Enables you to create a live stream and invite others to join with less than 300ms latency. This is based on WebRTC Selective Forwarder Unit (SFU) technology, allowing you to develop real-time interactive apps like Google Meet or Zoom.
3. **Video Hosting API** (still in the design phase): Allows you to upload a video, and the API will convert it to an optimal stream format and store it in the cloud. This will enable you to develop a video-on-demand app like YouTube or Netflix.

From the products above, we can categorize the APIs into 2 categories:
1. Live video
2. Video on demand

We will only cover the live video use case for now, and we will address the video on demand use case in the future when it's ready.

## Live Video Use Cases
To help you choose the API that will fit your use case, see this comparison:

### Live Stream API - Single Input Live Streaming API
Use the single input live streaming API if these conditions are met:

1. You aim to build a single-host live streaming app, where you only need to stream from one host and let others watch. Examples of this use case include live streaming apps like YouTube Live or Twitch, live shopping apps, or live event apps.
2. A latency of 2 seconds is acceptable for your use case.
3. It's easy to embed everywhere using any HLS/Dash video players. You can embed the live stream on your website, mobile app, or even on your social media.
4. You want to live stream an offline event like a concert, sports match, or conference where the performers focus on offline interaction, but you want to scale the audience by live streaming it online.

### Real-time Communication API - Multiple Inputs and Real-time API
Use the multiple inputs real-time API if these conditions are met:
1. You want to develop real-time interaction between the host and the audience. Examples of this use case include a video call app, webinar app, or Google Meet/Zoom-like app.
2. There will be multiple hosts or video inputs in the same live stream. Examples of this use case include a webinar app with multiple speakers or a video call app with multiple participants.

Based on the comparison above, you can choose the API that fits your use case. Get started with the API of your choice by following the link below: