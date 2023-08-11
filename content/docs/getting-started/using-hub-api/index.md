---
date: 2023-08-02
lastmod: 2023-08-02
name: using-hub-api
title: Using Hub API
description:
ogimage: /images/docs/og-image.png
slug: using-hub-api
menu:
  docs_sidebar:
    identifier: using-hub-api
    name: Using Hub API
    parent: getting-started
    weight: 2
---

# Using Hub API

Learn how to use and integrate the Hub API into your application

## About Hub API

The Hub API provides ways to enable real-time online interactions between multiple hosts and participants inside a room. It is built on top of WebRTC SFU (Selective Forwarding Unit) technology which will route the media stream from one peer to another peer in the same group with very low latency.

The current Hub API supports the basic features such as:
- Multi group, a possibility to create multi room for different group of peers.
- Group call, where all peers in the same group can send and receive media stream to each other.
- Real-time signaling channel, that enables client to receive an event from the channel server in a real-time.
- Perfect negotiation, enable to add additional track in the middle of the session such as screen sharing track.

## Making a request

The Hub API can be accessed from `https://hub.inlive.app`. To make a request for a specific feature, you need to identify the specific API endpoint you want to use and provide any requirements that the endpoint may require. You can check our list of Hub API endpoints within our [API reference docs](https://hub.inlive.app/apidocs/index.html).

### Your first room

You can start by making your first request to the create a room endpoint. Basically this endpoint will create a new room and returns a JSON response data about the new room. Using `curl` command, we can run and trigger our first request using HTTP `POST` method.

```bash
curl --request POST \
  https://hub.inlive.app/v1/rooms/create \
  --header 'Content-Type: application/json' \
  --data '{ "name": "My room" }'
```

### Get the room data

When the room is successfully created, you will receive a room `id` data which you can use it to run some available actions in the room. For example, you can get the data of the new room you just created by using the the room ID with this command.

```bash
curl --request GET \
  https://hub.inlive.app/v1/rooms/<YOUR_ROOM_ID>
```

## Resources

- Read the [Hub API reference docs](https://hub.inlive.app/apidocs/index.html)
- Read an [example tutorial about developing a conference app](/docs/tutorials/hub-api/conference-app-with-hub-api/) using Hub API.
- Check out the [code example in GitHub](https://github.com/inlivedev/inlivedev.github.io/tree/main/examples/)
- Explore our open source [Hub SFU library in GitHub](https://github.com/inlivedev/sfu)