---
date: 2022-06-09
lastmod: 2022-06-09
name: Subscribe to channel server
title: Subscribe to channel server
description: This is an explaination on how to subscribe to channel server.
slug: subscribe-to-channel-server
weight: 3001
menu:
  docs_sidebar:
    identifier: Subscribe to channel server
    name: Subscribe to channel server
    weight: 3001
    parent: Real-Time Widget API
draft: true
---
# How to subscribe to our Channel Server using SSE

To use our Real-Time Widget API, you need to create a simple SSE client to subscribe to a channel server.

Our channel server works by sending JSON messages to clients using SSE (Server sent events). SSE, as the name suggests, can only act as a medium for messages that are sent from the server to the client. Sending messages to the channel server (i.e., broadcasting messages) is not possible through SSE.

 This article will focus on how to subscribe to our channel server using SSE to **receive messages** from our channel server and explain how to create a simple SSE client in the browser as an example. Sending messages to our channel server will be explained in detail in a different section.


## Subscribing to Channel Server

Every channel in our Channel Server is tied into a single stream. Every currently running stream will have a channel that can be subscribed to. So to subscribe to a stream’s channel you must first create and run a stream first. A stream that is not currently running won’t have a channel that is able to be subscribed to. So **make sure that you have created a stream and make the stream live** before trying to subscribe to a channel using SSE.


### Creating Simple Frontend Web Page to Subscribe to an Event Source

Let’s try to create a simple webpage that listens to SSE messages and list them. First, let’s create the html document. You can do this locally by creating a file or using online sandboxes like [JSFiddle](https://jsfiddle.net/). Let’s create a simple ordered list as the container of our messages.


```html
<html>
  <h1>Test SSE</h1>
  <ul id="list"></ul>
</html>
```


Then, using Javascript, let’s subscribe to the channel using the [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) web API. The EventSource endpoint URL that we will use to subscribe to the channel is `/subscribe/{streamId}`


```js
const evtSource = new EventSource("https://channel.inlive.app/subscribe/1")
```


In the code above, we subscribed to the channel of a stream with streamID `1`. Change the streamID to the stream that you want to subscribe to. Ensure that the stream exists and is running.

> Please note that you should only subscribe to the channel once and there can only be one instance of EventSource used. We don’t recommend you to call or hit the subscribe endpoint above using EventSource web API multiple times because you will send multiple subscription requests to the same channel which makes it inefficient.

### Displaying The Message from The Event Source

Now, let’s try to process the messages that are sent from the channel server by adding it into the list that we’ve created.


```js
evtSource.onmessage = function(event) {
  const newElement = document.createElement("li");
  const eventList = document.getElementById("list");

  console.log(event)

  newElement.textContent = "message: " + event.data;
  eventList.appendChild(newElement);
}
```


In the code above we will append every new message from the channel server to the list. You can now run the code and see what happens.

If you’re successful at connecting to the server, you’ll see that the server will immediately send a message to you, the message will be similar to this:


```js
{
  "stream_id": "1",
  "author_id": "0",
  "to_user_id": "c6769e47-8c01-470f-bed6-f66b34bfa62b",
  "message": {
    "token": "qLfUhhqP77R3lthCj82awiA3uONa-mwv65l2GDo8doY=",
    "user_id": "c6769e47-8c01-470f-bed6-f66b34bfa62b",
    "viewer_count": 1
  },
  "timestamp": 0,
  "type": "init",
  "widget_key": ""
}
```


The message is in the format of our communication scheme, for now, let’s just take note of the **message** field and the **type** field. The **type** field indicates that this message is of the **init** type which is a message that’s sent to supply the initial credentials that the client may need when connected to the channel server. You can read more about these types in the [communication scheme section](/docs/real-time-widget-api/communication-scheme-and-formatting/) below. These credentials will be stored in the **message** field, in which the message’s main payload will be stored.

There are two credentials provided in the message, **user_id** and **token**.**user_id** contains the client’s unique ID in the channel, this will be used to identify and differentiate the clients. The other one is called **token**, which is, as the name suggests, a token that you send to the channel server for authentication. This token will be used when you’re trying to send a message to the channel server, this will be covered in detail in the next document.

Another thing provided in the message is `viewer_count` data which holds the total number of online viewers that are connected to the specific channel. The viewer_count data is not only provided on the `init` type message. It will also be provided in the `system` type message which is always sent to the client whenever there is a user that joins or leaves the channel.

Good, now you are successfully connected to the channel server, let’s try to broadcast and see other messages in the next tutorial.
