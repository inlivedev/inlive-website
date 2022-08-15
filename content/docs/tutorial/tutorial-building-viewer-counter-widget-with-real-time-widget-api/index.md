---
# Refer to the themes/inlive/archetypes/README.md
date: 2022-08-12
lastmod: 2022-08-12
name: Building viewer counter widget with Real-Time Widget API
title: How to build a simple viewer counter widget with real-time widget API
description: In this tutorial, we will walk you through the steps of building a simple viewer counter widget using inLive Real-Time Widget API.
slug: tutorial-building-viewer-counter-widget-with-real-time-widget-api
weight: 4004
menu:
  docs_sidebar:
    identifier: Building viewer counter widget with Real-Time Widget API
    name: Building viewer counter widget with Real-Time Widget API
    weight: 4004
    parent: Tutorial
---

# How to build a simple viewer counter widget with real-time widget API

## Introduction

In this tutorial, we will walk you through the steps of building a simple viewer counter using [inLive real-time widget API](/docs/real-time-widget-api/). InLive has provided a way to identify the total number of users actually connected to the specific stream by integrating the stream built with the inLive API to the server called inLive channel server. Think about this, you already built your streaming platform and you want to have a real-time counter that displays the total number of viewers connected to the specific stream. Yes, you can. We will build something similar to that in this tutorial.

