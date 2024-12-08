const videoElement = document.getElementById('video');

// Request access to the webcam
// navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//     .then((stream) => {
//         // Set the video source to the webcam stream
//         videoElement.style.transform = 'scaleX(-1)';
//         videoElement.srcObject = stream;
//     })
//     .catch((error) => {
//         console.error('Error accessing webcam:', error);
//     });