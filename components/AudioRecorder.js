"use client"

import { useState, useRef, useEffect } from "react";

const mimeType = "audio/wav";

export const AudioRecorder = () => {
  // some status variables
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");

  // some code to record audio. This is the whole audio recorded.
  const mediaRecorder = useRef(null);
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  // some code to record audio clip. This is clips of audio recorded.
  const mediaRecorderTemp = useRef(null);
  const [streamTemp, setStreamTemp] = useState(null);
  const [audioChunksTemp, setAudioChunksTemp] = useState([]);
  const [audioTemp, setAudioTemp] = useState(null);

  // some of my controling code
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (recordingStatus === "recording") {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (recordingStatus === "inactive") {
      clearInterval(interval);
      setSeconds(0);
    }

    if (recordingStatus == "recording" && seconds != 0 && seconds % 5 == 0) {
      stopRecordingTemp();
      startRecordingTemp();
    }

    return () => clearInterval(interval);
  }, [recordingStatus, seconds]);

  const startRecording = () => {
    setAudio(null);
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

  const startRecordingTemp = () => {
    setAudioTemp(null);
    // I am a copy of above code as I am not 100% sure how to do this.
    const mediaTemp = new MediaRecorder(streamTemp, { type: mimeType });
    mediaRecorderTemp.current = mediaTemp;
    mediaRecorderTemp.current.start(5000);
    let localAudioChunksTemp = [];
    mediaRecorderTemp.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunksTemp.push(event.data);
    };
    setAudioChunksTemp(localAudioChunksTemp);
  }

  const stopRecording = () => {
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const stopRecordingTemp = () => {
    const logThings = async () => {
      const audioBlobTemp = new Blob(audioChunksTemp, { type: mimeType });
      console.log(seconds);
      console.log(await audioBlobTemp.text());
    }

    // Same here, as I am not 100% sure how to do this.
    console.log("stopRecordingTemp");
    mediaRecorderTemp.current.stop();
    logThings();
    setAudioTemp(null);

    setAudioChunksTemp([]);
    mediaRecorderTemp.current.onstop = () => {
      // setAudioTemp(null);
      // setAudioChunksTemp([]);
    };
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const streamDataTemp = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
        setStreamTemp(streamDataTemp);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  return (
    <div className="audio-controls">
      <h1>{seconds}</h1>
      {!permission ? (
        <button onClick={getMicrophonePermission} type="button">
          Get getMicrophone Permission
        </button>
      ) : null}

      {permission && recordingStatus === "inactive" ? (
        <button onClick={() => {startRecording(); startRecordingTemp();}} type="button">
          Start recording
        </button>
      ) : null}

      {recordingStatus === "recording" ? (
        <button onClick={() => {stopRecording(); stopRecordingTemp();}} type="button">
          Stop recording
        </button>
      ) : null}

      {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
        </div>
      ) : null}
    </div>
  );
};
