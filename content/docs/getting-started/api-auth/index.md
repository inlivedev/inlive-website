---
date: 2024-07-08
lastmod: 2024-07-08
name: api-auth
title: API Authentication
description: Learn how to authenticate your application for access to Inlive APIs using an application key and access token.
ogimage: /images/docs/og-image.png
slug: api-auth
menu:
  docs_sidebar:
    identifier: api-auth
    name: API Authentication
    parent: getting-started
    weight: 1
---

## Get an Application Key
To allow your app to access all Inlive APIs, you need an application key, also known as an API key. This application key is unique per application, and you will need to use it with all your API requests. Follow these steps to create your application key:
1. Register [an Inlive account](#).
2. Go to [the integration page](#).
3. Create an application key. Make sure you copy the key after you create it because you won't be able to see it again later.

## Authenticate Your API Request
The application key cannot be used directly with Inlive product APIs; instead, you need to generate an access token from the application key. The access token is a temporary token that will be used to authenticate your API requests. The access token will expire after a certain time, so you need to generate a new access token when the current one expires.

### Generate an Access Token
To generate an access token, you need to make a request to [the access token endpoint](https://api.inlive.app/apidocs/index.html#/apikeys/post_keys_accesstoken) with your application key. Here is an example of how to generate an access token using the `curl` command:
```bash
curl -X 'POST' \
  'https://api.inlive.app/v1/keys/accesstoken' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <your-apikey-here>' \
  -H 'Content-Type: application/json' \
  -d '{
  "expiry_seconds": 3600
}'
```

Use the access token as a bearer token in your API requests. Please note that although you can set the expiration time of the access token when you generate it, make sure not to set it too long as it could be a security risk. The recommended and default expiration time is 1 hour.

### Refresh an Access Token
The access token will expire after a certain time. All Inlive product APIs will validate your request using the validate endpoint. When the request returns an HTTP response code 403 Forbidden, and the response header has an X-Access-Token-Expired header, it means your access token has expired, and you need to refresh it. To refresh it, you need to generate a new access token as described above, using the same application key.
