import { useEffect, useRef } from 'react';

export const useBeforeUnload = (handler) => {
  const eventListenerRef = useRef();

  useEffect(() => {
    eventListenerRef.current = (event) => {
      const returnValue = handler?.(event);
      // Handle legacy `event.returnValue` property
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
      if (typeof returnValue === 'string') {
        return (event.returnValue = returnValue);
      }
      // Chrome doesn't support `event.preventDefault()` on `BeforeUnloadEvent`,
      // instead it requires `event.returnValue` to be set
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#browser_compatibility
      if (event.defaultPrevented) {
        return (event.returnValue = '');
      }
    };
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => eventListenerRef.current(event);
    window.addEventListener('beforeunload', eventListener);
    return () => {
      window.removeEventListener('beforeunload', eventListener);
    };
  }, []);
};
