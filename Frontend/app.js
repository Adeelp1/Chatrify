
let localStream = null;
let remoteStream = null;

function init() {
    document.querySelector('#startBtn').addEventListener('click', openUserMedia);
    document.querySelector('#stopBtn').addEventListener('click', hangUp);
}


// Request access to the webcam
async function openUserMedia(e) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // Set the video source to the webcam stream
    document.querySelector('#localVideo').style.transform = 'scaleX(-1)';
    document.querySelector('#localVideo').srcObject = stream
    localStream = stream;
    remoteStream = new MediaStream();
    document.querySelector("#remoteVideo").srcObject = remoteStream;

    console.log('Stream: ', document.querySelector('#localVideo').srcObject);
    document.querySelector('#stopBtn').disabled = false;
    document.querySelector('#startBtn').disabled = true;
    document.querySelector('#nextBtn').disabled = false;
}

async function hangUp(e) {
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