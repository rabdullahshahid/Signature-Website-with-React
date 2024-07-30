import React, { useState, useRef, useCallback } from 'react';
import './App.css';

const SignatureConverter = () => {
  const [signatureImage, setSignatureImage] = useState(null);
  const canvasRef = useRef(null);
  const colorPickerRef = useRef(null);
  const widthPickerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = useCallback((event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = widthPickerRef.current.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPickerRef.current.value;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left || event.touches[0].clientX - rect.left;
    const y = event.clientY - rect.top || event.touches[0].clientY - rect.top;
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, []);

  const draw = useCallback((event) => {
    if (!isDrawing) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left || event.touches[0].clientX - rect.left;
    const y = event.clientY - rect.top || event.touches[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleSignatureSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    setSignatureImage(dataUrl);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureImage(null);
  };

  return (
    <div className="container">
      <h1>Signature Converter</h1>

      <div className="glass signature-section">
        <h2>Digital Signature</h2>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="controls">
          <label htmlFor="colorPicker">Marker Color:</label>
          <input type="color" id="colorPicker" ref={colorPickerRef} defaultValue="#000000" />
          <label htmlFor="widthPicker">Marker Width:</label>
          <input type="number" id="widthPicker" ref={widthPickerRef} defaultValue="2" min="1" max="10" />
        </div>
        <div className="buttons">
          <button onClick={handleSignatureSave}>Save Signature</button>
          <button onClick={handleClearSignature}>Clear</button>
        </div>
        {signatureImage && <img src={signatureImage} alt="Saved Signature" className="saved-signature" />}
      </div>

      <div className="alert">
        <strong>Note:</strong> Use the controls to customize the marker and draw your digital signature. Click "Save Signature" to save your signature as an image.
      </div>
    </div>
  );
};

export default SignatureConverter;
