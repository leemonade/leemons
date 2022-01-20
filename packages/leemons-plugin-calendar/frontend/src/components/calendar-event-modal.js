/* eslint-disable camelcase */

import * as _ from 'lodash';
import { find, forEach, isString, map, set } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { getCalendarsToFrontendRequest } from '@calendar/request';
import loadable from '@loadable/component';
import { CALENDAR_EVENT_MODAL_DEFAULT_PROPS, CalendarEventModal } from '@bubbles-ui/components';
import { getEventTypesRequest } from '../request';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import PropTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';
import prefixPN from '@calendar/helpers/prefixPN';

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/calendar/${component}.js`)
  );
}

function NewCalendarEventModal({ opened, centerToken, event, forceType, onClose }) {
  const ref = useRef({ loading: true });
  const session = useSession({ redirectTo: goLoginPage });
  const [t] = useTranslateLoader(prefixPN('event_modal'));
  const [, setR] = useState();

  function render() {
    setR(new Date().getTime());
  }

  async function getCalendarsForCenter() {
    const { calendars, events, userCalendar, ownerCalendars } = await getCalendarsToFrontendRequest(
      centerToken
    );

    return {
      calendars,
      events,
      userCalendar,
      ownerCalendars,
      centerToken,
    };
  }

  async function getEventTypes() {
    const response = await getEventTypesRequest();
    return response.eventTypes;
  }

  async function getEventTypeTranslations(eventTypes) {
    const { items } = await getLocalizationsByArrayOfItems(_.map(eventTypes, 'key'));
    return items;
  }

  function getEventTypeName(sectionName, eventTypesTranslations) {
    return tKeys(sectionName, eventTypesTranslations);
  }

  async function init() {
    ref.current.loading = true;
    render();

    if (!ref.current.repeat) {
      ref.current.repeat = map(
        CALENDAR_EVENT_MODAL_DEFAULT_PROPS.selectData.repeat,
        ({ value }) => ({
          value,
          label: t(`repeat.${value}`),
        })
      );
    }

    if (!ref.current.eventTypes) {
      const eventTypes = await getEventTypes();
      const eventTypesTranslations = await getEventTypeTranslations(eventTypes);
      ref.current.eventTypes = map(eventTypes, (eventType) => ({
        ...eventType,
        value: eventType.key,
        label: getEventTypeName(eventType.key, eventTypesTranslations),
      }));
      ref.current.components = {};
      forEach(ref.current.eventTypes, (eventType) => {
        ref.current.components[eventType.key] = dynamicImport(
          `${eventType.pluginName}`,
          eventType.url
        );
      });
    }

    ref.current.calendarData = await getCalendarsForCenter();
    ref.current.calendarData.calendars = map(ref.current.calendarData.calendars, (calendar) => ({
      ...calendar,
      value: calendar.key,
      label: getCalendarNameWithConfigAndSession(calendar, ref.current.calendarData, session),
    }));
    ref.current.calendarData.ownerCalendars = map(
      ref.current.calendarData.ownerCalendars,
      (calendar) => ({
        ...calendar,
        value: calendar.key,
        label: getCalendarNameWithConfigAndSession(calendar, ref.current.calendarData, session),
      })
    );

    ref.current.defaultValues = {};
    ref.current.isNew = true;
    ref.current.isOwner = false;

    if (event) {
      ref.current.isNew = false;
      ref.current.isOwner = !!_.find(ref.current.calendarData.ownerCalendars, {
        id: _.isString(event.calendar) ? event.calendar : event.calendar.id,
      });

      const {
        startDate,
        endDate,
        isAllDay,
        calendar,
        data,
        id,
        created_at,
        updated_at,
        ...eventData
      } = event;

      _.forIn(eventData, (value, key) => {
        set(ref.current.defaultValues, key, value);
      });

      if (!ref.current.defaultValues.repeat)
        set(ref.current.defaultValues, 'repeat', 'dont_repeat');
      const calendarId = isString(calendar) ? calendar : calendar.id;
      const foundCalendar = find(ref.current.calendarData.ownerCalendars, { id: calendarId });
      if (foundCalendar) set(ref.current.defaultValues, 'calendar', foundCalendar.key);
      set(ref.current.defaultValues, 'isAllDay', !!isAllDay);
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setSeconds(0, 0);
      end.setSeconds(0, 0);

      set(ref.current.defaultValues, 'startDate', start);
      set(ref.current.defaultValues, 'startTime', start);
      set(ref.current.defaultValues, 'endDate', end);
      set(ref.current.defaultValues, 'endTime', end);
    } else if (ref.current.eventTypes.length) {
      set(ref.current.defaultValues, 'type', forceType || ref.current.eventTypes[0].key);
      set(ref.current.defaultValues, 'repeat', 'dont_repeat');
      set(ref.current.defaultValues, 'isAllDay', false);
      if (ref.current.calendarData && ref.current.calendarData.ownerCalendars)
        set(ref.current.defaultValues, 'calendar', ref.current.calendarData.ownerCalendars[0].key);
    }
    ref.current.loading = false;
    render();
  }

  useEffect(() => {
    if (session) init();
  }, [session, event]);

  if (ref.current.loading) return null;

  return (
    <CalendarEventModal
      opened={opened}
      isNew={ref.current.isNew}
      isOwner={ref.current.isOwner}
      forceType={forceType}
      selectData={{
        repeat: ref.current.repeat,
        eventTypes: ref.current.eventTypes,
        calendars: ref.current.calendarData.ownerCalendars,
      }}
      components={ref.current.components}
      onClose={onClose}
      defaultValues={ref.current.defaultValues}
    />
  );
}

NewCalendarEventModal.propTypes = {
  opened: PropTypes.bool,
  centerToken: PropTypes.string,
  event: PropTypes.object,
  forceType: PropTypes.string,
  onClose: PropTypes.func,
};

export const useCalendarEventModal = () => {
  const [opened, setOpened] = useState(false);

  return [
    function toggle() {
      setOpened(!opened);
    },
    function Component(data) {
      return <NewCalendarEventModal {...data} opened={opened} onClose={() => setOpened(false)} />;
    },
  ];
};
