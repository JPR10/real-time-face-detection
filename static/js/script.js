const video = document.querySelector('#video');

// Calling all face detection modules to be used 
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Model to detect the face in real time
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Model to detect features of the face (nose, mouth etc..)
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Model to detect the position of the face in a frame
    faceapi.nets.faceExpressionNet.loadFromUri('/models') // Model to detect face expression (sad, happy etc..)
]).then(startVideo)

// Function to display the output of the video frame
function startVideo() {
    navigator.getUserMedia(
        // Create the video object
        { video: {} },
        //Method to get what's coming from the webcam
        stream => video.srcObject = stream,
        //Method display if there is any error
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {
        width: video.width,
        height: video.height,
    }
    
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})