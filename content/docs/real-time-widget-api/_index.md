---
date: 2022-06-09
lastmod: 2022-06-09
name: Real-Time Widget API
title: Real-Time Widget API
description: List of Inlive's real-time widget API that we created for you
slug: real-time-widget-api
weight: 3000
menu:
  docs_sidebar:
    identifier: Real-Time Widget API
    name: Real-Time Widget API
    weight: 3000
---
# About Inlive Widget
Here at Inlive, our mission is to unlock the interactivity beyond likes and comments. Our Real-Time Widget API allows you to save your time developing an interactive widget by providing a low-latency communication scheme.

> Real-Time Widget API will be ready in the 3rd quarter of this year. Register your interest [here](https://tally.so/r/wgD9aM) to discuss more with us and stay up-to-date with the development progress.

Real-Time Widget API works by exchanging messages between viewers and the streamer through a server that we call a “Channel Server”. This channel server functions to receive and send messages from and to appropriate users. These messages then will be processed by the client-side widget code to be processed and give the appropriate visual response to the users. With this simple building block, we have the capability to create varieties of widgets.

A widget will typically be divided into two different client-side code, one part is dedicated for streamers and the other for the viewers that are watching the stream. These two parts will communicate with each other to achieve a functional widget. This allows a high level of interactivity between streamers and viewers.

Our channel server also allows webhooks to be triggered by the messages. This allows for more complex functionalities that need communication to external third party services.

![widget diagram](/images/interactive-widget/widget-api-diagram.png)