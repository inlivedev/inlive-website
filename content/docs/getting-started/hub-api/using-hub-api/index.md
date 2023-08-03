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
    parent: getting-started-hub-api
pagination:
  prev:
    text: Hub API
    link: /docs/getting-started/hub-api/
  next:
    text: Tutorials
    link: /docs/tutorials/
---

# Using Hub API

Learn how to use and integrate the Hub API into your application

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

## Resources

- Read the [API reference docs](https://hub.inlive.app/apidocs/index.html)
- Read an [example tutorial about developing a conference app](/docs/tutorials/hub-api/conference-app-with-hub-api/) using Hub API.
- Check out the [code example in GitHub](https://github.com/inlivedev/inlivedev.github.io/tree/main/examples/)
- Explore our [Hub SFU library in GitHub](https://github.com/inlivedev/sfu)

<!-- Concept -->