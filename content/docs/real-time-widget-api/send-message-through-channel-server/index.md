---
date: 2022-06-09
lastmod: 2022-06-09
name: Send message through channel server
title: Send message through channel server
description: This is an explaination on how to send message through channel server.
slug: send-message-through-channel-server
weight: 3002
menu:
  docs_sidebar:
    identifier: Send message through channel server
    name: Send message through channel server
    weight: 3002
    parent: Real-Time Widget API
---
# How to send or publish messages through the Channel Server

You are subscribed successfully to a channel server. The next stop is to publish messages through it.

We use SSE for our server-to-client communication. For client-to-server communication we will use a standard HTTP request. You may wonder, why don’t we also use SSE? This is because SSE is strictly server-to-client and cannot act as the medium to a client-to-server communication. Because of that we’ll use the good old HTTP request. With the rise of HTTP/2, a standard HTTP request is an effective and efficient client-to-server communication that we can use in tandem with SSE.


## Publish Message to a Channel Server

To send or publish a message to a channel in the channel server, Firstly, you must be subscribed to a stream’s channel. This has been covered in the previous tutorial. After successfully subscribing to a stream’s channel, the server will respond with a message that contains a **user_id** and **token**. This token will be needed to publish a message to the channel server. Secondly, you must retrieve a widget key, this widget key is then sent along with the message to be authenticated. If either of these is missing in the message body, the message will fail to be read by the channel server.


### Retrieving The Token

Let’s create a simple webpage that listens to the messages from the channel server akin to the one in the previous tutorial but let’s add the ability to send messages. You can do this locally or use online sandboxes like [JSfiddle](https://jsfiddle.net/). Let’s start with the HTML document, let’s make a list to list the messages received, a textbox to type our message and a button to send it.


```html
<html>
  <h1>Test SSE</h1>
  <ul id="list"></ul>

  <input type="text" id="msg">
  <button id="send">Send</button>
</html>
```


Now, for the Javascript, in the last tutorial the JS code looks more or less like this:


```js
const evtSource = new EventSource("https://channel.inlive.app/subscribe/1")

evtSource.onmessage = function(event) {
  const newElement = document.createElement("li");
  const eventList = document.getElementById("list");

  console.log(event)

  newElement.textContent = "message: " + event.data;
  eventList.appendChild(newElement);
}c
```


Let’s modify these codes a bit so that we can retrieve the token:


```js
const evtSource = new EventSource("https://channel.inlive.app/subscribe/1");

let token = "";

evtSource.onmessage = function(event) {
  const newElement = document.createElement("li");
  const eventList = document.getElementById("list");

  console.log(event)

  let obj = JSON.parse(event.data)
  newElement.textContent = "message: " + JSON.stringify(obj.message);
  eventList.appendChild(newElement);

  if (obj.type === "init") {
    token = obj.message.token
  }
}
```


In this now modified code, we parse the JSON first so we could further read and process the message. We’ll check if the type of the message is “**init**”, if it is, then we’ll retrieve the token and store it in a variable. We’ll also print the message like last time, but we’ll only print only the **message** field.


### Generating Widget Key

Now, we have the token that we needed. We still need the widget key to be able to send a message. To get the widget key, we must generate it first. We have another [tutorial](/docs/tutorial/tutorial-creating-and-managing-widget/) that has covered how to do this. After generating the widget key, then we can start sending messages to the channel server.


### Publishing a Message

Let’s add the on-click function into the button that we made. This on-click function must retrieve the text from the textbox, format it, and send it to the channel server with the necessary credentials.


```js
const btn = document.getElementById("send");

btn.onclick = function() {
  const text = document.getElementById("msg");
  const msg = text.value;

  console.log(msg);

  const obj = {
    message: msg,
    timestamp: 1.32, //this should contain the stream's timestamp
    widget_key: "6b9f652a-63fd-47d7-a3bc-418c1096eb8c",
    type: "broadcast"
  }

  fetch('https://channel.inlive.app/publish/1?token=' + token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
```


The endpoint for publishing messages is formatted as `/publish/{streamId}`, to supply the token you must supply it as a query parameter **token**. The obj variable contains the formatted message that contains the necessary fields for a `broadcast` type message. There are other types of messages that have different necessary fields to be filled. The subject regarding formatting these will be covered in the [communication scheme section](/docs/real-time-widget-api/communication-scheme-and-formatting/) below.

Like in the code above, to add the token credential into the request, you just only have to add a new query parameter called **token** and put your token there. The request must use the POST method and contain the `'Content-Type': 'application/json'` headers. The response of this endpoint will only indicate whether the request is successfully processed or not. Any other data will be transmitted through the SSE connection.

Now, let’s run the code. Type something inside the textbox and click the “Send” button, your message will pop up onto the list. Let’s open another tab that runs the same code and do the same thing, your message will pop on both tabs. Note that this message is broadcasted through SSE.

Cool, we’ve successfully created a bare-bones chat widget! You can of course do a lot of other things with this. Good luck on your development!
