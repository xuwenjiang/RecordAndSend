import React, { useState, useEffect } from 'react';

export const AudioPlayer = ({ base64AudioQueue }) => {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    if (base64AudioQueue.length > 0 && currentAudioIndex < base64AudioQueue.length) {
      setAudioSrc(base64AudioQueue[currentAudioIndex]);
    }
  }, [base64AudioQueue, currentAudioIndex]);

  const handleAudioEnd = () => {
    // When one audio ends, move to the next one in the queue
    if (currentAudioIndex < base64AudioQueue.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else {
      // Reset if it's the last audio
      setCurrentAudioIndex(0);
    }
  };

  // Function to reset the audio index to 0
  const resetAudioIndex = () => {
    setCurrentAudioIndex(0);
  };

  return (
    <div>
      {audioSrc && (
        <audio
          src={audioSrc}
          controls
          onEnded={handleAudioEnd}
          autoPlay
        >
          Your browser does not support the audio element.
        </audio>
      )}
      <button onClick={resetAudioIndex}>Reset Audio</button>
    </div>
  );
};