You can see the full version of this tutorial’s code example [here](https://github.com/inlivedev/inlive-widget-examples/tree/main/viewer-counter) on GitHub.

## Prerequisites

To follow this tutorial, you need to have:
- An IDE/code editor like [Visual Studio Code](https://code.visualstudio.com).
- Some knowledge of HTML, and JavaScript languages.

## Set up real-time widget API

Before proceeding further, you must create an account in the [inLive Studio]({{< getenv env="_HUGO_INLIVE_STUDIO_ORIGIN" >}}) in order to use the real-time widget API. After the account is created, you need to **create a widget** and obtain the **widget key**, which will be used to communicate with the inLive channel server later. There is a tutorial that explains more about this process. You can read the tutorial [here](/docs/tutorial/tutorial-creating-and-managing-widget/).

## Set up the project

Let’s create a new folder to set up our project. Let’s give the folder name "**viewer-counter**" folder. Inside the viewer-counter folder, create a new folder called "**src**" folder. This src folder is where we put all the source code in this tutorial.

## Build the HTML template

We will start building the UI for our viewer counter using HTML. Create an **index.html** file and put the code below into the file. The code below will display a basic HTML template. You may notice there is a `<strong>` tag with "**viewer-counter**" ID. Inside the tag, we will update the value based on the value received from the API later.  By default, the text will be filled with a number of 0.

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <title>Viewer Counter Sample</title>
</head>
<body>
 <h1>Viewer Counter Sample</h1>
 <p>Number of online viewers on this page: <strong id="viewer-counter">0</strong></p>
</body>
</html>
```

## Subscribe to the channel server

After the HTML template is created, let’s continue to the next step which is adding the JavaScript logic to the **index.html** file using the `<script>` tag. You need to use JavaScript language to interact with inLive channel server and retrieve the data from it.

To interact with inLive channel server, you need to subscribe to the inLive channel first. You can read [this article](/docs/real-time-widget-api/subscribe-to-channel-server/) for reference. InLive channel server uses a technology called [server-sent events (SSEs)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) which is a server push technology that enables a client to receive automatic and real-time message/events from a server via HTTP connection. One way to work with the SSEs connection in the client is by using the [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) web API. Let’s try to subscribe to the channel server and listen for SSEs connection by using the endpoint URL below.

```
https://channel.inlive.app/subscribe/<STREAM_ID>
```

Let’s add the JavaScript code to subscribe to the channel server inside the `<script>` tag just before the closing `</body>` tag.

```html
<script type="text/javascript">
  const streamId = 15;
  const baseUrl = 'https://channel.inlive.app';
  const subscribeUrl = `${baseUrl}/subscribe/${streamId}`;
  const eventSource = new EventSource(subscribeUrl);

  eventSource.addEventListener('message', (event) => {
    // handle incoming message event here
  });

  eventSource.addEventListener('error', (event) => {
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log('Connection was closed');
    }
    console.log(event);
  });
</script>
```

To successfully subscribe to the channel server, the client needs an **ID of the stream**. In order to get the ID of the stream and use the real-time widget API, you must have a stream created first using inLive stream API and get the ID for that specific stream. We cannot use the ID of the stream that has already ended. [This article](/docs/tutorial/tutorial-app-with-webrtc/) will help you understand working with inLive stream API and getting the ID of the stream.

In the code above, we use a stream with the ID of 15. Currently, the ID is always a number. The code above basically says that we want to subscribe to the inLive channel server with the ID of 15. If there is no error message in the console, that means we have successfully subscribed to the inLive channel server with the stream ID of 15.

## Get and display the data

We have successfully subscribed to inLive channel server and you may wonder about how we will display the total number of users that connected to the specific stream. Well, the user, or we call it a client is actually connected to the channel server. The channel server has different channels for every stream created. By subscribing to the channel server with the specific stream ID, it will open a connection to the channel server for a specific stream. So, in order to get the total number of users, we need to get data from the channel server.

The way total number of users who are connected to the channel server is calculated by calculating the number of users/clients actually subscribed and connected to the channel server. The total number of users will change based on these conditions:
- If another client has successfully subscribed to the channel server, the counter value will increase by 1.
- If it’s disconnected to the channel server or the client leaves the page the counter value will decrease by 1.

Every time a client is connected or disconnected from the channel server, the channel server will send a notification to all clients.

Let’s try to get the total number of users connected to the channel server. You need to get data called "**viewer_count**" which holds the total number of users connected to the channel server data. The viewer_count can be sent by the channel server multiple times:
1. Every time the client successfully subscribes to the channel server, the viewer_count data will be sent through an event message which has the **init** type.
2. Every time there is a different client that joins and subscribes to the channel server, the updated viewer_count data will be sent through an event message which has the **system** type and additional **join** status data.
3. Similar to number two, every time there is a different client that leaves and unsubscribes/disconnects from the channel server, the updated viewer_count data will be sent through an event message which has the **system** type and additional **leave** status data.

Let’s write some JavaScript code based on the explanation above. We will modify the event source message listener above with the code below. The code below will listen for a **message** event sent from the channel server and retrieve the data inside it.

```js
eventSource.addEventListener('message', (event) => {
  if (event?.data) {
    const data = JSON.parse(event.data);
    const messageData = data.message;
    console.log(data);

    if (messageData) {
      if (data.type === 'init' && messageData.viewer_count) {
        updateViewerCounterUI(messageData.viewer_count);
      } else if (data.type === 'system' && messageData.viewer_count) {
        updateViewerCounterUI(messageData.viewer_count);
      }
    }
  }
});
```

Remember that the viewer_count data will only be sent if the message event data has **init** or **system** type. That way we have a conditional check based on the type and whether the viewer_count data actually exists or not. If the viewer_count data actually exists, the `updateViewerCounterUI` function will be called. We don’t have the function yet, let’s create one!

```js
const updateViewerCounterUI = (counter) => {
  if (typeof counter === 'number') {
    const viewerCounterElement = document.getElementById('viewer-counter');
    viewerCounterElement.textContent = counter;
  }
}
```

The `updateViewerCounterUI` function will receive a counter value and check if the type is number. This check can also be useful for checking whether the value actually exists and is not undefined. After receiving the updated counter value, the text content of the element that has a viewer-counter ID is updated and we have successfully updated the counter to the UI. If you want to test the counter, try to open the page in a new tab or new window. You will see the counter value change.

If you have read until this point, congratulations you have finished the tutorial of building a simple viewer counter widget using inLive real-time widget API.
