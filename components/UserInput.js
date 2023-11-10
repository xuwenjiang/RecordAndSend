"use client"

import React, { useState, useRef } from "react";

export const UserInput = ({ userInputs, onUserInputChange }) => {
  // const [inputs, setInputs] = useState({
  //   alpha: 0.75,
  //   num_inference_steps: 50,
  //   start: {
  //     prompt: "church bells on sunday",
  //     denoising: 0.75,
  //     guidance: 7.0
  //   },
  //   end: {
  //     prompt: "jazz with piano",
  //     denoising: 0.75,
  //     guidance: 7.0
  //   }
  // });

  const handleChange = e => {
    onUserInputChange({
      ...userInputs,
      [e.target.name]: e.target.value
    });
  };

  const handleStartChange = e => {
    onUserInputChange({
      ...userInputs,
      start: {
        ...userInputs.start,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleEndChange = e => {
    onUserInputChange({
      ...userInputs,
      end: {
        ...userInputs.end,
        [e.target.name]: e.target.value
      }
    });
  };

  return (
    <div className="input-area">
      <div className="input-group">
        <label htmlFor="alpha" className="input-label">alpha</label>
        <input id="alpha" name="alpha" value={userInputs.alpha || ''} onChange={handleChange} className="input-input" />
      </div>
      <div className="input-group">
        <label htmlFor="num_inference_steps" className="input-label">steps</label>
        <input id="num_inference_steps" name="num_inference_steps" value={userInputs.num_inference_steps || ''} onChange={handleChange} className="input-input" />
      </div>
      <div className="input-group"></div>
      <div className="input-group">
        <label htmlFor="start.prompt" className="input-label">start prompt</label>
        <input id="start.prompt" name="prompt" value={userInputs.start.prompt || ''} onChange={handleStartChange} className="input-input" />
      </div>
      <div className="input-group">
        <label htmlFor="start.denoising" className="input-label">denoising</label>
        <input id="start.denoising" name="denoising" value={userInputs.start.denoising || ''} onChange={handleStartChange} className="input-input" />
      </div>
      <div className="input-group">
        <label htmlFor="start.guidance" className="input-label">guidance</label>
        <input id="start.guidance" name="guidance" value={userInputs.start.guidance || ''} onChange={handleStartChange} className="input-input" />
      </div>
      <div className="input-group"></div>
      <div className="input-group">
        <label htmlFor="end.prompt" className="input-label">end prompt</label>
        <input id="end.prompt" name="prompt" value={userInputs.end.prompt || ''} onChange={handleEndChange} className="input-input" />
      </div>
      <div className="input-group">
        <label htmlFor="end.denoising" className="input-label">denoising</label>
        <input id="end.denoising" name="denoising" value={userInputs.end.denoising || ''} onChange={handleEndChange} className="input-input" />
      </div>
      <div className="input-group">
        <label htmlFor="end.guidance" className="input-label">guidance</label>
        <input id="end.guidance" name="guidance" value={userInputs.end.guidance || ''} onChange={handleEndChange} className="input-input" />
      </div>
    </div>
  );
};
