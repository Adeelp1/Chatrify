"use strict";

const socket = io();

let localStream = null;
let remoteStream = null;
let roomId = null;
let dataChannel = null; 
let channel = null;

let isRemoteDescriptionSet = false;
let iceQue = [];

const localVideoEl = document.querySelector("#localVideo");
const remoteVideoEl = document.querySelector("#remoteVideo");
const inputfield = document.getElementById("message")
const nexBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("sentBtn");
const messageArea = document.getElementById("messageArea");
const loadingVideo = document.querySelector("#loadingVideo");
const newMessageBtn = document.getElementById("newMessageBtn");
const constraints = {
    audio: true,
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
    },
};

socket.on("roomid", (id) => {
    roomId = id;
});

function init() {
    nexBtn.addEventListener('click', next);
    skipBtn.addEventListener('click', handleAction);
    inputfield.addEventListener('keydown', handleAction);
    newMessageBtn.addEventListener('click', scrollToBottom);
}

function sendICE(candidate) {
    socket.emit("icecandidate", candidate);
}

async function startPeerConnection() {
    const pc = PeerConnection.getInstance();
    const offer = await pc.createOffer();
    console.log(`offer: ${offer}`);
    await pc.setLocalDescription(offer);
    socket.emit("offer", {r_id: roomId, offer: pc.localDescription});
}

function closeConnection() {
    const pc = PeerConnection.getInstance();
    dataChannel.close();
    channel = null;
    pc.close();
}

// Request access to the webcam
async function openUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // Set the video source to the webcam stream
    document.querySelector('#localVideo').style.transform = 'scaleX(-1)';
    localStream = stream;
    localVideoEl.style.transform = 'scaleX(-1)';
    localVideoEl.srcObject = stream;

    startPeerConnection();

    console.log('Stream: ', document.querySelector('#localVideo').srcObject);
}

 function next() {
    closeConnection();
    socket.emit("changeRoom");
}

function handleAction(event) {
    if (event.type === "click")
    {
        sentMessage();
    }
    else if (event.type === "keydown" && event.key === "Enter")
    {
        sentMessage();
    }
}

function scrollToBottom() {
    messageArea.scrollTo({
        top: messageArea.scrollHeight,
        behavior: "smooth"
    });

    newMessageBtn.style.display = "none";

}

function sentMessage() {
    var msg = inputfield.value;

    if (msg !== '') {
        if (channel && dataChannel.onopen) {
            channel.send(msg)
        }
        displayMessage("You", msg);
    }
}

function displayMessage(user, msg) {
    // check if user is near bottom before adding
    const isNearBottom = messageArea.scrollHeight - messageArea.scrollTop <= messageArea.clientHeight + 50;

    // create new div
    let node = document.createElement("div");
    node.textContent = `${user}: ${msg}`;
    // messageArea.children.length + 1;
    messageArea.appendChild(node);

    if (user === "Stranger") {
        if (isNearBottom) {
            scrollToBottom();
        }
        else {
            newMessageBtn.style.display = "block";
        }
    }
    else {
        scrollToBottom();
    }

    // clear input field
    inputfield.value = '';
}

// Peer Connection
const PeerConnection = (function() {
    let peerConnection;

    const createPeerConnection = () => {
        const config = {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        };

        peerConnection = new RTCPeerConnection(config);
        dataChannel = peerConnection.createDataChannel("chat");

        dataChannel.onopen = () => {
            console.log("data channel is open");
            // clear previous chats
            messageArea.textContent = '';
        }

        dataChannel.onclose = () => {
            console.log("data channel is closed");
            // clear previous chats
            messageArea.textContent = "Please Wait";
        }

        peerConnection.ondatachannel = (event) => {
            channel = event.channel;
            // console.log("DataChannel received on B:", channel.label);
            dataChannel.onmessage = (msg) => {
                displayMessage("Stranger", msg.data)
            }
        }

        // add local stream to peer connection
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            })
        }

        remoteStream = new MediaStream();
        remoteVideoEl.srcObject = remoteStream;

        // listen to remote stream and add to peer connection
        peerConnection.ontrack = function(event) {
            // hide loading video and show the actual stream
            loadingVideo.style.display = "none";
            remoteVideoEl.style.display = "block";

            // assign the remote stream
            remoteVideoEl.style.transform = 'scaleX(-1)';
            event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track) );
        }
        // listen for ice candidate
        peerConnection.onicecandidate = function(event) {
            if(event.candidate){
                    iceQue.push(event.candidate);
            }
        }

        return peerConnection;
    }

    return {
        getInstance: () => {
            if(!peerConnection || peerConnection.connectionState === "closed") {
                dataChannel = null;
                peerConnection = createPeerConnection();
            }
            return peerConnection;
        }
    }
})();

socket.on("offer", async ({r_id, offer}) => {
    const pc = PeerConnection.getInstance();
    // set remote description
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", {r_id, answer: pc.localDescription});
    isRemoteDescriptionSet = true;
    iceQue.forEach(sendICE);
    iceQue = [];
});

socket.on("answer", async answer => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(answer)
    isRemoteDescriptionSet = true;
    iceQue.forEach(sendICE);
    iceQue = [];
});

socket.on("icecandidate", async candidate => {
    console.log(`candidate: ${candidate}`);
    const pc = PeerConnection.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("closed", () => {
    closeConnection();
    // show loading video, hide remote video
    loadingVideo.style.display = "block";
    remoteVideoEl.style.display = "none";
});

socket.on("restartIce", () => startPeerConnection());

// async function hangUp(e) {
//     const pc = PeerConnection.getInstance();
//     if(pc) {
//         pc.close();
//     }
//     const tracks = document.querySelector('#localVideo').srcObject.getTracks();
//     tracks.forEach(track => {
//         track.stop();
//     });

//     if (remoteStream) {
//         remoteStream.getTracks().forEach(track => track.stop());
//     }

//     // document.querySelector('#localVideo').srcObject = null;
//     // document.querySelector('#remoteVideo').srcObject = null;
// }

init();
openUserMedia();