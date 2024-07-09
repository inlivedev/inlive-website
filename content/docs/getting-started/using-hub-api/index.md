---
date: 2023-08-02
lastmod: 2024-08-09
name: using-hub-api
title: Using the Hub API
description: Learn how to integrate the Hub API into your application for real-time online interactions.
ogimage: /images/docs/og-image.png
slug: using-hub-api
menu:
  docs_sidebar:
    identifier: using-hub-api
    name: Using the Hub API
    parent: getting-started
    weight: 2
---

# Using the Hub API

Learn how to use and integrate the Hub API into your application for enabling real-time online interactions.

## About the Hub API

The Hub API facilitates real-time online interactions between multiple hosts and participants within a room. It leverages WebRTC SFU (Selective Forwarding Unit) technology to efficiently route media streams among peers in the same group, ensuring very low latency.

The Hub API currently supports features such as:
- Multi-group capabilities, allowing the creation of multiple rooms for different groups of peers.
- Group calls, enabling all peers in the same group to send and receive media streams to and from each other.
- A real-time signaling channel, which allows clients to receive events from the channel server in real-time.
- Perfect negotiation, which allows the addition of extra tracks (e.g., for screen sharing) during an ongoing session.

## Making a Request

The Hub API is accessible at `https://hub.inlive.app`. To utilize a specific feature, identify the relevant API endpoint and provide the required parameters. Our [API reference documentation](https://hub.inlive.app/apidocs/index.html) lists all available Hub API endpoints.

## Authentication

Accessing the Hub API requires authenticating your request with an access token. This temporary token authenticates your API requests but expires after a set period. When your access token expires, you will need to generate a new one. For instructions on generating an access token, refer to our [API authentication guide](/docs/getting-started/api-auth/).

### Creating Your First Room

Begin by creating a room using the endpoint for room creation. This endpoint generates a new room and returns JSON data about it. The following `curl` command demonstrates how to create a room using the HTTP `POST` method.

```bash
curl -X 'POST' \
  'https://hub.inlive.app/v1/rooms/create' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <your-accesstoken-here>' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "My Room"
}'
```

### Retrieving Room Data

Upon successful room creation, you'll receive a room ID. This ID can be used to perform actions within the room, such as retrieving the room's data with the following command:

```bash
curl -X GET \
  'https://hub.inlive.app/v1/rooms/<YOUR_ROOM_ID>' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <your-accesstoken-here>'
```

### Publishing and Subscribing to Media Streams

With an active room, you can publish and subscribe to media streams. Whether you're publishing a single media stream for others to subscribe to or subscribing to streams from others depends on your use case.

For a detailed guide on publishing and subscribing to media streams, refer to our tutorial on [developing a conference app with the Hub API](/docs/tutorials/hub-api/conference-app-with-hub-api/).

## Resources

- Explore the [Hub API reference documentation](https://hub.inlive.app/apidocs/index.html).
- Follow an [example tutorial on developing a conference app](/docs/tutorials/hub-api/conference-app-with-hub-api/) with the Hub API.
- View [code examples on GitHub](https://github.com/inlivedev/inlivedev.github.io/tree/main/examples/).
- Discover our open-source [Inlive Hub SFU library on GitHub](https://github.com/inlivedev/sfu).
