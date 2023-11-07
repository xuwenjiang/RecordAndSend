"use client"

// reference : https://blog.logrocket.com/how-to-create-video-audio-recorder-react/

import React, { useState, useRef, useEffect } from "react";

const mimeType = "audio/wav";

export const AudioRecorder = () => {
  // some status variables
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");

  // some code to record audio. This is the whole audio recorded.
  const mediaRecorder  = useRef(null);
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  // some of my controling code
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (recordingStatus !== "recording") {
        return;
      }
      if (seconds !== 0 && seconds % 5 === 0) {
        // PROBLEM: this is not working.
        stopRecording();
        startRecording();
      }
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, recordingStatus]);

  const startRecording = () => {
    console.log("start");
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
       if (typeof event.data === "undefined") return;
       if (event.data.size === 0) return;
       localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    console.log("stop");
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
       const audioBlob = new Blob(audioChunks, { type: mimeType });

       var reader = new FileReader(); 
       reader.readAsDataURL(audioBlob); 
       reader.onloadend = function () { 
        var base64String = reader.result; 
        console.log(base64String);
       }
       setAudioChunks([]);
    };
  };

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
      <h1>Have played {seconds}s</h1>
      {!permission ? (
        <button class="btn btn-blue" type="button" onClick={getMicrophonePermission}>
          Get Microphone Permission
        </button>
      ) : null}

      {permission && recordingStatus === "inactive" ? (
        <button class="btn btn-blue" type="button" onClick={startRecording}>
          Start Recording
        </button>
      ) : null}

      {recordingStatus === "recording" ? (
        <button class="btn btn-blue" type="button" onClick={stopRecording}>
          Stop recording
        </button>
      ) : null}

      {/* {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
        </div>
      ) : null} */}
    </div>
  );
};
