---
# Refer to the themes/inlive/archetypes/README.md
date: 2023-08-02
lastmod: 2023-08-02
title: Open sourcing our inLive Hub SFU
description: Release of open source inLive Hub SFU
ogimage: /blog/how-sfu-works-developing-webrtc-sfu-part-1/images/sfu.png
slug: open-source-inlive-hub-sfu
summary: Release of open source inLive Hub SFU, why we open source our SFU, and what you can do with our SFU
---

# inLive Hub SFU - A Golang WebRTC SFU library

![Selective Forwarder Unit(SFU)](/blog/how-sfu-works-developing-webrtc-sfu-part-1/images/sfu.png "Selective Forwarder Unit(SFU)")

[https://github.com/inlivedev/sfu](https://github.com/inlivedev/sfu)

When we're exploring  Golang open source SFU out there for our inLive Hub product, we saw the current best option LiveKit and ion-SFU is not fit for our use case. Livekit is amazing open source SFU server solution, we learned a lot from them, but we're looking a library instead of a full server.  Ion-SFU also stil not useable for our use case, especially with our needs to extend a functionality of SFU without change the code. So we decided to build our own SFU from scratch with the goal to have a portability like ion-SFU but easy to extend it's functionality using the same WebRTC library that they use, Pion WebRTC. 

We've been using Pion WebRTC since our first product live streaming API. And we enjoy using it because the library is giving us the flexibility to customize the WebRTC stack to fit our use case. We saw the SFU is a common use case for WebRTC, but Golang still lack of open source SFU library that portable enough and giving the same flexibility like we get from Pion WebRTC. Because of that and our love with open source, we decided to [open source our SFU library](https://github.com/inlivedev/sfu) to help other developer to build their own SFU server.

### Why is it matter for you?
With this open source library, you can build your own custom SFU server that fit with any usecase you have. We also receive some request about self hosting  SFU server from our potential customers. With this open source library, we able to help them without forcing them to use our cloud service. We also looking a way to connect this library with our cloud service to make it easier to scale the SFU server. 

### What is inLive Hub SFU?
inLive Hub is our second product after our first [live streaming API, a WebRTC to HLS/Dash infrastructure as a service](https://inlive.app/live-streaming). We started the inLive Hub because there is a demand for multi host live streaming, where is not supported by our first product. With inLive Hub, you can build a live streaming with multi host, and broadcast it other participants in verly low latency compare with HLS/Dash live streaming. The Inlive Hub SFU is a component of inLive Hub that responsible to route the media stream from one peer to another peer in the same group. This component is the core of inLive Hub, and to accelerate it's development we decided to open source it to get more feedbacks from the community.

### How to try it?
To try it we have [the example web app using websocket](https://github.com/inlivedev/sfu/tree/main/examples/http-websocket) for your reference. It is a basic example to show you how to create a group call app using inLive Hub SFU. Check also [the README](https://github.com/inlivedev/sfu/blob/main/README.md) in the repository for more detail about this library.

We also have a [ready to use API called inLive Hub](/realtime-interactive) that you can use without need to run your own server. We will release the API, documentation, and example app next week. Check [the landing page](/realtime-interactive) for more information.

### Current features
For now we only support the basic SFU features like:
- Multi group, a possibility to create multi room for different group of peers.
- Group call, where all peers in the same group can send and receive media stream to each other.
- Perfect negotiation, enable to add additional track in the middle of the session like screen sharing.


### What's next?
We will continue to improve the library to make it production ready. Our main priorities to to have a good experiences for group call and enable automation for data and event. For that, in the next few months we will focus on the following features:
- simulcast to enable multi bitrate streaming for smooth video quality in any network condition.
- data channel for data communication
- real-time event for automation
- statistic API for analytics

### Contributing
We're open for any feedback and contribution. But since [this library](https://github.com/inlivedev/sfu) is currently develop focusing on [inLive Hub product](/realtime-interactive), we will prioritize the feature that we need for our product. Let us know your feedback and feature request by creating an issue [in the repository](https://github.com/inlivedev/sfu). 
