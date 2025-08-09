
let localStream = null;
let remoteStream = null;
let localVideoEl = document.querySelector("#localVideo");
let remoteVideoEl = document.querySelector("#remoteVideo");
let roomId = null;
let isRemoteDescriptionSet = false;
let iceQue = [];

const constraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
  audio: true,
};

var socket = io();

socket.on("roomid", (id) => {
    roomId = id;
});

function init() {
    document.querySelector('#nextBtn').addEventListener('click', next);
}

function sendICE(candidate) {
    socket.emit("icecandidate", candidate);
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
            document.querySelector("#loadingVideo").style.display = "none";
            remoteVideoEl.style.display = "block";

            // assign the remote stream
            remoteVideoEl.style.transform = 'scaleX(-1)';
            event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track) );
        }
        // listen for ice candidate
        peerConnection.onicecandidate = function(event) {
            if(event.candidate){
                if(isRemoteDescriptionSet){
                    sendICE(event.candidate)
                }
                else{
                    iceQue.push(event.candidate)
                }
            }
        }

        return peerConnection;
    }

    return {
        getInstance: () => {
            if(!peerConnection || peerConnection.connectionState === "closed") {
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

socket.on("colsed", () => {
    // show loading video, hide remote video
    document.querySelector("#loadingVideo").style.display = "block";
    remoteVideoEl.style.display = "none";
})

async function startPeerConnection(e) {
    const pc = PeerConnection.getInstance();
    const offer = await pc.createOffer();
    console.log(`offer: ${offer}`);
    await pc.setLocalDescription(offer);
    socket.emit("offer", {r_id: roomId, offer: pc.localDescription});
}

// Request access to the webcam
async function openUserMedia(e) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // Set the video source to the webcam stream
    document.querySelector('#localVideo').style.transform = 'scaleX(-1)';
    localStream = stream;
    localVideoEl.style.transform = 'scaleX(-1)';
    localVideoEl.srcObject = stream;

    startPeerConnection();

    console.log('Stream: ', document.querySelector('#localVideo').srcObject);
}

async function next(e) {
    const pc = PeerConnection.getInstance();
    pc.close();
    socket.emit("changeRoom");
    socket.on("restartIce", async () => {
        startPeerConnection();
    });
}

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