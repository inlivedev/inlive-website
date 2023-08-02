---
date: 2022-06-07
lastmod: 2023-08-02
name: playing-video-with-hls-and-mpeg-dash
title: Playing Video with HLS and MPEG-DASH
description: Inlive supports HLS and MPEG-DASH streaming protocol formats which offers 3 types adaptive bitrate qualities for playing video through a video player.
ogimage: /images/docs/og-image.png
slug: playing-video-with-hls-and-mpeg-dash
menu:
  docs_sidebar:
    identifier: playing-video-with-hls-and-mpeg-dash
    parent: learn
    weight: 3
pagination:
  prev:
    text: Video Input
    link: /docs/learn/video-input/
---

# Playing Video Streaming Through Inlive
Live streaming works by delivering video to the viewers through video streaming protocols.
When the streaming starts, the video camera will capture the video. Then, the video will be sent to an encoder that converts RAW files to streamable format. The encoder ingests it into an online video platform or directly to the [CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) via [RTMP](https://wowza.medium.com/rtmp-streaming-the-real-time-messaging-protocol-explained-3306cfae5474). After that, the video is delivered to the viewers by video player via streaming protocols formats. Our Inlive has provided a solution by providing a playlist file, both as “.m3u8” for [HLS](https://www.cloudflare.com/learning/video/what-is-http-live-streaming/) protocol format or “.mpd” for [MPEG-DASH](https://www.cloudflare.com/learning/video/what-is-mpeg-dash/) protocol format which can be used on various video players.

In order to get Inlive’s video manifest paths, we need to call `getStream()` function to return a response with both HLS and MPEG-DASH format. To read more about how to use `getStream()` function with our API and see its example response in order to use the manifest paths with a video player (we are using [Shaka Player](https://github.com/shaka-project/shaka-player) as our example), kindly refer to this [tutorial](/docs/tutorials/live-stream-api/tutorial-app-with-webrtc/#6-get-the-video).

## Streaming Protocol Formats : HLS and MPEG-DASH
Due to the many varieties of streaming protocols available, we should know what advantages and disadvantages each streaming protocol offers. Inlive [API](https://api.inlive.app/apidocs/index.html#/stream/get_streams__id_) response supports 2 common streaming protocol formats : HLS (HTTP Live Streaming) which delivers media via standard HTTP web servers to the HTML5 video player, and MPEG-DASH which is an open-source standard which uses adaptive bitrate video method.

Therefore, which one is better for video players?

## What to consider
Of course, both have good and bad points. Let’s break through it one by one.

### 1. Compatibility through devices
HLS supports a wide range of devices, but MPEG-DASH is not supported only at iOS Safari browser which is a downside because it’s important for iOS Safari users. ​​This MPEG-DASH compatibility problem because the [Media Source API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API) is only enabled on Safari desktop and iPad, not in iOS.

### 2. Latency
Although HLS supports widest compatibility for streaming, it is known to create a high latency stream previously. It is because HLS file (.m3u8) segments are usually much longer so each segment needs to be encoded at different bitrates. That is why it is commonly said that HLS prioritizes quality over low latency before Apple announced that HLS finally can support low latency streaming ([LL-HLS](https://developer.apple.com/documentation/http_live_streaming/enabling_low-latency_http_live_streaming_hls)) in 2019. Different from HLS, MPEG-DASH typically has lower latency as the file segments are much smaller so no need to encode them at different bitrates.

In spite of HLS providing low latency streaming right now, currently our Inlive doesn’t support LL-HLS because we are using FFmpeg for encoding which can't be done through FFmpeg. Our Inlive’s HLS format is still using community version (.m3u8) instead of the Apple version (LL-HLS), while our Inlive’s MPEG-DASH format is already using [low latency DASH](https://dashif.org/news/low-latency-dash/), so the latency can reach up to 1-3 seconds only. Therefore, to achieve lower latency, you should always prioritize using Inlive MPEG-DASH format instead of HLS format. As mentioned earlier, since our Inlive API supports both formats, it is recommended to do capability testing (for example, using [window.MediaSource](https://github.com/shaka-project/shaka-player/issues/3037#issuecomment-742701187)) whether the Media Source is enabled, so it can support MPEG-DASH format on your video player. If Media Source API is disabled, then you can use the HLS format for your video player.

### 3. Adaptive Video
Both HLS and MPEG-DASH support adaptive bitrate feature so users can receive the best quality video based on what their internet connection can handle. Also, both HLS and MPEG-DASH support [HDR](https://www.haivision.com/blog/all/what-is-hdr-how-you-can-contribute-live-broadcast-content-in-hdr/) (High Dynamic Range) which deliver a wider color gamut and better tonal rendition. Currently, our Inlive’s MPEG-DASH and HLS are using same video codec which is H264 because it is the most supported codec on all platforms.

As we know, [video bitrate](https://golightstream.com/what-is-video-bitrate/) affects the video quality. For now, Inlive provides adaptive video with 3 different qualities:
- 360 p with 800kb bitrate
- 480p with 1350kb bitrate
- 720p with 2500kb bitrate

With these 3 qualities, your video player can change the bitrate according to the network and device so the users don’t have to face buffering time while watching live streaming. To achieve adaptive bitrate qualities that are already supported on Inlive, you can use a video player that supports adaptive bitrate automation. In [our tutorial](/docs/tutorials/live-stream-api/tutorial-app-with-webrtc/#6-get-the-video), we’re using Shaka Player because it handles video quality adjustment automatically. To learn more about utilizing these multiple bitrates and maximize its capability, you could read this [article](https://youtube-eng.googleblog.com/2018/04/making-high-quality-video-efficient.html) and also check out this [one](https://bloggeek.me/tweaking-webrtc-video-quality-unpacking-bitrate-resolution-and-frame-rates/) on how to tune webRTC video quality.


## Summary
HLS and MPEG-DASH are two of the most popular video streaming protocols for transferring video. [On our documentation](/docs/tutorials/live-stream-api/tutorial-app-with-webrtc/#6-get-the-video) to view the live streaming video, we’re using [Shaka Player](https://github.com/shaka-project/shaka-player) as the example of our video player since it’s easy to use for playing adaptive media formats. However, you could also create your own video player or use other video players because our API currently supports those 2 kinds of live streaming protocol formats (MPEG-DASH or HLS) to be consumed inside an HTML media element, so you can adjust what format suits your video player needs.
