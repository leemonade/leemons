import React, { useEffect, useState } from 'react';
import { AvatarSubject, Badge, Box, Divider, Stack, Text, TextClamp } from '@bubbles-ui/components';
import { LocaleDate, useLocale } from '@common';
import PropTypes from 'prop-types';
import { DayRowStyles } from './DayRow.styles';

const parseColumnByEvents = (events, date, locale) => {
  const result = {
    hoursAndDuration: [],
    description: [],
  };
  events
    .filter((event) => !event.isDayOff)
    .forEach((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const currentDate = new Date(date);

      const isSameDay = (date1, date2) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

      const formatTime = (dateParam) =>
        dateParam.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

      const eventInfo = {
        allDay: event.allDay,
      };

      if (!event.allDay) {
        if (isSameDay(eventStart, currentDate) && !isSameDay(eventStart, eventEnd)) {
          eventInfo.isStart = true;
          eventInfo.startTime = formatTime(eventStart);
        }

        if (isSameDay(eventEnd, currentDate) && !isSameDay(eventStart, eventEnd)) {
          eventInfo.isEnd = true;
          eventInfo.endTime = formatTime(eventEnd);
        }

        if (isSameDay(eventStart, eventEnd) && isSameDay(eventStart, currentDate)) {
          eventInfo.rangeTime = `${formatTime(eventStart)} - ${formatTime(eventEnd)}`;
        }
      }

      if (!event.isEndEvent) {
        result.hoursAndDuration.push(eventInfo);
      }

      const descriptionInfo = {
        bgColor: event.color,
        isTask: event.originalEvent?.type === 'calendar.task',
        title: event.title,
      };

      if (!event.isEndEvent) {
        result.description.push(descriptionInfo);
      }
    });
  return result;
};

const DayRow = ({ date, events, calendarWeekdays, t }) => {
  const isSchoolDay = !calendarWeekdays?.includes(date.getDay());
  const locale = useLocale();
  const dateWithDayoff = events.filter((event) => event.isDayOff);
  const { classes } = DayRowStyles(
    { dateWithDayoff: !!dateWithDayoff.length || isSchoolDay },
    { name: 'DayRow' }
  );
  const [preparedEvents, setPreparedEvents] = useState([]);
  useEffect(() => {
    const parsedEvents = parseColumnByEvents(events, date, locale);
    setPreparedEvents(parsedEvents);
  }, []);

  return (
    <Box>
      <Box className={classes.root}>
        <Box className={classes.date}>
          <LocaleDate
            date={date}
            options={{ day: 'numeric', month: 'short', weekday: 'short', type: 'agenda' }}
          />
        </Box>
        <Box className={classes.hoursAndDuration}>
          {preparedEvents?.hoursAndDuration
            ? preparedEvents?.hoursAndDuration.map((event, index) => (
                <Box key={index}>
                  {event.allDay ? <Text>{t('allDay')}</Text> : null}
                  {event.isStart ? (
                    <Stack
                      key={event.startTime}
                      spacing={2}
                      alignItems="center"
                      style={{ position: 'relative' }}
                    >
                      <Text className={classes.timeWithTag}>{event.startTime}</Text>
                      <Badge
                        closable={false}
                        radius="default"
                        className={classes.badge}
                        color="stroke"
                      >
                        <Text>{t('init')}</Text>
                      </Badge>
                    </Stack>
                  ) : null}
                  {event.isEnd ? (
                    <Stack
                      key={event.endTime}
                      spacing={2}
                      alignItems="center"
                      style={{ position: 'relative' }}
                    >
                      <Text className={classes.timeWithTag}>{event.endTime}</Text>
                      <Badge
                        closable={false}
                        radius="default"
                        className={classes.badge}
                        color="stroke"
                      >
                        <Text>{t('end')}</Text>
                      </Badge>
                    </Stack>
                  ) : null}
                  {event.rangeTime ? <Text key={event.rangeTime}>{event.rangeTime}</Text> : null}
                </Box>
              ))
            : null}
        </Box>
        <Box className={classes.eventDescription}>
          {preparedEvents.description &&
            preparedEvents.description.map((event, index) => {
              const isTask = event.isTask ? `${t('taskLabel')}. ` : '';
              return (
                <Stack key={index} spacing={2} alignItems="center">
                  <AvatarSubject color={event.bgColor} size="xs" />
                  <TextClamp lines={1}>
                    <Text key={index}>{`${isTask} ${event.title}`}</Text>
                  </TextClamp>
                </Stack>
              );
            })}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

DayRow.propTypes = {
  date: PropTypes.object,
  events: PropTypes.array,
  calendarWeekdays: PropTypes.array,
  t: PropTypes.func,
};

export { DayRow };
