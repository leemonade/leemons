import * as _ from 'lodash';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, { useEffect, useMemo, useState } from 'react';

import moment from 'moment';
import hooks from 'leemons-hooks';
import { RRule } from 'rrule';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import { momentLocalizer } from './fullcalendar-views';
import Calendar from './fullcalendar-views/Calendar';

export function FullCalendar({
  events,
  dateClick = () => {},
  onSelectDay = () => {},
  language,
  firstDay,
  validRange,
  onRangeChange = () => {},
  onSelectEvent = () => {},
  eventClick = () => {},
  backgroundEventClick = () => {},
  messages,
  ...props
}) {
  const [t] = useTranslateLoader(prefixPN('calendar'));

  const [dateRange, setDateRange] = useState(null);
  const [date, setDate] = useState(new Date());

  const localizer = useMemo(() => {
    if (!_.isNil(language) && !_.isNil(firstDay)) {
      moment.updateLocale(language, {
        week: {
          dow: firstDay, // Monday is the first day of the week.
        },
      });
      moment.locale(language);
    }
    return momentLocalizer(moment);
  }, [language, firstDay]);

  const _onDayClick = ({ args: [date] }) => {
    onSelectDay(date);
    dateClick(date);
  };

  const _onRangeChange = (range) => {
    if (_.isArray(range) && range.length > 1) {
      range = {
        start: range[0],
        end: range[range.length - 1],
      };
    } else if (_.isArray(range) && range.length === 1) {
      const end = new Date(range[0]);
      end.setHours(23, 59, 59);
      range = {
        start: range[0],
        end,
      };
    } else if (_.isArray(range)) {
      range = null;
    }

    if (range) {
      onRangeChange(range);
      setDateRange(range);
    }
  };

  const _onSelectEvent = (ev) => {
    onSelectEvent(ev);
    eventClick(ev);
  };

  const _backgroundEventClick = ({ args: [ev] }) => {
    onSelectEvent(ev);
    eventClick(ev);
  };

  useEffect(() => {
    hooks.addAction('big-calendar:dayClick', _onDayClick);
    hooks.addAction('big-calendar:backgroundEventClick', _backgroundEventClick);
    return () => {
      hooks.removeAction('big-calendar:dayClick', _onDayClick);
      hooks.removeAction('big-calendar:backgroundEventClick', _backgroundEventClick);
    };
  });

  const _events = useMemo(() => {
    const acc = [];
    if (dateRange) {
      _.forEach(events, (ev) => {
        if (ev.rrule) {
          const diff = moment(ev.end).diff(ev.start);

          const rule = new RRule({
            ...ev.rrule,
            dtstart: new Date(
              Date.UTC(
                dateRange.start.getFullYear(),
                dateRange.start.getMonth(),
                dateRange.start.getDate(),
                dateRange.start.getHours(),
                dateRange.start.getMinutes(),
                dateRange.start.getSeconds()
              )
            ),
            until: new Date(
              Date.UTC(
                dateRange.end.getFullYear(),
                dateRange.end.getMonth(),
                dateRange.end.getDate(),
                dateRange.end.getHours(),
                dateRange.end.getMinutes(),
                dateRange.end.getSeconds()
              )
            ),
          });
          const dates = rule.all();
          _.forEach(dates, (date) => {
            const evStart = new Date(ev.start);
            date.setHours(evStart.getHours(), evStart.getMinutes(), evStart.getSeconds());
            acc.push({
              ...ev,
              start: date,
              end: new Date(date.getTime() + diff),
            });
          });
        } else if (moment(ev.start).isBetween(dateRange.start, dateRange.end)) {
          acc.push(ev);
        }
      });
    }
    return acc;
  }, [events, dateRange]);

  const _messages = useMemo(() => {
    if (messages) return messages;
    return {
      month: t('month'),
      week: t('week'),
      day: t('day'),
      agenda: t('agenda'),
      today: t('today'),
      previous: t('previous'),
      next: t('next'),
    };
  }, [messages]);

  return (
    <Calendar
      localizer={localizer}
      events={_events}
      startAccessor="start"
      endAccessor="end"
      messages={_messages}
      onSelectEvent={_onSelectEvent}
      onRangeChange={_onRangeChange}
      validRange={validRange}
      {...props}
    />
  );
}
