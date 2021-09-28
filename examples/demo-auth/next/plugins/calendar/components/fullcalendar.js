import * as _ from 'lodash';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { addHeaderScript } from '@common/addHeaderScript';
import { addHeaderStyle } from '@common/addHeaderStyle';
import { existHeaderScript } from '@common/existHeaderScript';

export function FullCalendar({ onCalendarInit = () => {}, events, ...props }) {
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);
  const calendar = useRef(null);

  const initCalendar = () => {
    if (scriptLoaded.current && containerRef.current && !calendar.current) {
      calendar.current = new window.FullCalendar.Calendar(containerRef.current, {
        events,
        ...props,
      });
      calendar.current.render();
      onCalendarInit(calendar.current);
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
    if (calendar.current) {
      calendar.current.removeAllEvents();
      _.forEach(events, (event) => {
        calendar.current.addEvent(event);
      });
    }
  }, [events]);

  useEffect(() => {
    if (calendar.current) {
      _.forIn(props, (value, key) => {
        calendar.current.setOption(key, value);
      });
    }
  }, [props]);

  useEffect(() => {
    const scriptUrl =
      'https://cdn.jsdelivr.net/combine/npm/fullcalendar@5.9.0,npm/fullcalendar@5.9.0/locales-all.min.js';
    const styleUrl = 'https://cdn.jsdelivr.net/npm/fullcalendar@5.9.0/main.min.css';
    if (!existHeaderScript(scriptUrl)) {
      addHeaderScript('https://cdn.jsdelivr.net/npm/rrule@2.6.4/dist/es5/rrule.min.js');
      addHeaderScript(scriptUrl);
      addHeaderScript('https://cdn.jsdelivr.net/npm/@fullcalendar/rrule@5.5.0/main.global.min.js');
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

  return <div ref={onContainerRedLoaded}></div>;
}

FullCalendar.propTypes = {
  events: PropTypes.array,
  onCalendarInit: PropTypes.func,
};
