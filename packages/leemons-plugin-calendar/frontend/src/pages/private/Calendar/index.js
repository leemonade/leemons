import * as _ from 'lodash';
import { find, flatten, forEach, keyBy, map, uniq } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, LoadingOverlay } from '@bubbles-ui/components';
import { BigCalendar } from '@bubbles-ui/calendars';
import { CalendarSubNavFilters } from '@bubbles-ui/leemons';
import { getCentersWithToken } from '@users/session';
import { getCalendarsToFrontendRequest } from '@calendar/request';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import hooks from 'leemons-hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import { useLocale } from '@common';
import getCalendarNameWithConfigAndSession from '../../../helpers/getCalendarNameWithConfigAndSession';
import useTransformEvent from '../../../helpers/useTransformEvent';

function Calendar({ session }) {
  const locale = useLocale();
  const ref = useRef({ loading: true });

  const [transformEv, evLoading] = useTransformEvent();
  const [t] = useTranslateLoader(prefixPN('calendar'));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [, setR] = useState(null);

  const [toggleEventModal, EventModal, { openModal: openEventModal }] = useCalendarEventModal();

  function render() {
    setR(new Date().getTime());
  }

  async function getCalendarsForCenter(center) {
    const { calendars, events, userCalendar, ownerCalendars, calendarConfig } =
      await getCalendarsToFrontendRequest(center.token);

    return {
      calendars: map(calendars, (calendar, index) => {
        calendars[index].showEvents = true;
        return calendars[index];
      }),
      events,
      userCalendar,
      ownerCalendars,
      calendarConfig,
      center: center.id,
    };
  }

  const getTranslationSections = async (centersData) => {
    let keys = [];
    forEach(centersData, ({ calendars }) => {
      keys = keys.concat(map(calendars, 'section'));
    });
    const { items } = await getLocalizationsByArrayOfItems(uniq(keys));
    return items;
  };

  async function getTranslationDataCalendars(centersData) {
    let keys = [];
    forEach(centersData, ({ calendars }) => {
      keys = keys.concat(map(calendars, 'name'));
    });
    const { items } = await getLocalizationsByArrayOfItems(keys);
    return items;
  }

  function getEvents(data) {
    const events = [];
    const calendarsByKey = keyBy(data.calendars, 'id');
    _.forEach(data.events, (event) => {
      let canShowInCalendar = true;

      if (event.data?.hideInCalendar) {
        canShowInCalendar = false;
      }

      if (canShowInCalendar) {
        if (event.type === 'plugins.calendar.task' && event.data && event.data.classes) {
          // eslint-disable-next-line consistent-return
          _.forEach(event.data.classes, (calendar) => {
            if (calendarsByKey[calendar]?.showEvents) {
              events.push(transformEv(event, data.calendars));
              return false;
            }
          });
        } else if (calendarsByKey[event.calendar]?.showEvents) {
          events.push(transformEv(event, data.calendars));
        }
      }
    });
    return events;
  }

  function getFilteredEvents(data) {
    return transformDBEventsToFullCalendarEvents(
      getEvents(data),
      data.calendars,
      data.calendarConfig
    );
  }

  const getSectionName = (sectionName, calendarSectionNamesTranslations) =>
    tKeys(sectionName, calendarSectionNamesTranslations);
  const getCalendarName = (name, calendarNamesTranslations, calendar, data) =>
    getCalendarNameWithConfigAndSession(
      { ...calendar, name: tKeys(name, calendarNamesTranslations) },
      data,
      session
    );

  async function init() {
    ref.current.centers = getCentersWithToken();
    if (ref.current.centers) {
      ref.current.centersSelect = map(ref.current.centers, ({ name, id }) => ({
        label: name,
        value: id,
      }));
      [ref.current.center] = ref.current.centers;
      const centersData = await Promise.all(
        map(ref.current.centers, (center) => getCalendarsForCenter(center))
      );

      ref.current.calendarNamesTranslations = await getTranslationDataCalendars(centersData);
      ref.current.calendarSectionNamesTranslations = await getTranslationSections(centersData);

      forEach(centersData, (data) => {
        forEach(data.calendars, (calendar) => {
          // eslint-disable-next-line no-param-reassign
          calendar.name = getCalendarName(
            calendar.name,
            ref.current.calendarNamesTranslations,
            calendar,
            data
          );
        });
        // eslint-disable-next-line no-param-reassign
        data.classCalendars = _.map(_.filter(data.calendars, { isClass: true }), (calendar) => ({
          label: calendar.name,
          value: calendar.id,
        }));
      });

      // Eventos
      const centersDataValues = {};
      forEach(centersData, (data) => {
        centersDataValues[data.center] = {
          data,
        };

        centersDataValues[data.center].events = getFilteredEvents(data);

        // Secciones
        const calendarsBySection = _.groupBy(data.calendars, 'section');
        const calendarSections = [];
        _.forIn(calendarsBySection, (calendars, sectionName) => {
          calendarSections.push({
            calendars,
            sectionName: getSectionName(sectionName, ref.current.calendarSectionNamesTranslations),
          });
        });
        centersDataValues[data.center].sections = calendarSections;
      });

      ref.current.centersDataById = centersDataValues;
    }
    ref.current.loading = false;
    render();
  }

  async function reloadCalendar() {
    ref.current.centersDataById[ref.current.center.id].data = await getCalendarsForCenter(
      ref.current.center
    );
    ref.current.centersDataById[ref.current.center.id].events = getFilteredEvents(
      ref.current.centersDataById[ref.current.center.id].data
    );
    render();
  }

  useEffect(() => {
    hooks.addAction('calendar:force:reload', reloadCalendar);
    return () => {
      hooks.removeAction('calendar:force:reload', reloadCalendar);
    };
  });

  useEffect(() => {
    if (session && !evLoading) init();
  }, [session, evLoading]);

  const onEventClick = (info) => {
    if (info.originalEvent) {
      const { bgColor, icon, borderColor, ...e } = info.originalEvent;
      setSelectedEvent(e);
      openEventModal();
    }
  };

  const onNewEvent = () => {
    setSelectedEvent(null);
    openEventModal();
  };

  const fullCalendarConfigs = useMemo(() => {
    const config = {};
    if (!ref.current.loading) {
      const { data } = ref.current.centersDataById[ref.current.center.id];
      if (data && data.calendarConfig) {
        config.firstDay = data.calendarConfig.weekday;
        config.validRange = {
          start: new Date(data.calendarConfig.startYear, data.calendarConfig.startMonth, 1),
          end: new Date(data.calendarConfig.endYear, data.calendarConfig.endMonth + 1, 0),
        };
      }
    }
    return config;
  }, [ref.current.center, ref.current.loading]);

  if (ref.current.loading) return <LoadingOverlay visible />;

  console.log(ref.current.centersDataById[ref.current.center.id].events);

  return (
    <Box style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Box style={{ width: '250px', height: '100vh' }}>
        <CalendarSubNavFilters
          style={{ position: 'static' }}
          messages={{
            title: t('calendar'),
            centers: t('centers'),
            closeTooltip: t('close'),
          }}
          pages={[
            { label: t('calendar'), value: 'calendar' },
            { label: t('schedule'), value: 'schedule' },
          ]}
          value={ref.current.centersDataById[ref.current.center.id].sections}
          onChange={(event) => {
            ref.current.centersDataById[ref.current.center.id].sections = event;

            ref.current.centersDataById[ref.current.center.id].data.calendars = flatten(
              map(event, 'calendars')
            );
            ref.current.centersDataById[ref.current.center.id].events = getFilteredEvents(
              ref.current.centersDataById[ref.current.center.id].data
            );
            render();
          }}
          centers={ref.current.centersSelect}
          centerValue={ref.current.center.id}
          centerOnChange={(id) => {
            ref.current.center = find(ref.current.centers, { id });
            render();
          }}
        />
      </Box>

      <Box sx={(theme) => ({ padding: theme.spacing[4], width: '100%', height: '100vh' })}>
        {ref.current.center ? (
          <EventModal
            centerToken={ref.current.center.token}
            event={selectedEvent}
            close={toggleEventModal}
            classCalendars={ref.current.centersDataById[ref.current.center.id].data.classCalendars}
          />
        ) : null}

        <BigCalendar
          style={{ height: '100%' }}
          currentView="month"
          eventClick={onEventClick}
          addEventClick={onNewEvent}
          events={ref.current.centersDataById[ref.current.center.id].events}
          {...fullCalendarConfigs}
          locale={locale}
          messages={{
            month: t('month'),
            week: t('week'),
            day: t('day'),
            agenda: t('agenda'),
            today: t('today'),
            previous: t('previous'),
            next: t('next'),
            showWeekends: t('showWeekends'),
          }}
        />
      </Box>
    </Box>
  );
}

Calendar.propTypes = {
  session: PropTypes.object,
};

export default Calendar;
