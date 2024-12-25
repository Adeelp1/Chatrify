
let localStream;
let remoteStream = document.querySelector("#remoteVideo");
let CUsers;

var socket = io();
const username = `room-${Math.random().toString(36).substr(2, 9)}`;

socket.emit('joinRoom', username);

function init() {
    document.querySelector('#startBtn').addEventListener('click', openUserMedia);
    document.querySelector('#stopBtn').addEventListener('click', hangUp);
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
            if(!peerConnection) {
                peerConnection = createPeerConnection();
            }
            return peerConnection;
        }
    }
})();

socket.on("users", users => {
    for(const user in users) {
        if (user !== username){
            CUsers = user
        }
    }
})

socket.on("offer", async ({from, to, offer}) => {
    const pc = PeerConnection.getInstance();
    // set remote description
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", {from, to, answer: pc.localDescription});
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

// Request access to the webcam
async function openUserMedia(e) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // Set the video source to the webcam stream
    document.querySelector('#localVideo').style.transform = 'scaleX(-1)';
    localStream = stream;
    document.querySelector('#localVideo').srcObject = stream;

    const pc = PeerConnection.getInstance();
    const offer = await pc.createOffer();
    console.log(`offer: ${offer}`);
    await pc.setLocalDescription(offer);

    socket.emit("offer", {from: username,to: CUsers, offer: pc.localDescription});

    // socket.emit("localStream", localStream);

    // socket.on("remoteStream", (remote) => {
    //     remoteStream = remote;
    // })
    
    // document.querySelector("#remoteVideo").srcObject = remoteStream;

    console.log('Stream: ', document.querySelector('#localVideo').srcObject);
    document.querySelector('#stopBtn').disabled = false;
    document.querySelector('#startBtn').disabled = true;
    document.querySelector('#nextBtn').disabled = false;
}

async function hangUp(e) {
    const pc = PeerConnection.getInstance();
    if(pc) {
        pc.close();
    }
    const tracks = document.querySelector('#localVideo').srcObject.getTracks();
    tracks.forEach(track => {
        track.stop();
    });

    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
    }

    document.querySelector('#localVideo').srcObject = null;
    document.querySelector('#remoteVideo').srcObject = null;
    document.querySelector('#stopBtn').disabled = true;
    document.querySelector('#startBtn').disabled = false;
    document.querySelector('#nextBtn').disabled = true;
}

init();