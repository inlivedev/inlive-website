---
date: 2022-06-09
lastmod: 2022-06-09
name: Real Time Widget API
title: Real Time Widget API
description: List of Inlive's real time widget API that we created for you
slug: Real Time Widget API
weight: 3000
menu:
  docs_sidebar:
    identifier: Real Time Widget API
    name: Real Time Widget API
    weight: 3000
---
# About Real Time Widget API
Our channel server works by sending JSON messages to clients using SSE (Server sent events). SSE, as the name suggests, can only act as a medium for messages that are sent from the server to the client. Sending messages to the channel server (i.e., broadcasting messages) is not possible through SSE.