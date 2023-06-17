const videoElem = document.getElementById("video");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const pauseElem = document.getElementById("pause");
const resumeElem = document.getElementById("resume");
const options = { mimeType: "video/webm", audioBitsPerSecond: 256000 };
const recordedChunks = [];
let mediaRecorder;
let audioStream;

const displayMediaOptions = {
  video: {
    displaySurface: "window"
  },
  audio: true
};


startElem.addEventListener("click", (evt) => {
  start_record();
}, false);

stopElem.addEventListener("click", (evt) => {
  stop_record();
}, false);

pauseElem.addEventListener("click", (evt) => {
  mediaRecorder.pause();
}, false);

resumeElem.addEventListener("click", (evt) => {
  mediaRecorder.resume();
}, false);


async function start_record() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Get user audio stream
    const combinedStream = new MediaStream([...stream.getTracks(), ...audioStream.getTracks()]); // Combine video and audio streams
    videoElem.srcObject = combinedStream;
    mediaRecorder = new MediaRecorder(combinedStream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}


function stop_record(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach((track) => track.stop());
  videoElem.srcObject = null;
  mediaRecorder.stop();
  audioStream.getTracks().forEach((track) => track.stop()); // Stop audio stream tracks

}


function handleDataAvailable(event) {
  console.log("data-available");
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.log(recordedChunks);
    download();
  } else {
    console.log(event.data);
  }
}
function download() {
  const blob = new Blob(recordedChunks, {
    type: "video/webm"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}

