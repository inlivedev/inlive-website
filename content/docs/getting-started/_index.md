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

# Getting started with inLive

To start develop your app with inLive, you need to choose which API that fit with your usecase. This document will help you to choose which API that fit with your usecase.

As explained before in the introduction, we have 2 products that you can use from total 3 products that we planned to build.

1. Single input live streaming API that allows you to create a live stream and let others to watch with up to 2 second latency. This is based on CDN and HLS/Dash technology, which allow you to utilize the existing CDN infrastructure to deliver the video stream to million of viewers.
2. Multi input live streaming API, where you can create a live stream and invite others to join with less than 500ms latency. This is based on WebRTC Selective Forwarder Unit (SFU)technology, which allow you to develop a real-time interactive app like Google Meet or Zoom.
3. Video hosting API(still in design phase) that allows you to upload a video and the API will convert it to an optimal stream format, and store it in the cloud. This will allow you to develop a video on demand app like Youtube or Netflix.

From the product above, we can categorize the API into 2 categories:
1. Live video
2. Video on demand

We will only cover live video use case for now, and we will cover video on demand use case in the future when it's ready.

## Live video use cases
To help you choose which API that will fit with your use case, see these comparison:

### Live Stream API - Single Input Live Streaming API
Use single input live streaming API if these condition is met:

1. You like to build a single host live streaming app, where you only need to stream from one host and let others to watch, you can use our single input live streaming API. Example of this usecase is a live streaming app like Youtube Live or Twitch, live shopping app, or live event app.
2. A latency of 2 seconds is acceptable for your use case.
3. You want to be very cost efficient. This API estimated will cost you 1/5 of the cost of multi input live streaming API.
4. You want to live stream an offline event like concert, sport match, or conference where the performers are focus on offline interaction but you want to scale the audience by live streaming it online.

### Hub API - Multi Input Live Streaming API
Use multi input live streaming API if these condition is met:
1. You want to develop a real-time interaction between the host and the audiences. Example of this usecase is a video call app, webinar app, or Google Meet/Zoom-like app.
2. There will be multiple hosts or video inputs in the same live stream.
3. You're okay with the cost is 5x more expensive than single input live streaming API. We're working to reduce the cost in the future.

Based on the comparison above you can choose which API that fit with your use case. Get started with the API that you choose by open the link below: