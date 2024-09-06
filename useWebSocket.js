import { useState, useEffect } from 'react';

const useWebSocket = (url) => {
  const [webSocket, setWebSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      alert(data.message); // Display alert based on the message received
      }
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWebSocket(ws);

    return () => ws.close();
  }, [url]);

  const sendMessage = (message) => {
    if (webSocket && isConnected) {
      webSocket.send(message);
    }
  };

  return { sendMessage, isConnected };
};

export default useWebSocket;
