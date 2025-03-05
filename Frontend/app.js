
let localStream;
let remoteStream = document.querySelector("#remoteVideo");
let CUsers;
let roomId;

var socket = io();
const username = `session-${Math.random().toString(36).substr(2, 9)}`;

socket.on("roomid", (id) => {
    roomId = id;
});
socket.emit('sessionId', username);

function init() {
    document.querySelector('#nextBtn').addEventListener('click', next);
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
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        })
        // listen to remote stream and add to peer connection
        peerConnection.ontrack = function(event) {
            // hide loading video and show the actual stream
            document.querySelector("#loadingVideo").style.display = "none";
            remoteStream.style.display = "block";

            // assign the remote stream
            remoteStream.style.transform = 'scaleX(-1)';
            remoteStream.srcObject = event.streams[0];
        }
        // listen for ice candidate
        peerConnection.onicecandidate = function(event) {
            if(event.candidate){
                socket.emit("icecandidate", event.candidate);
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
});

socket.on("answer", async answer => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(answer)
});

socket.on("icecandidate", async candidate => {
    console.log(`candidate: ${candidate}`);
    const pc = PeerConnection.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("colsed", () => {
    // show loading video, hide remote video
    document.querySelector("#loadingVideo").style.display = "block";
    remoteStream.style.display = "none";
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
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // Set the video source to the webcam stream
    document.querySelector('#localVideo').style.transform = 'scaleX(-1)';
    localStream = stream;
    document.querySelector('#localVideo').srcObject = stream;

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

async function hangUp(e) {
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
}

init();
openUserMedia();