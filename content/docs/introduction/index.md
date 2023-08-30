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
    name: Introduction
    weight: 1
---
# Introduction
## Why
We started Inlive because when we need to develop a video live streaming app, we figure out it's hard to scale and the cost is very expensive. The infrastructure cost make the end user cost too expensive for who are live in developing countries. The pricing model also not fair, instead of based on the cost structure like bandwidth and server usage, most of the solution will cost you per viewer. Thinking this from the business perspective, it's hard to figure out how to monetize the app if the end user cost or price is too expensive.

We also saw that the COVID-19 pandemic is a transition point where we will see more and more people will work remotely and interact with each other online. We believe more online interaction will be invented in the future. And to create a new online interaction model, we need to have an easy to use video and real-time infrastructure that accesible for everyone especially for developers in developing countries.

## What is Inlive
Inlive is an infrastructure as a service(IaaS) that allows a developer to develop a live video capability in their web or app. We provide APIs to create a live stream, invite other to join, and let others to watch. We also provide a client SDK to make it easier to integrate with your web or app.

We currently have 2 products that you can use from total 3 products that we planned to build.
1. The first product is a single input live streaming API that allows you to create a live stream and let others to watch with up to 2 second latency. This is based on CDN and HLS/Dash technology, which allow you to utilize the existing CDN infrastructure to deliver the video stream to million of viewers.
2. The second product is a multi input live streaming API, where you can create a live stream and invite others to join with less than 500ms latency. This is based on WebRTC Selective Forwarder Unit (SFU)technology, which allow you to develop a real-time interactive app like Google Meet or Zoom.
3. The third product is still in design phase is a video hosting API that allows you to upload a video and the API will convert it to an optimal stream format, and store it in the cloud. This will allow you to develop a video on demand app like Youtube or Netflix.

## Use Inlive vs. build your own
### Easy to use and scale
A video live stream infrastructure can be costly and very complicated to set up because this involves many components to develop. The main challenges will be fine tuning the video quality, scalability, and cost. We designed our system to be cost efficient and easy to scale. Our pricing model also based on the actual cost factor like bandwidth and server usage, not based on the number of users or viewers.

### No upfront commitment and pay what you use
Setting up a server for a live stream will cost you upfront. It will need a high specification server to run a single live stream. And you might need to turn it on when you go live and turn it off manually after it ends if you want to save the cost. We designed our system to automate the server deployment when running a live video stream.

Our designed server deployment automation allows us to charge you only when used. You will pay what you use, and no commitment upfront.

## What you can do
These are some of the examples of what you can do with our APIs:
- Create an online class, webinar, or Google Meet/Zoom-like app
- Create a video based identity verification
- Create a voice/video call app
- Create a live streaming app like Youtube Live or Twitch
- Create an app based call center where the customer can call directly from their phone.