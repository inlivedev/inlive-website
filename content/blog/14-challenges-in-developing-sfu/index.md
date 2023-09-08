---
# Refer to the themes/inlive/archetypes/README.md
date: 2023-09-08
lastmod: 2023-09-08
title: Challenges in developing an SFU - Developing a WebRTC SFU Part 2
description: What we learned from developing an SFU, the challenges and how we solve it
ogimage: /blog/designing-inlive-hub/images/og-image.png
slug: challenges-in-developing-sfu
summary: What we learned from developing an SFU, the challenges and how we solve it
---

# Challenges in developing an SFU - Developing a WebRTC SFU Part 2

![Selective Forwarder Unit(SFU)](/blog/how-sfu-works-developing-webrtc-sfu-part-1/images/sfu.png "Selective Forwarder Unit(SFU)")

When developing an SFU server there are several things that you need to consider because it will affect how you will deploy and scale it.

### Signaling channel
WebRTC will need a signaling channel to allow them exchange SDPs and ice candidates between peers. This is a bidirectional exchanges so the channel should allow the WebRTC client and SFU will able to send and receive SDPs and ice candidates. We can use web socket here, or just a HTTP REST API with server-sent event support for making it bidirectional. If you deploy your signaling server behind a load balancer, there will be an issue with connection timeout that make the connection disconnected automatically and you need to handle the reconnection.

### Multi port or single port
an SFU server basically a WebRTC client that run on the server. For each peer that connected to the SFU, the SFU will need to run a WebRTC client to establish the peer to peer connection. A single WebRTC client will need to run on a single port. If you have 1000 peers connected to the SFU, you will need to run 1000 WebRTC clients on the server. And that means, if you run a single WebRTC client on a single port, you will need to open 1000 ports on the server. This will be a problem if you run the SFU on a cloud server like AWS or GCP because they will limit the number of ports that you can open. 

From the complexity persepective it will be better to run a single WebRTC client on a single port because the p2p connection will be connected directly to the WebRTC client on the server without an UDP proxy. Less component to add means leass debugging if you're running a problem. But from the deployment persepective, it will be better to run a single WebRTC client on a single port because you will need to open less ports on the server, and it will be easier to deploy. 

Without using a single port, it seems when we write this post there is no way we can run the SFU on Kubernetes cluster node with more than one service per node, because Kubernetes is not support the port range forwarder. When this post written, deploying on Kubernetes cluster still hard to do but with a new gateway API, it seems we can run the SFU on Kubernetes cluster. We will cover this in the deployment section.

### Renegotation 
Everytime a new peer join the room, the SFU will need to renegotiate the connection with all peers in the room. This is because the SFU will need to add a new track to the peer connection. The problem become very complex when multiple peers join the room at the same time. There will be a race condition because when you still renegotiate the connection because the second peer is joined, the third peer is joined, and so on. Make sure the renegotation is handled properly to make sure all the tracks that published to the SFU by each peer can be broadcasted to other peers in the room.  

Another issue is how to handle the perfect renegotiation, when a client adding new track, it will request a renegotiation to SFU. But it will triggered an error when in the same time, the SFU also received a track when a new client joined. The SFU will try renegotiate also with the client and it will conflict because both side is trying to renegotiate. We will cover more about this in separate post how to handle it.

### Peer disconnection
When a peer leave the room but they close the browser tab instead hit the end button, it will take some times until the SFU notice that the peer is already left. This is because when the peer close the browser tab, the WebRTC will take some times to set it as a failed connection then it will closed the SFU. Th Usually we see this problem as a freeze video in our online meeting. That because either the connection is broken or  We can handle this on the client side by identify if the browser tab is closed then we send the end connection request to the SFU before it closed.

### When to request the Picture Loss Indication packet
When a peer is join the room, we need to show the video from the peer to the other peers in the room. To do that, we need to request the Picture Loss Indication packet from the peer and also from other peers. This packet will tell the peer to send the key frame to the SFU. The key frame is a frame that contain the full image of the video that required to render the video in the browser. Without this key frame, the video will just show a black screen. But requesting the Picture Loss Indication packet will increase the bandwidth usage because it contain a full image of video, so we need to be careful especially when a group of new peers already in the room and group of peers join together in the same time. It could trigger a bandwidth bottleneck issue, and the videos are starting to freeze because the packet can send and receive on time.  

It is also not guarantee that the peer will be send the key frame exactly when the peer already join the room. So we still might see a black sceen when join the room because the other peers stil not sending their keyframe yet. We can handle this issue also from the client implementation by establish the connection on the background when the peer open the room page but we hide and mute the videos from other peers until it click join button. This will give some times to receive all the key frames from other peers before we show the video.

### Codec Selection
Pick a codec is not as simple just choose a modern one. We need to consider the browser support, hardware support, and the bandwidth usage. For example, we might tend to use VP9 because it's a scalable codec, support simulcast and scalable video coding(SVC), and the bandwidth will be lower than H264. Even all browser is support VP9 for WebRTC now, but Apple ecosystem is not support by default hardware acceleration for VP9. So if you use VP9, it will consume a lot of CPU power on the Apple devices.  You might not have a problem with that, but your video will consume by others, so we should consider the consumer side as well. 

### Know the track source
When a peer join the room, the SFU will receive the track from the peer. But we don't know the source of the track, is it from the camera or from the screen sharing. We need to know the source of the track because we need to handle the track differently. For example, when a peer is sharing the screen, we want to make the video screen sharing as a main video and the camera video as a thumbnail. Currently, Pion the Golang library that we're using is not able to identify the track source. So we need to add a custom signaling to tell the SFU the track source. 

### Adaptive Streaming
Adaptive streaming is a technique to adjust the video quality based on the network condition. When the network is good, the video quality will be high, and when the network is bad, the video quality will be low. This is important to make sure the video is not freeze when the network is bad. We can use simulcast to achieve this. Simulcast is a technique to send multiple video quality at the same time. The receiver will choose which video quality that they want to receive based on their network condition. But simulcast will increase the bandwidth usage because it will send multiple video quality at the same time.

The challenge to implement this in an SFU is how we select the video to send to the peer. We need to make sure the video quality that we send is the most optimal based on the network condition. Beside that we also need to consider the size of video player rendered on the screen. If the video player is small, we can send a lower video quality to save the bandwidth. But if the video player is big, we need to send a higher video quality to make sure the video is not pixelated.

Adaptive streaming also can be use with modern codec that support Scalable Video Coding(SVC). SVC is a technique to encode a video into multiple layers. The layer can make the video packet contain a multiple resolution or adaptive frame rate. So not only sending a different quality of video, we can also change the frame rate of the video which affect the bandwidth usage. The implementation of SVC is is harder than simulcast because it's specific to the codec. 


### Recap
Even there are several challenges on implementing an SFU, the first thing first is to make sure the SFU is working properly. Making sure it can route the media tracks from one peer to other peers, and make sure the peer can communicate in real-time. After that we can start to implement some enhancement to provide better user experience.
