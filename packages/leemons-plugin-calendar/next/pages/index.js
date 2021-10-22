import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { getCentersWithToken, useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { getCalendarsToFrontendRequest } from '@calendar/request';
import { Button } from 'leemons-ui';
import { FullCalendar } from '@calendar/components/fullcalendar';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';
import { CalendarFilter } from '@calendar/components/calendar-filter';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import hooks from 'leemons-hooks';

function Calendar() {
  const session = useSession({ redirectTo: goLoginPage });
  const [centers, setCenters] = useState([]);
  const [center, setCenter] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [data, setData] = useState(null);
  const [dataCalendarsT, setDataCalendarsT] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionsT, setSectionsT] = useState({});
  const [toggleEventModal, EventModal] = useCalendarEventModal();

  const getCalendarsForCenter = async () => {
    const { calendars, events, userCalendar, ownerCalendars, calendarConfig } =
      await getCalendarsToFrontendRequest(center.token);

    setData({
      calendars: _.map(calendars, (calendar, index) => {
        calendars[index].showEvents = true;
        return calendars[index];
      }),
      events,
      userCalendar,
      ownerCalendars,
      calendarConfig,
    });
  };

  const getTranslationSections = async () => {
    const sectionKeys = _.map(sections, 'sectionName');
    const { items } = await getLocalizationsByArrayOfItems(sectionKeys);
    setSectionsT(items);
  };

  const getTranslationDataCalendars = async () => {
    const keys = _.map(data.calendars, 'name');
    const { items } = await getLocalizationsByArrayOfItems(keys);
    setDataCalendarsT(items);
  };

  const getSectionName = (sectionName) => tKeys(sectionName, sectionsT);
  const getCalendarName = (name) => tKeys(name, dataCalendarsT);

  useEffect(() => {
    hooks.addAction('calendar:force:reload', getCalendarsForCenter);
    return () => {
      hooks.removeAction('calendar:force:reload', getCalendarsForCenter);
    };
  });

  useEffect(() => {
    setCenters(getCentersWithToken());
  }, []);

  useEffect(() => {
    if (center) getCalendarsForCenter();
  }, [center]);

  useEffect(() => {
    getTranslationSections();
  }, [sections]);

  useEffect(() => {
    if (data) getTranslationDataCalendars();
  }, [data]);

  useEffect(() => {
    if (data) {
      // Eventos
      const events = [];
      const calendarsByKey = _.keyBy(data.calendars, 'id');
      _.forEach(data.events, (event) => {
        if (calendarsByKey[event.calendar].showEvents) {
          events.push(event);
        }
      });
      setFilteredEvents(
        transformDBEventsToFullCalendarEvents(events, data.calendars, data.calendarConfig)
      );
      // Secciones
      const calendarsBySection = _.groupBy(data.calendars, 'section');
      const calendarSections = [];
      _.forIn(calendarsBySection, (calendars, sectionName) => {
        calendarSections.push({ calendars, sectionName });
      });
      setSections(calendarSections);
    }
  }, [data]);

  useEffect(() => {
    if (centers.length) setCenter(centers[0]);
  }, [centers]);

  const showEventsChange = (e, calendar) => {
    const index = _.findIndex(data.calendars, { id: calendar.id });
    if (index >= 0) {
      data.calendars[index].showEvents = e.target.checked;
      setData({ ...data });
    }
  };

  const onEventClick = (info) => {
    if (info.originalEvent) {
      setSelectedEvent(info.originalEvent);
      toggleEventModal();
    }
  };

  const onNewEvent = () => {
    setSelectedEvent(null);
    toggleEventModal();
  };

  const fullCalendarConfigs = useMemo(() => {
    const config = {};
    if (data && data.calendarConfig) {
      config.firstDay = data.calendarConfig.weekday;
      config.validRange = {
        start: new Date(data.calendarConfig.startYear, data.calendarConfig.startMonth, 1),
        end: new Date(data.calendarConfig.endYear, data.calendarConfig.endMonth + 1, 0),
      };
    }
    return config;
  }, [data]);

  return (
    <div className="bg-primary-content h-full">
      {center ? (
        <EventModal centerToken={center.token} event={selectedEvent} close={toggleEventModal} />
      ) : null}

      {centers.length > 1 ? (
        <>
          {centers.map((_center) => (
            <Button key={_center.id} onClick={() => setCenter(_center)}>
              {_center.name}
            </Button>
          ))}
        </>
      ) : null}

      <Button color="primary" onClick={onNewEvent}>
        Añadir evento
      </Button>

      <div className="flex flex-column w-full h-full">
        <div className="w-4/12">
          {sections.map(({ calendars, sectionName }) => (
            <div key={sectionName}>
              <div>{getSectionName(sectionName)}</div>
              <div>
                {calendars.map((calendar) => (
                  <CalendarFilter
                    key={calendar.id}
                    calendar={{ ...calendar, name: getCalendarName(calendar.name) }}
                    config={data}
                    session={session}
                    showEventsChange={(e) => showEventsChange(e, calendar)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-8/12">
          <div style={{ paddingBottom: '100%', position: 'relative' }}>
            <FullCalendar
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              defaultView="month"
              eventClick={onEventClick}
              events={filteredEvents}
              {...fullCalendarConfigs}
              language={session?.locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withLayout(Calendar);
