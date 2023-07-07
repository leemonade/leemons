import { useEffect } from 'react';

export function useScorm({ onInitialize, onTerminate, onSetValue }) {
  useEffect(() => {
    const handler = ({ data: msg }) => {
      if (msg.scope === 'scorm' && msg.caller === 'player') {
        switch (msg.event) {
          case 'commit':
            onSetValue?.(msg.commit);
            break;
          case 'terminate':
            onTerminate?.();
            break;
          case 'initialize':
            onInitialize?.();
            break;
          default:
        }
      }
    };
    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [onInitialize, onTerminate, onSetValue]);
}

export default useScorm;
