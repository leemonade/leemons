import hooks from 'leemons-hooks';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export const SocketIoService = {
  connect: (endpoint, config) => {
    socket = io(endpoint, config);
    console.log('Socket.io connected');
    return socket;
  },
  useOn: (_event, callback) => {
    const ref = useRef({ callback, event: _event });
    ref.current.callback = callback;
    ref.current.event = _event;

    const onEvent = ({ args: [{ event, data }] }) => {
      if (ref.current.event === event) {
        return ref.current.callback(event, data);
      }
      return null;
    };
    useEffect(() => {
      hooks.addAction('socket.io:onAny', onEvent);
      return () => {
        hooks.removeAction('socket.io:onAny', onEvent);
      };
    }, []);
  },
  onAny: (callback) => socket.onAny(callback),
  useOnAny: (callback) => {
    const ref = useRef({ callback });
    ref.current.callback = callback;
    const onEvent = ({ args: [{ event, data }] }) => {
      ref.current.callback(event, data);
    };
    useEffect(() => {
      hooks.addAction('socket.io:onAny', onEvent);
      return () => {
        hooks.removeAction('socket.io:onAny', onEvent);
      };
    }, []);
  },
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('Socket.io disconnected');
    }
  },
};

export default SocketIoService;
