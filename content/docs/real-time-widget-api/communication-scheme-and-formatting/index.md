---
date: 2022-06-09
lastmod: 2022-06-09
name: Communication scheme and formatting
title: Communication scheme and formatting
description: This is an explaination on how to make communication scheme and formatting.
slug: communication-scheme-and-formatting
weight: 3003
menu:
  docs_sidebar:
    identifier: Communication scheme and formatting
    name: Communication scheme and formatting
    weight: 3003
    parent: Real Time Widget API
---
# Communication Scheme and Formatting
To make our Real Time Communication work, we have standardized how clients and our server format their messages when sending them. The standard format of our messages in the channel server is as follows:


```
{
  "stream_id": "1", 
  "author_id": "1",
  "to_user_id": "3",
  "message": {
    "param1": 0,
    "param2": "2022-04-13T18:39:49.139Z",
    "param3": {
      "paramA": "string value",
      "paramB": false
    }
  },
  "timestamp": 2365.123,
  "type": "broadcast",
  "widget_key": "6b9f652a-63fd-47d7-a3bc-418c1096eb8c"
}
```


Let’s define these values in more detail:



* **stream_id**  
    This designates the stream channel where the message was sent. The value is in string. This value is always optional to be filled by the client.

* **author_id**  
    This designates the ID of the user, this could be provided from the client or we generate them ourselves. The value is always optional to be filled by the client.

* **to_user_id**  
    This is only used when sending a message to a specific user. This designates the receiver’s user id. The value is in string

* **message**  
    This contains the actual payload of the message, this could hold anything that the widgets wish to convey to one another.

* **timestamp**  
    This should contain the timestamp of the video when the message is triggered in seconds. This should contain float values. Server messages that act as responses (e.g., _request_ or _init_ types) should have this value as 0.

* **type**  
    This designates the purpose of the message. The value of this field also dictates the necessities of the other fields, especially when a client is sending a message to the channel server :

    * _broadcast_  
        Designates the channel message as a broadcast, the channel server will broadcast it to _all_ users that participate in the same stream. This kind of message will be stored in an internal datastore that you can retrieve later. Fields necessary for this type are:
      * message
      * timestamp
      * widget_key
   
    * _webhook_  
        Request a webhook to be performed to a third party server. The **message** field should be supplied with the webhook URL. Supplying the **message** field with an object that contains a field named `url`(e.g., {url:”https://foo-bar.com/get”} ) Fields necessary for this type are:
      * message
      * widget_key
   
    * _private_   
        Designates the message as a private message, and will be shown to the intended eyes only. Fields necessary for this type are:

        * message
        * to_user_id
        * timestamp
        * widget_key

    * _request_  
        Requests from the datastore all _broadcasted_ messages that have been sent before. The response message from the server for this type also will have this type. Field necessary for this this type is:  
      * widget key
    * _init_  
        This type indicates the initial response of the channel server when first subscribed to.

* **widget_key**  
    This is a non-optional field when sending a message to the channel server. The field should contain the widget key of the widget that sent it.
