import React, { useState } from 'react';

import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { WeekEventListStyles } from './WeekEventList.styles';
import { DayRow } from './components/DayRow';

const WeekEventList = ({ events, startDate, endDate, calendarConfig, t, onEventClick }) => {
  const { classes } = WeekEventListStyles({}, { name: 'WeekEventList' });
  const [eventsInCurrentWeek, setEventsInCurrentWeek] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const generateDateArray = (start, end) => {
    const dates = [];
    const currentStartDate = new Date(start);
    const currentEndDate = new Date(end);

    while (currentStartDate <= currentEndDate && dates.length < 7) {
      dates.push({ dateColumn: new Date(currentStartDate) });
      currentStartDate.setDate(currentStartDate.getDate() + 1);
    }

    return dates;
  };

  const getEventsForDate = (cleanWeekData) =>
    cleanWeekData.map((dayObj) => {
      const dayEvents = events
        .filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          const dayDate = new Date(dayObj.dateColumn);

          return (
            (eventStart.getFullYear() === dayDate.getFullYear() &&
              eventStart.getMonth() === dayDate.getMonth() &&
              eventStart.getDate() === dayDate.getDate()) ||
            (eventEnd.getFullYear() === dayDate.getFullYear() &&
              eventEnd.getMonth() === dayDate.getMonth() &&
              eventEnd.getDate() === dayDate.getDate())
          );
        })
        .sort((a, b) => {
          const timeA = a.isEndEvent ? new Date(a.end).getTime() : new Date(a.start).getTime();
          const timeB = b.isEndEvent ? new Date(b.end).getTime() : new Date(b.start).getTime();
          return timeA - timeB;
        });

      return {
        ...dayObj,
        events: dayEvents.length > 0 ? dayEvents : [],
      };
    });

  React.useEffect(() => {
    setEventsInCurrentWeek(
      events.filter(
        (event) => new Date(event.start) >= startDate && new Date(event.start) <= endDate
      )
    );
    const initialWeekData = generateDateArray(startDate, endDate);
    const weekDataWithEvents = getEventsForDate(initialWeekData);
    setWeekData(weekDataWithEvents);
  }, [events, startDate, endDate]);

  return (
    <Box className={classes.weekEventList}>
      {weekData.map((date) => (
        <DayRow
          key={date.dateColumn.toISOString()}
          date={date?.dateColumn}
          events={date.events}
          calendarWeekdays={calendarConfig?.weekDays}
          t={t}
          onEventClick={onEventClick}
        />
      ))}
    </Box>
  );
};

WeekEventList.propTypes = {
  events: PropTypes.array,
  startDate: PropTypes.date,
  endDate: PropTypes.date,
  calendarConfig: PropTypes.object,
  t: PropTypes.func,
  onEventClick: PropTypes.func,
};

export { WeekEventList };
