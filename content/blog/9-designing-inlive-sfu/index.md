---
# Refer to the themes/inlive/archetypes/README.md
date: 2023-06-14
lastmod: 2023-06-14
title: Designing inLive Hub, an automated and extendable WebRTC SFU(Selective Forwarding Unit)
description: How we design the inlive SFU to be unique and different from other SFU. 
slug: designing-inlive-sfu
summary: There are many SFU out there, but we saw they're still lack of automation and data driven to develop a new real time interactive app beyond video conference. We want to build a SFU that can be used for any real time app, not just video conference.
---

# Designing inLive Hub

During pandemic, we saw a lot of WebRTC SFU(Selective Forwarding Unit) API developed and released to the market. Most of them focus on the conference app usecase where a participant will join into a room and interact with the other participants in the room. Basically the API will help you develop a Zoom/Google Meet like app. But a real time interactive app is beyond conference app. We want to build a SFU that can be used for any real-time use cases, not just video conference. To be able to do that, we want to focus on automation and data driven SFU.

When we're decided to work on SFU, these are some of the usecases that we have in mind:
- Call center, a single button in the app that will connect you to the agent. The agent will be able to see you and talk to you. The agent will be able to share their screen to you. The agent will be able to invite another agent to join the call.
- AI conversation, allowing an AI bot to join the room and interact to the other participants in the room. The AI bot will be able to see and hear the other participants in the room, even to have conversation or responds questions from the participants.
- Monitoring and surveillance automation, a camera that will automatically detect a specific object and notify if needed. 
- A possibility to relay the video stream to another server for further processing. For example, you can relay the video stream to a server that will do the face recognition and send the result back to the SFU. The SFU will then relay the result to the client. The server should be close enough to the SFU to minimize the latency.
- PBX replacement for enterprise, an app that will connect you to the other person in the company. The app will be able to do the call forwarding, call transfer, call waiting, etc.

## The basic features
When we're thinking about those use case, then what we have in mind is our V1 SFU should be able to do the following:
- A basic feature SFU should be able to connect to any client that support WebRTC into a room where they can interact with the other clients by publishing and subscribing to the audio/video stream.
- The room also should support exchanging data between the clients in the room. The data can be anything, like a text message, a file, or even a binary data.
- The SFU should be able to trigger events on any activities related to the room, like when a new client join the room, when a client leave the room, when a client publish a new stream, when a client stop publishing a stream, when a client subscribe to a stream, when a client unsubscribe to a stream, etc.
- The SFU should provide any possible data through real-time API that can be tracked and used by the app developer to build their app. For example, the API should provide the list of the clients in the room, the list of the streams in the room, participants data like duration of connected

## Our vision
Our vision with this inLive Hub is to empower all developers to build the next generation interactive app, beyond video conference. For that, we are believe that an accesible platform that affordable but provide the best developer experiences is the key to achieve our vision. We will start by focusing on the automation, and extensibility of the SFU.

### Automate your real time interactive app
To enable the automation, data and events are the main ingridients. To allow developers develop an automation easily, all the data and events will be available through API, webhook, and server sent event(SSE). The app developer can choose how to use those data and events to build their automation in realtime.

When the goal is automation, the event and data driven is not enough. Processing those events and data, including the media streams, should be automated as well. The main challenge will be the latency when pre processing the media streams, there are two possible caused of the latency:
- The SFU and the pre processing server are not close enough. The SFU should be able to relay the media stream to the pre processing server with the lowest latency possible.
- The processing time in the pre processing server. This is something that hard to control, but we can try to minimize the processing time by using the right hardware and software.

To minize the latency,  we're thinking the SFU should be extensible. It should allow us to add the pre or post processing server to the SFU easily by using the same API that the peer client use to join the room. Just like a proxy, just change the origin or URL and all request with relayed to the pre or post processing server.

### Extend the capability with pre and post processing
Imagine possibility of calling this WHIP endpoint when ingesting a video stream:
```
https://api.inlive.app/hub/v1/room/<room-id>/<client-id>/object-detection/whip
```
Your video stream will be relayed to the pre processing server, the pre processing server will do the object detection and send the result back to the SFU. The SFU will then broadcast the result to the client. The latency should be low enough to make the conversation still natural.

Or to get the live transcription the audio stream in the room, you can call this endpoint
```
https://api.inlive.app/hub/v1/room/<room-id>/transcription
```
Which will return a Server Sent Event(SSE) stream that will send the transcription result in real time, or a full transcript when the room session is ended. Behind the screen the SFU will relay the audio stream to the pre processing server, the pre processing server will do the transcription before send it to the client through  SSE. When the transcription can be done in real time, you can build a live captioning app, or an AI assistent that will respond to a command like "Hey Google" or "Hey Siri".

By having a standard way to plug in the pre and post processing server, everyone can easily extend the functionality of this SFU. Combining with the real-time data and events, we can build a real time communication app that can be customize and extend easily.


## Let us know what you think
The SFU already available for limited users. If you're a developer who is interesting with what we're building, you can join our waitlist here. We will keep you updated with our progress and you will be the first to try our SFU when it's ready.