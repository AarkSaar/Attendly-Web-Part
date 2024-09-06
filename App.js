import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import useWebSocket from './useWebSocket';

function MainCameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const { sendMessage, isConnected } = useWebSocket('ws://localhost:3000')

  const startVideoStream = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch(error => console.error('Video play error:', error));
        };
      })
      .catch(err => console.error('Error accessing webcam:', err));
  };

  useEffect(() => {
    startVideoStream();
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.translate(canvas.width, 0); // Flip the context horizontally
    context.scale(-1, 1); 
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setPhoto(imageDataUrl);
    setHasPhoto(true);

    const currentDate = new Date().toISOString();
    if (isConnected) {
      const message = {
        type: 'photo',
        image: imageDataUrl,
        date: currentDate 
      };
      sendMessage(JSON.stringify(message));
    }
  };

  const closePhoto = () => {
    setHasPhoto(false);
    setPhoto(null);
    startVideoStream();
  };

  return (
    <div className="camera-app">
      <div className="camera-view">
        {hasPhoto ? (
          <>
            <img src={photo} alt="Captured" className="captured-photo" />
            <button onClick={closePhoto} className="close-btn">X</button>
          </>
        ) : (
          <>
            <video ref={videoRef} className="camera-feed"></video>
            <div onClick={capturePhoto} className="capture-btn">
              <div className="inner-circle"></div>
            </div>
            <div onClick={() => navigate('/new')} className="plus-btn">+</div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

function NewCameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const { sendMessage, isConnected } = useWebSocket('ws://localhost:3000')

  const startVideoStream = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch(error => console.error('Video play error:', error));
        };
      })
      .catch(err => console.error('Error accessing webcam:', err));
  };

  useEffect(() => {
    startVideoStream();
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.translate(canvas.width, 0); 
    context.scale(-1, 1); 
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setPhoto(imageDataUrl);
    setHasPhoto(true);
    
    const name = prompt('Enter your name:');
    const course = prompt('Enter your course:');
    
    if (isConnected) {
      const message = {
        type: 'photo_with_info',
        image: imageDataUrl,
        name: name,
        course: course
      };
      sendMessage(JSON.stringify(message));
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="camera-app">
      <div className="camera-view">
        {hasPhoto ? (
          <>
            <img src={photo} alt="Captured" className="captured-photo" />
            <button onClick={goBack} className="close-btn">X</button>
          </>
        ) : (
          <>
            <video ref={videoRef} className="camera-feed"></video>
            <div onClick={capturePhoto} className="capture-btn">
              <div className="inner-circle"></div>
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainCameraPage />} />
        <Route path="/new" element={<NewCameraPage />} />
      </Routes>
    </Router>
  );
}

export default App;
