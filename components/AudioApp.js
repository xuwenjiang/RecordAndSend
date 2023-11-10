"use client"

import React, { useState } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { UserInput } from './UserInput';
import { AudioPlayer } from './AudioPlayer';

export const AudioApp = () => {
  const [audioQueue, setAudioQueue] = useState([]);
  const [base64Audio, setBase64Audio] = useState('');
  const [userInputs, setUserInputs] = useState({
    alpha: 0.75,
    num_inference_steps: 50,
    start: {
      prompt: "church bells on sunday",
      denoising: 0.75,
      guidance: 7.0
    },
    end: {
      prompt: "jazz with piano",
      denoising: 0.75,
      guidance: 7.0
    }
  });

  const addAudioToQueue = (newBase64Audio) => {
    setAudioQueue((prevQueue) => [...prevQueue, newBase64Audio]);
  };

  // Function to update the base64Audio state
  const handleAudioData = (base64String) => {
    setBase64Audio(base64String);
  };

  // Function to update the userInputs state
  const handleUserInput = (inputData) => {
    setUserInputs(inputData);
  };

  const onAudioData = async (base64Audio) => {
    
    addAudioToQueue(base64Audio);
    // Construct the payload with user inputs and the audio data
    const payload = {
      ...userInputs,
      audio: base64Audio
    };

    // Make the POST request to the server
    try {
      const response = await fetch('http://localhost:3000/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data);
      // Handle the response data as needed
    } catch (error) {
      console.error('Error sending data to the server:', error);
      // Error handling
    }
  };

  return (
    <div>
      <UserInput userInputs={userInputs} onUserInputChange={handleUserInput} />
      <AudioRecorder onAudioData={onAudioData} />
      <AudioPlayer base64AudioQueue={audioQueue} />
    </div>
  );
};
