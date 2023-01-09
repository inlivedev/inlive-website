---
# Refer to the themes/inlive/archetypes/README.md
date: 2022-08-22
lastmod: 2022-08-22
name: Building banner widget with Real-Time Widget API
title: How to build an interaction tracker banner widget with Real-Time Widget API
description: In this tutorial, we will walk you through the steps of building an interaction tracker banner widget using inLive Real-Time Widget API.
slug: tutorial-building-interaction-tracker-banner-widget-with-real-time-widget-api
weight: 4005
menu:
  docs_sidebar:
    identifier: Building banner widget with Real-Time Widget API
    name: Building banner widget with Real-Time Widget API
    weight: 4005
    parent: Tutorial
draft: true
---

# How to build an interaction tracker banner widget with Real-Time Widget API

## Introduction

In this tutorial, we will walk you through the steps of building an interaction tracker banner widget using [inLive Real-Time Widget API](/docs/real-time-widget-api/). The goal of this tutorial is to make you aware of the possibility of using the inLive Real-Time Widget API to track and log the user interactions on the element/widget. In this case, the user "clicks" interaction on the banner widget.

You can see the full version of this tutorial’s code example [here](https://github.com/inlivedev/inlive-widget-examples/tree/main/banner) on GitHub.

## Prerequisites

To follow this tutorial, you need to have:
- An IDE/code editor like [Visual Studio Code](https://code.visualstudio.com).
- Some knowledge of HTML, CSS, and JavaScript languages.

## Set up Real-Time Widget API

Before proceeding further, you must create an account in the [inLive Studio]({{< getenv env="_HUGO_INLIVE_STUDIO_ORIGIN" >}}) in order to use the Real-Time Widget API. After the account is created, you need to **create a widget** and obtain the **widget key**, which will be used to communicate with the inLive stream channel server later. There is a tutorial that explains more about this process. You can read the tutorial [here](/docs/tutorial/tutorial-creating-and-managing-widget/).

## Set up the project

Let’s create a new folder to set up our project. Let’s give the folder name "**banner**" folder. Inside the banner folder, create a new folder called "**src**" folder. This src folder is where we put all the source code in this tutorial. Our sample will have two pages which are the **banner page** and the **logs page**. The banner page is the page where the banner and the logic to log the user interaction to the banner is located. The logs page is the page that displays all user interaction logs to the banner.

## Build the banner functionality

Let’s create the banner page first. We will create a really simple HTML template for the banner and implement the JavaScript logic that logs the user interaction with the banner.

### Build the HTML template

To create the HTML template, let’s create a HTML file and save it with the name "**index.html**" file. Put the code below into the file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Banner Widget Sample</title>
  <style>
    .banner {
      color: #000;
      text-decoration: none;
      height: 7rem;
      border: solid 1px #000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <h1>Simple banner widget sample</h1>
  <a id="banner" class="banner" href="https://inlive.app" target="_blank">By clicking this banner will bring you to the inLive website</a>
  <script type="text/javascript" src="/index.js"></script>
</body>
</html>
```

The code above will display a banner using a `<a>` anchor tag. It also has a class and ID called banner. We use the banner class to do little styling to the banner using CSS. We will use the banner ID to get the banner element in the JavaScript later. From the user view, this banner only has one purpose, which is to open the inLive website on the new tab when the user clicks it. We will send and log the user click interaction to the banner later using JavaScript. Before the end of the `<body>` tag, we put the `<script>` tag which points to a file called **index.js** which is a JavaScript file where we put our JavaScript code later.

### Subscribe to the stream channel server

On this part, we will implement the JavaScript logic to listen to the user click interaction and communicate to the inLive stream channel server. You need to create a new file called "**index.js**" if you haven’t created it before.

Let’s start implementing the JavaScript logic by [subscribing to the inLive stream channel](/docs/real-time-widget-api/subscribe-to-channel-server/) first. InLive stream channel server uses a technology called [server-sent events (SSEs)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) which is a server push technology that enables a client to receive automatic and real-time message/events from a server via HTTP connection. One way to work with the SSEs connection in the client is by using the [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) web API. Let’s try to subscribe to the stream channel server and listen for SSEs connection by using the endpoint URL below.

```
https://channel.inlive.app/subscribe/<STREAM_ID>
```

To subscribe to the stream channel server, put the JavaScript code below inside the index.js file.

```js
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
```

To successfully subscribe to the stream channel server, the client needs an **ID of the stream**. In order to get the ID of the stream and use the Real-Time Widget API, you must have a stream created first using inLive stream API and get the ID for that specific stream. We cannot use the ID of the stream that has already ended. [This article](/docs/tutorial/tutorial-app-with-webrtc/) will help you understand working with inLive stream API and getting the ID of the stream.

In the code above, we use a stream with the ID of 15. Currently, the ID is always a number. The code above basically says that we want to subscribe to the inLive stream channel server with the ID of 15. If there is no error message in the console, that means we have successfully subscribed to the inLive stream channel server with the stream ID of 15.

### Handle the authentication token

Every time the client successfully subscribes to the stream channel server, the channel will return an **authentication token**. The token will be used as an authentication mechanism that will be passed to the URL parameter every time the client tries to send a message to the stream channel server. Let’s modify the event source listener for the **message** event above with the code below.

The code below will retrieve the authentication token when the client has successfully subscribed to the channel server. The `init` type is the type of message sent by the stream channel server after a successful subscription. The message has data inside the property called `message` which is the actual message data.  For this tutorial, we need the `token` and `user_id` data in the `message` property.  We will store the token and user ID data in the variable and will use them later.

```js
let token = '';
let userId = '';

eventSource.addEventListener('message', (event) => {
  if (event?.data) {
    const data = JSON.parse(event.data);
    const messageData = data.message;

    if (data.type === 'init') {
      token = messageData?.token;
      userId = messageData?.user_id;
    }
  }
});
```

### Listen the user click interaction and send the log data

We have successfully subscribed to the stream channel server, received the token and user ID, and stored them into variables. The next thing we will do is to listen to the user click interaction and send the log data to the stream channel server. The endpoint we will use is the publish endpoint which you can see below. We use this endpoint every time we need to send a message to the stream channel server.

```
https://channel.inlive.app/publish/<STREAM_ID>?token=<AUTHENTICATION_TOKEN>
```

To send the log data to the stream channel server, we only need to send a standard HTTP POST request to the stream channel server. We use standard [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) web API to do that. We also need a **widget key** and put it later in the body request. If you still don’t have the widget key, please see the "Set up Real-Time Widget API" section above.

```js
const widgetKey = '<YOUR_WIDGET_KEY>';
const banner = document.getElementById('banner');

banner && banner.addEventListener('click', async () => {
  const body = {
    message: {
      name: 'demo-banner',
      type: 'banner',
      action: 'click',
      user_id: userId,
      time: Date.now(),
    },
    widget_key: widgetKey,
    type: 'broadcast'
  }

  const publishUrl = `${baseUrl}/publish/${streamId}?token=${token}`;

  try {
    const response = await fetch(publishUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.code !== 200) {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
});
```

Let’s see the code above. We use the banner HTML ID to get the banner element and listen for the "click" event on the banner. Every time the user clicks the banner the code above will be executed and the system will send log data inside the `body` object to the stream channel server. When we send a message data that will be broadcasted to the other users, the message type we use is `broadcast` type. Note that we also pass the widget key to the `widget_key` field because this field is required if we want to send the data to the stream channel server. How do we know if we need to use broadcast type and how do we structure the message structure? Fortunately, we already have [standard communication format](/docs/real-time-widget-api/communication-scheme-and-formatting/), you can read more about the message communication structure there.

The log message data can include anything as long as it is still in object format and you don’t need to follow the structure below, but for the purpose of this example, the data we send to the stream channel server is structured like this:
- **name**: name of the widget banner.
- **type**: the type of the widget.
- **action**: the user interaction action to the banner.
- **user_id**: the user ID that interacts with the banner.
- **time**: the current timestamp when the user interacts with the banner.

You can see whether the request is a success or not using the network dev tool. If it returns a 200 status code, then we have successfully sent log data to the stream channel server.

## Build the logs functionality

We have created the banner functionality and we have successfully sent log data to the stream channel server. The next thing we will do is to create a simple HTML template and implement the JavaScript logic to display all the logs sent to the stream channel server.

### Build the HTML template

Let’s create a new HTML file and save it with the name "**logs.html**" file. Put the code below into the file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Widget Logs</title>
  <style>
    .widget-logs {
      margin: 0;
      border: solid 1px #000;
      padding: 0.75rem 1rem;
      height: 12rem;
      overflow: auto;
    }
    .widget-logs li {
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>Logs for banner widget sample</h1>
  <ul id="logs" class="widget-logs"></ul>
  <p>Number of times the banner clicked: <b id="click-counter">0</b> times</p>
  <script type="text/javascript" src="/logs.js"></script>
</body>
</html>
```

The code above will display a box with ID "logs" where all logs sent to the stream channel server will be displayed there. Below that, we have a simple counter that the value is incremented every time we have a new user click interaction. Before the end of the `<body>` tag, we put the `<script>` tag which points to a file called **logs.js** which is a JavaScript file where we put our JavaScript code for this page later.

### Repeat the subscribe to the stream and handle authentication token parts

Let’s start implementing the JavaScript logic for logs functionality. Same with the banner page, the first thing we need to do is to subscribe to the stream channel server and handle the authentication token. We have done that previously, so let’s repeat the process by putting the code below into a new JavaScript file called **logs.js** and we should be able to subscribe to the stream channel server in our logs.html file. Remember that, you need to subscribe with the same stream ID. Otherwise, you will subscribe to a different stream channel ID.

```js
const streamId = 15;
const baseUrl = 'https://channel.inlive.app';
const subscribeUrl = `${baseUrl}/subscribe/${streamId}`;
const eventSource = new EventSource(subscribeUrl);

let token = '';

eventSource.addEventListener('message', (event) => {
  if (event?.data) {
    const data = JSON.parse(event.data);
    const messageData = data.message;

    if (data.type === 'init') {
      token = messageData?.token;
    }
  }
});

eventSource.addEventListener('error', (event) => {
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log('Connection was closed');
  }
  console.log(event);
});
```

### Get all user interaction logs

Let’s create a function that will get all user interaction logs. This function actually will request all messages that are sent to the specific stream channel ID server. Basically, we request all broadcasted messages and the stream channel server will send the messages to us. Inside each message, we can find the user interaction log data. Let’s create the function first and name it `getAllMessages` function. This function will send a message body with the **request** type to the publish endpoint. The same endpoint we use when we send the log data.

```
https://channel.inlive.app/publish/<STREAM_ID>?token=<AUTHENTICATION_TOKEN>
```

```js
const widgetKey = '<YOUR_WIDGET_KEY>';

const getAllMessages = async () => {
  const getAllMessageBody = {
    type: 'request',
    widget_key: widgetKey,
  };

  const getAllMessagesUrl = `${baseUrl}/publish/${streamId}?token=${token}`;

  try {
    const response = await fetch(getAllMessagesUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getAllMessageBody)
    });

    const data = await response.json();

    if (data.code !== 200) {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};
```

Let’s call the `getAllMessages` function. We will call the function after the client has successfully subscribed to the stream channel server. At this time, the SSE connection is already established and properly connected. This is a good time to request all messages from the stream channel server and display the messages to the user. We modify the event source message listener to look like this.

```js
eventSource.addEventListener('message', (event) => {
  if (event?.data) {
    const data = JSON.parse(event.data);
    const messageData = data.message;

    if (data.type === 'init') {
      token = messageData?.token;
      getAllMessages();
    }
  }
});
```

After that, if the function works properly, then we have successfully requested all broadcasted messages from specific stream channel ID. After the request is successful, the stream channel server will send a message event to the client which contains all broadcasted messages we requested before. We are ready to display the data.

### Display the logs

After the client receives the message event which contains all broadcasted messages, it’s time to process and display the user interaction logs. We need to modify the event source message listener again in the logs.js file because every logic to process and display the logs will be put inside the listener.

```js
const logsListElement = document.getElementById('logs');
const clickCounterElement = document.getElementById('click-counter');

eventSource.addEventListener('message', (event) => {
 if (event?.data) {
   const data = JSON.parse(event.data);
   const messageData = data.message;

   if (data.type === 'init') {
     token = messageData?.token;
     getAllMessages();

   } else if (messageData) {
    //if the event.data.type is not an "init" type and the actual message data is not null, the code below will run

     if (Array.isArray(messageData)) {
     //this will run when the client receives all broadcasted message data after called getAllMessages function

       const bannerClickActions = messageData.filter((messageItem) => {
         const message = messageItem.message;
         return message && message.type === 'banner' && message.action === 'click' && message.user_id && !isNaN(message.time);
       });

       bannerClickActions.forEach((bannerClickAction) => {
         const message = bannerClickAction.message;

         //format time
         const time = new Date(message.time).toLocaleString([], {
           dateStyle: 'medium',
           timeStyle: 'medium',
         });

         //create a new log
         const logMessage = createLogMessage(`The user with ID ${message.user_id} clicked the banner at ${time}`);

         //increment the click counter
         incrementClickCounter(clickCounterElement);

         if (logMessage && logsListElement) {
           logsListElement.appendChild(logMessage);
         }
       });

     } else if (messageData.type === 'banner' && messageData.action === 'click' && messageData.user_id && !isNaN(messageData.time)) {
       //this will run when the client receives a new message data with banner type and has action called click

       //format time
       const time = new Date(messageData.time).toLocaleString([], {
         dateStyle: 'medium',
         timeStyle: 'medium',
       });

       //create a new log
       const logMessage = createLogMessage(`The user with ID ${messageData.user_id} clicked the banner at ${time}`);

       //increment the click counter
       incrementClickCounter(clickCounterElement);

       if (logMessage && logsListElement) {
         logsListElement.appendChild(logMessage);
       }
     }
   }
 }
});
```

After modification, the event source message listener becomes huge. Let’s explain the code:
- When receiving SSE message, we will receive a message that has two kinds of message data:
    1. Multiple message data in the form of an array of objects. These are received every time we request to get all messages using `getAllMessages` function we defined earlier.
    2. A single message data in the form of a single object. This is received when the stream channel server sends new data to the client.
- For message we receive from the stream channel server, we will take the actual data inside the `message` field such as the **type**, **action**, **user_id**, and **time**. These are the data that we sent previously. Every log message will display the user ID that sends the data and the time the user interacts with the banner in a readable time format. Then, the counter which holds the number of user interactions on the banner will do an auto-increment every time there is a new log that comes to the list. The last thing is appending the new log message to the log list.

In the event source message listener above, we call some functions that we haven’t created. Let’s create the functions! We will create a function called `createLogMessage` which will create a new log message.

```js
const createLogMessage = (text) => {
 if (text) {
   const listElement = document.createElement('li');
   listElement.textContent = text;
   return listElement;
 }

 return null;
}
```

We also need to create a function called `incrementClickCounter`. This function is responsible to increment the counter value for every user interaction log.

```js
const incrementClickCounter = (clickCounterElement) => {
 let numberOfClicks = parseInt(clickCounterElement.textContent, 10);

 if (!isNaN(numberOfClicks)) {
   numberOfClicks++;
   clickCounterElement.textContent = numberOfClicks;
 }
}
```

After we modified our event source message listener, the messages logs that were sent from the stream channel server were displayed in the log list. We can now see the user interaction logs from the log list. Each log prints which user ID clicks the banner and the time the user clicks the banner. Below the log list, you can see the banner click counter is incremented every time a new log comes to the log list.

If you follow along until this section and successfully display the logs, congratulations you have successfully finished the tutorial on building an interaction tracker banner widget using inLive Real-Time Widget API to track the user click interaction.