---
# Refer to the themes/inlive/archetypes/README.md
date: 2022-07-20
lastmod: 2022-07-20
name: Building a live chat with a real-time widget API
title: How to build a simple live chat with Real-Time Widget API
description: In this tutorial, we will walk you through the steps of building a simple live chat message using inLive Real-Time Widget API.
slug: tutorial-building-a-live-chat-with-a-real-time-widget-api
weight: 4003
menu:
  docs_sidebar:
    identifier: Building a live chat with a real-time widget API
    name: Building a live chat with a real-time widget API
    weight: 4003
    parent: Tutorial
---

# How to build a simple live chat with Real-Time Widget API

## Introduction

In this tutorial, we will walk you through the steps of building a simple live chat message using [inLive Real-Time Widget API](/docs/real-time-widget-api/). We will not build any fancy live chat widget here. The goal of this tutorial is to make you understand how to build a simple real-time live chat using inLive Real-Time Widget API.

You can see the full version of this tutorial's code example [here](https://github.com/inlivedev/inlive-widget-examples/tree/main/live-chat) on GitHub.

## Prerequisites

To follow this tutorial, you need to have:
- An IDE/code editor like [Visual Studio Code](https://code.visualstudio.com).
- Some knowledge of HTML, CSS, and JavaScript languages.
- [Node.js](https://nodejs.org/en/) installed on your machine.

## Setting up Real-Time Widget API

Before proceeding further, you must create an account in the [inLive Studio]({{< getenv env="_HUGO_INLIVE_STUDIO_ORIGIN" >}}) in order to use the Real-Time Widget API. After the account is created, you need to **create a widget** and obtain the **widget key**, which will be used to communicate with the inLive channel server later. We have a tutorial that explains more about this process. You can read the tutorial [here](/docs/tutorial/tutorial-creating-and-managing-widget/).

## Setting up the project

Let’s create a new folder that we will put the code into. We will give the folder name “**live-chat”** folder. Inside the live-chat folder, create a folder called “**src”** folder. The src folder is where we will put the live chat code. We will use a tool called [Vite](https://vitejs.dev/) to help us to set up the local dev server environment quickly. Before installing the tool, let’s create a new package.json file by using the npm init command.

```shell
$ npm init -y
```

After the package.json is created, we need to install Vite as a dev dependency using the npm install command.

```shell
$ npm install vite --save-dev
```

In the package.json file, we need to add a script to run the Vite dev server. Let’s call it a **dev** script. This will open the local dev server inside the **src** folder that was already created before.

```json
"scripts": {
  "dev": "vite src"
}
```

Let’s run the local dev server using this command.

```shell
$ npm run dev
```

We can see the Vite dev server running in the terminal. It’s time to build our simple live chat.

## Building the UI

We will start building the layout Inside the **src** folder. Let’s create an **index.html** file and write some HTML and little CSS styling inside the HTML file.

### Build the basic HTML skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Live Chat Sample</title>
</head>
<body></body>
</html>
```

Let’s build the HTML skeleton which has a “Live Chat Sample” title.

### Build the chat list layout

```html
<style>
   ul {
     list-style: none;
     margin: 0;
     padding: 0;
     border: solid 1px #000;
     padding: 0.75rem 1rem;
     height: 240px;
     overflow: auto;
   }

   li {
     margin-bottom: 0.5rem;
   }
 </style>

 <h1>Simple Live Chat Sample</h1>
 <h2>Chat List</h2>
 <ul id="list"></ul>
```

Put styles, heading, and a list tag inside the body tag. Put an id called “**list**” for the list tag. We will display every list of chat messages inside the list tag.

### Build a form to send the chat message

```html
<h2>Send a chat message</h2>
<p>To start sending a chat message, please fill the fields below and click the button to send the chat message.</p>

<form id="form">
  <div>
    <label for="username">Username:</label>
    <input id="username" type="text" required>
  </div>
  <br>
  <div>
    <label for="message">Message:</label>
    <input id="message" type="text" required>
  </div>
  <br>
  <button type="submit">Send the Message</button>
</form>
```

Below the list tag, we add a form which has the **username** and **message** input fields and submit button. The username and message fields are **required**. This is the form that we will use to send and submit the chat message.

### Add an external JavaScript file

```html
<script type="text/javascript" src="/script.js"></script>
```

Lastly, we put a script tag before the body tag which will call a **script.js** file. The script.js file is a JavaScript file where all JavaScript logics we will use for building live chat are stored. Our HTML layout is ready. In the next step, we will create a JavaScript logic for the live chat.

## Building the JavaScript logic

After the layout and UI are finished. We will continue to the next step which is JavaScript logic. This section is important because in this section we will learn about how to interact and communicate with inLive channel server using Real-Time Widget API. Let’s create a **script.js** file inside the **src** folder which will be called by the **index.html** file we already created above.

### Subscribe to the channel server

Before we begin to make the live chat able to subscribe to the channel server, we want to tell you that the inLive channel server is using a technology called [server-sent events (SSEs)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) which is a server push technology that enables a client to receive automatic and real-time message/events from a server via HTTP connection. Because SSEs are sent over traditional HTTP, that means they do not require a special protocol. This is different than using a similar real-time technology like [Web Socket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) which is not based on HTTP protocol and requires new Web Socket servers to handle the protocol. One way to work with the SSEs connection in the client is by using the [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) web API.

After you understand about the technology behind the inLive channel server, let’s try to subscribe to the channel server and listen for SSEs connection. We need to use the endpoint URL below.

```
https://channel.inlive.app/subscribe/<STREAM_ID>
```

Let’s add the JavaScript code to subscribe to the channel server.

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

To successfully subscribe to the channel server, the client needs an **ID of the stream**. InLive Real-Time Widget API is **not** a standalone API and is intended to be used alongside [inLive stream REST API](/docs/getting-started/). Therefore, in order to get the ID of the stream and use the Real-Time Widget API, we must have a stream created first and get the ID for that specific stream. We cannot use the ID of the stream that already ended. The Real-Time Widget API is only intended to be used when the stream is still active and **not over** yet.

In the code above, we are using a stream that has the ID of 15. Currently, the ID is always a number. The code above basically says that we want to subscribe to the inLive channel server with the ID of 15. If there is no error message in the console, that means we have successfully subscribed to the inLive channel server with the stream ID of 15.

### Handle the authentication token

Every time the client subscribes to the channel server, the server will return an **authentication token**. The token will be used as an authentication mechanism that will be passed to the URL parameter every time the client tries to send a message to the channel server. Let’s modify the event source listener for the **message** event above with the code below.

The code below will retrieve the authentication token when the client has successfully subscribed to the channel server. The initial response/message from the channel server which brings the authentication token has the message with the type of “**init**”. We will store the token in the variable.

```js
let token = '';

eventSource.addEventListener('message', (event) => {
 if (event?.data) {
   const data = JSON.parse(event.data);
   const messageData = data.message;
   console.log(data);

   if (data.type === 'init') {
     token = messageData?.token;
   }
 }
});
```

### Send a message to the channel server

We have successfully subscribed and retrieved the authentication token from the channel server. The next thing we will do is to create the functionality of sending a chat message to the channel server. Sending a chat message is fairly simple because we only need to send a standard HTTP POST request to the channel server. We use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) web API to do that. The first thing we will do is to create a function that will handle a fetch request. This function will receive an object that consists of url, method, and body properties.

```js
const fetchRequest = async ({ url = '', method = '', body }) => {
 const options = {
   method: method,
   headers: {
     'Content-Type': 'application/json',
   },
   body: typeof body === 'object' ? JSON.stringify(body) : null
 }

 try {
   const response = await fetch(url, options);
   return response.json();
 } catch (error) {
   console.error(error);
 }
}
```

After we created the function above, we are ready to send a message. Below is the endpoint URL for sending a message to the channel server.

```
https://channel.inlive.app/publish/<STREAM_ID>?token=<AUTHENTICATION_TOKEN>
```

Note that if we want to send data to the channel server, we always need to follow the [standard communication format](/docs/real-time-widget-api/communication-scheme-and-formatting/) for the body request. This way, the channel server can process the data properly. The code below will get the value of username and message from input fields and then send it to the channel server through the above endpoint.

```js
const widgetKey = '<YOUR_WIDGET_KEY>';
const usernameField = document.getElementById('username');
const messageField = document.getElementById('message');
const form = document.getElementById('form');

form && form.addEventListener('submit', async (event) => {
 event.preventDefault();
 const username = usernameField.value;
 const message = messageField.value;

 const sendMessageBody = {
   message: {
     username: username,
     type: 'chat',
     message_text: message
   },
   widget_key: widgetKey,
   type: 'broadcast'
 }

 const sendMessageUrl = `${baseUrl}/publish/${streamId}?token=${token}`;
 const data =  await fetchRequest({
   url: sendMessageUrl,
   method: 'post',
   body: sendMessageBody
 });

 if (data.code !== 200) {
   alert(data.message);
 } else {
   messageField.value = '';
 }
});
```

Here are more explanations for the code example above:
1. We will get the username and chat message values from each input field. This happens every time the form submit event is invoked.
2. After we get the username and chat message values, we create a body request object based on the [standard communication format](/docs/real-time-widget-api/communication-scheme-and-formatting/). The **widget key** will be put here and the type is set to the **broadcast** type. Using the broadcast type means the data that we will send will be broadcasted to the other users. We also add a **type** inside the **message** field. The type value is set to “**chat”**. The **type** inside the **message** field is used to differentiate the message if we want to send a different message with a completely different message structure.
3. The last thing is we send the body object with the actual payload message to the channel server using fetch API. We put the **authentication token** we retrieved earlier as a URL parameter. If we successfully send the message, the message input field value will be cleared.

### Handle incoming broadcasted message

We had successfully created a send message feature for the live chat. If we send a message with a **broadcast** type in the body request to the channel server, the data will be broadcasted to the other users with the same message structure. That means everyone including us should be able to receive the broadcasted message that we had sent earlier. Let’s handle the incoming broadcasted message and put it into the chat list layout!

To handle the incoming broadcasted message, we will go back to the previous event source listener for **message** events. Previously, we already created the event source listener with this code.

```js
eventSource.addEventListener('message', (event) => {
 if (event?.data) {
   const data = JSON.parse(event.data);
   const messageData = data.message;
   console.log(data);

   if (data.type === 'init') {
     token = messageData?.token;
   }
 }
});
```

We will modify the event source listener above so it can handle incoming broadcasted messages. Let’s see the modified code below.

```js
const createChatMessage = (username, messageText) => {
 if (username && messageText) {
   const listElement = document.createElement('li');
   const strongElement = document.createElement('strong');

   strongElement.textContent = username;
   listElement.append(strongElement);
   listElement.append(`: ${messageText}`);

   return listElement;
 }

 return null;
}

const chatList = document.getElementById('list');

eventSource.addEventListener('message', (event) => {
 if (event?.data) {
   const data = JSON.parse(event.data);
   const messageData = data.message;

   if (data.type === 'init') {
     token = messageData?.token;

   } else if (messageData) {
     const { username,  message_text } = messageData;
     const chatMessage = createChatMessage(username, message_text);

     if (chatMessage && chatList) {
       chatList.appendChild(chatMessage);
     }
   }
 }
});
```

As you can see, we have created a new function called **createChatMessage**. Basically, this function will create a chat message HTML list element which display two values, the username and the actual text message. Meanwhile, if you see the code below it, you will see that we have modified the event source listener. We call the createChatMessage function to create a new chat message based on the username and message data that we have sent and received back because the message is broadcasted back to us. The message structure of the broadcasted message is the same as the message structure when we send the message following the [standard communication format](/docs/real-time-widget-api/communication-scheme-and-formatting/) that was already mentioned before. Finally, the chat message element already created is appended to the chat list element which resulting the message being displayed to the screen.

If the code above worked properly, we have successfully handled the incoming broadcasted message.

### Get all broadcasted messages

We have successfully sent a broadcast message and successfully handle the incoming broadcasted message in the client. The live chat is already working properly, except if we try to refresh the page, the chat message in the chat list disappeared and the client cannot display again all messages that have already been sent, broadcasted, and displayed before.

There is one last thing to do which is to get all broadcasted messages. Every time we visit or open the page, the client will get all broadcasted messages that have already been sent before and display the messages in the screen. We will start by creating a new function called **getAllMessages** that will get all broadcasted messages. Let’s see the function below.

```js
const getAllMessages = async () => {
 const getAllMessageBody = {
   type: 'request',
   widget_key: widgetKey,
 };

 const getAllMessagesUrl = `${baseUrl}/publish/${streamId}?token=${token}`;
 const data =  await fetchRequest({
   url: getAllMessagesUrl,
   method: 'post',
   body: getAllMessageBody
 });

 if (data.code !== 200) {
   alert(data.message);
 }
};
```

This function will send a fetch request using POST method to the same endpoint URL for sending a message. We need to put the **widget key**, and set the type into “**request**” type in the message body. We don’t need to send any message data. This is because with the request type, the client only requests to the channel server all broadcasted messages that have been sent before.

The getAllMessages function is ready, now we need to modify the event source listener again. Let’s see the modified code below.

```js
eventSource.addEventListener('message', (event) => {
 if (event?.data) {
   const data = JSON.parse(event.data);
   const messageData = data.message;

   if (data.type === 'init') {
     token = messageData?.token;
     getAllMessages();

   } else if (messageData) {
     if (Array.isArray(messageData)) {
       const filteredMessages = messageData.filter((messageItem) => {
         const { message } = messageItem;
         return message && message.type === 'chat';
       });

       filteredMessages.forEach((filteredItem) => {
         const { message } = filteredItem;

         if (message) {
           const { username,  message_text } = message;
           const chatMessage = createChatMessage(username, message_text);

           if (chatMessage && chatList) {
             chatList.appendChild(chatMessage);
           }
         }
       });
     } else {
       const { username,  message_text } = messageData;
       const chatMessage = createChatMessage(username, message_text);

       if (chatMessage && chatList) {
         chatList.appendChild(chatMessage);
       }
     }
   }
 }
});
```

You can see after the modification, the code inside the event source listener became huge. There are two important things that we need to understand based on the above modified code:
1. The first thing is how the client calls the getAllMessages function when the message with the type “**init**” received. The message with the type init is called only once when the client has successfully subscribed. This is a perfect place for us to get all broadcasted messages that have been sent before.
2. If the getAllMessages function is working properly, the channel server should send an event back to the client with the type of **request**. If there are broadcasted messages that have been sent before, the **message** field will contain an **array of object** data. On the above code, the client filtered the message and returned only the messages that had the type of “**chat**” in the message field payload. The client then processed each message and put it into the chat list layout.

After you have implemented the modification code above, you can try to refresh the page or open a new second tab or window in the browser and try to visit the page again. You will see the client will get and display all broadcasted messages sent by us or by other people before.

If you have finished implementing the code and done the above part, our simple live chat is finally working properly. If you are still reading until this section, congratulations you have finished the tutorial of building a simple live chat using inLive Real-Time Widget API!

The live chat is able to subscribe to the channel server, and it is able to send and handle the incoming message from the channel server in real-time. Besides that, the live chat is also able to get the previous broadcasted messages that were already sent previously. We hope this tutorial can help you to achieve your dream of making your own widget using [inLive Real-Time Widget API](/docs/real-time-widget-api/).