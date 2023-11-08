"use client"

// reference : https://blog.logrocket.com/how-to-create-video-audio-recorder-react/
// reference : https://stackoverflow.com/questions/51325136/record-5-seconds-segments-of-audio-using-mediarecorder-and-then-upload-to-the-se
// current status : can not stop


import React, { useState, useRef } from "react";

const mimeType = "audio/wav";

export const AudioRecorder = () => {

  const mediaRecorder  = useRef(null);

  var recordingStatus = "inactive";
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  // method to start recording.
  const startRecording = () => {
    console.log("start clicked");

    recordingStatus = "recording";

    setAudioChunks([]);

    const media = new MediaRecorder(stream, { type: mimeType });
    mediaRecorder.current = media;
    
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      var actualChunks = audioChunks.splice(0, audioChunks.length);
      handleRecordedChunks(actualChunks);
    };

    recordChunk();
  };

  // method to stop recording.
  const stopRecording = () => {
    console.log("stop clicked");
    recordingStatus = "inactive";
    mediaRecorder.current.stop();
  };

  const handleRecordedChunks = (data) => {
    var cloned = Object.assign([], data);
    const audioBlob = new Blob(cloned, { type: mimeType });
    var reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = function () { 
      var base64String = reader.result;
      console.log(base64String);
    }
  }

  const recordChunk = () => {
    console.log("recording chunks, and status is " + recordingStatus);
    mediaRecorder.current.start();
    setTimeout(() => {
      if(mediaRecorder.current.state == "recording") {
        mediaRecorder.current.stop();
      }

      if (recordingStatus == "recording") {
        recordChunk();
      }
    }, 5000);
  }

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  return (
    <div className="audio-controls">
      <h1>status: {recordingStatus}</h1>
      {!permission ? (
        <button className="btn btn-blue" type="button" onClick={getMicrophonePermission}>
          Get Microphone Permission
        </button>
      ) : null}

      {permission ? (
        <div>
          <button className="btn btn-blue" type="button" onClick={startRecording}>
            Start Recording
          </button>
          <button className="btn btn-blue" type="button" onClick={stopRecording}>
            Stop recording
          </button>
        </div>
      ) : null}

      

      {/* {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
        </div>
      ) : null} */}
    </div>
  );
};
