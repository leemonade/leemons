import { useState, useEffect } from 'react';
import { SocketIoService } from '@mqtt-socket-io/service';

function useSocketConnected() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let intervalId = null;

    const checkConnection = () => {
      const connected = SocketIoService.isConnected();
      if (connected) {
        setIsConnected(true);
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    // Check the connection immediately
    checkConnection();

    // Set an interval to check the connection every second if not connected
    if (!SocketIoService.isConnected()) {
      intervalId = setInterval(checkConnection, 1000);
    }

    // Clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return isConnected;
}

export { useSocketConnected };
