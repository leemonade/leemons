import PropTypes from 'prop-types';
import React, { useContext, useRef } from 'react';

function useObserverState() {
  const ref = useRef({
    subscribers: [],
  });

  const subscribers = () => ref.current.subscribers;

  // EN: Subscribe callbacks to all the emited events
  // ES: Suscribir a los callbacks a todos los eventos emitidos
  const subscribe = (callback) => {
    if (!Array.isArray(subscribers())) {
      ref.current.subscribers = [callback];
    } else {
      subscribers().push(callback);
    }
  };

  // EN: Remove the callback from the subscribers list
  // ES: Eliminar el callback de la lista de suscriptores
  const unsubscribe = (callback) => {
    if (Array.isArray(subscribers())) {
      const index = subscribers().findIndex((cb) => cb === callback);
      subscribers().splice(index, 1);
    }
  };

  // EN: Emit an event to all the subscribers
  // ES: Emitir un evento a todos los suscriptores
  const emitEvent = (event, data) => {
    if (Array.isArray(subscribers())) {
      return Promise.all(subscribers().map((callback) => callback(event, data)));
    }
    return new Promise([]);
  };

  return {
    subscribe,
    unsubscribe,
    emitEvent,
  };
}

// EN: Create a context to share the state of the observer
// ES: Crear un contexto para compartir el estado del observador
export default function useObserver() {
  const state = useObserverState();
  const contextRef = React.useRef(React.createContext(state));
  const context = contextRef.current;

  const Observer = React.useMemo(() => {
    const { Provider } = context;

    const ObserverProvider = ({ children }) => <Provider value={state}>{children}</Provider>;
    ObserverProvider.propTypes = {
      children: PropTypes.node,
    };

    return ObserverProvider;
  }, [context.Provider]);

  return React.useMemo(
    () => ({ ...state, Observer, useObserver: () => useContext(context) }),
    [JSON.stringify(state), Observer, useContext]
  );
}
