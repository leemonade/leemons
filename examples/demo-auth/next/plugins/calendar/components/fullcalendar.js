import { useEffect, useRef } from 'react';
import { addHeaderScript } from '@common/addHeaderScript';
import { addHeaderStyle } from '@common/addHeaderStyle';
import { existHeaderScript } from '@common/existHeaderScript';

export function FullCalendar(props) {
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);
  const calendar = useRef(null);

  const initCalendar = () => {
    if (scriptLoaded.current && containerRef.current && !calendar.current) {
      calendar.current = new window.FullCalendar.Calendar(containerRef.current, props);
      console.log(calendar.current);
      calendar.current.render();
    }
  };

  const onScriptLoaded = () => {
    scriptLoaded.current = true;
    initCalendar();
  };
  const onContainerRedLoaded = (ref) => {
    containerRef.current = ref;
    initCalendar();
  };

  useEffect(() => {
    const scriptUrl =
      'https://cdn.jsdelivr.net/combine/npm/fullcalendar@5.9.0,npm/fullcalendar@5.9.0/locales-all.min.js';
    const styleUrl = 'https://cdn.jsdelivr.net/npm/fullcalendar@5.9.0/main.min.css';
    if (!existHeaderScript(scriptUrl)) {
      addHeaderScript(scriptUrl);
      addHeaderStyle(styleUrl);
      const interval = setInterval(() => {
        if (window.FullCalendar) {
          clearInterval(interval);
          onScriptLoaded();
        }
      }, 1000 / 30);
    } else {
      onScriptLoaded();
    }
  }, []);

  return <div ref={onContainerRedLoaded}>a</div>;
}
