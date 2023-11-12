// Current status, you have to quickly click the start recording button twice to get it to work.

"use client"

import React, { useState, useRef, useEffect } from "react";

const mimeType = "audio/wav";

export const AudioRecorder = ({ onAudioData }) => {

  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const timeoutRef = useRef(null); // To keep track of the timeout

  useEffect(() => {
    // This will be called when recordingStatus changes.
    if (recordingStatus === "inactive") {
      if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
        mediaRecorder.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear the timeout if recording is stopped
      }
    }
    else {
      recordChunk();
    }
  }, [recordingStatus]); // Depend on recordingStatus

  // method to start recording.
  const startRecording = () => {
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

    mediaRecorder.current.start();
    setRecordingStatus("recording"); // Use state to set the recording status
  };

  // method to stop recording.
  const stopRecording = () => {
    setRecordingStatus("inactive"); // Use state to set the recording status
  };

  const handleRecordedChunks = (data) => {
    var cloned = Object.assign([], data);
    const audioBlob = new Blob(cloned, { type: mimeType });
    var reader = new FileReader();
    reader.readAsDataURL(audioBlob);

    reader.onloadend = function () {
      var base64String = reader.result;
      onAudioData(base64String);
    }
  }

  const recordChunk = () => {
    timeoutRef.current = setTimeout(() => {
      if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
        mediaRecorder.current.stop();
        mediaRecorder.current.start();
        recordChunk();
      }
    }, 5120); // Record a chunk every 5120ms
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
    </div>
  );
};
