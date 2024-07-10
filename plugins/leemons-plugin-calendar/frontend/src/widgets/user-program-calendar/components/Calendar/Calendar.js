import React from 'react';
import PropTypes from 'prop-types';
import { Calendar as ReactCalendar } from 'react-calendar';
import { Box, Stack, Button, IconButton, Text } from '@bubbles-ui/components';
import { ChevronLeftIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';

import dayjs from 'dayjs';
import { LocaleDate } from '@common';
import { ColorBall } from './components/ColorBall';
import { CalendarStyles } from './Calendar.styles';

const Calendar = ({ events, startDate, setStartDate, endDate, setEndDate, calendarConfig, t }) => {
  const { classes } = CalendarStyles({}, { name: 'Calendar' });

  const filteredEventsByDayOff = events.filter((event) => event.isDayOff);

  const updateEndDate = (start) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    setEndDate(end);
  };
  const goToCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que el lunes sea el primer día
    const currentWeekStart = new Date(today.setDate(diff));
    setStartDate(currentWeekStart);
    updateEndDate(currentWeekStart);
  };

  const handleNextWeek = () => {
    setStartDate((prevDate) => {
      const nextWeek = new Date(prevDate);
      nextWeek.setDate(prevDate.getDate() + 7);
      updateEndDate(nextWeek);
      return nextWeek;
    });
  };

  const handlePrevWeek = () => {
    setStartDate((prevDate) => {
      const nextWeek = new Date(prevDate);
      nextWeek.setDate(prevDate.getDate() - 7);
      updateEndDate(nextWeek);
      return nextWeek;
    });
  };

  const tileClassName = ({ date, view }) => {
    const calendarWeekdays = calendarConfig?.weekDays;
    const isWeekend = calendarWeekdays?.includes(date.getDay());
    const tileClasses = [];
    if (view === 'month') {
      const currentDate = new Date(startDate);
      const dayOfWeek = currentDate.getDay();
      const mondayOfWeek = new Date(currentDate);
      mondayOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

      const isInSameWeek = (dateToCheck) => {
        const diffTime = dateToCheck.getTime() - mondayOfWeek.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays < 7;
      };
      if (isInSameWeek(date)) {
        const dayOfWeekFromDate = date.getDay();
        tileClasses.push('currentWeek');
        if (
          dayOfWeekFromDate === 1 ||
          (dayOfWeekFromDate === 0 && date.getDate() === mondayOfWeek.getDate())
        ) {
          tileClasses.push('weekStart');
        }
        if (
          dayOfWeekFromDate === 0 ||
          (dayOfWeekFromDate === 6 && date.getDate() === mondayOfWeek.getDate() + 6)
        ) {
          tileClasses.push('weekEnd');
        }
      }

      const isNoLective = filteredEventsByDayOff.some(
        (event) => date.toDateString() === new Date(event.start).toDateString()
      );
      if (isNoLective || !isWeekend) {
        tileClasses.push('noLective');
      }

      return tileClasses.join(' ');
    }
    return null;
  };
  const tileContent = ({ date }) => {
    const eventsForDate = events
      .filter((event) => !event.isDayOff)
      .filter((event) => dayjs(event.start).isSame(date, 'day'));
    const colorsArray = eventsForDate ? eventsForDate?.map((event) => event.color) : [];
    const eventsCounter = eventsForDate ? eventsForDate?.length : 0;

    if (eventsForDate?.length > 0) {
      return <ColorBall number={eventsCounter} color={colorsArray} />;
    }
    return null;
  };

  const formatShortWeekday = (locale, date) => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const dayName = formatter.format(date);
    if (dayName.toLowerCase().startsWith('mié')) {
      return 'x';
    }
    return dayName.charAt(0).toLowerCase();
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Button variant="outline" onClick={goToCurrentWeek}>
          {t('currentWeekButtonLabel')}
        </Button>
        <Box className={classes.date}>
          <IconButton onClick={handlePrevWeek} icon={<ChevronLeftIcon />} variant="transparent" />
          <Stack spacing={2} align="center" justifyContent="center" className={classes.weekButton}>
            <LocaleDate date={startDate} options={{ day: 'numeric', month: 'short' }} />
            <Text> {t('weekendSelectorNexus')} </Text>
            <LocaleDate date={endDate} options={{ day: 'numeric', month: 'short' }} />
          </Stack>
          <IconButton onClick={handleNextWeek} icon={<ChevronRightIcon />} variant="transparent" />
        </Box>
      </Box>
      <ReactCalendar
        formatShortWeekday={formatShortWeekday}
        tileClassName={tileClassName}
        tileContent={tileContent}
        view="month"
        minDetail="month"
        maxDetail="month"
        showNavigation={false}
        activeStartDate={startDate}
      />
      <Box className={classes.legend}>
        <Text sx={{ paddingTop: 3 }}>{`${t('calendarLegend')}:`}</Text>
        <Box className={classes.currentWeekBall} />
        <Text sx={{ paddingTop: 3 }}>{t('currentWeekButtonLabel')}</Text>
        <Box className={classes.dayOffBall} />
        <Text sx={{ paddingTop: 3 }}>{t('calendarLegendNonSchoolDay')}</Text>
      </Box>
    </Box>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      isDayOff: PropTypes.bool,
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      color: PropTypes.string,
    })
  ),
  startDate: PropTypes.instanceOf(Date),
  setStartDate: PropTypes.func,
  endDate: PropTypes.instanceOf(Date),
  setEndDate: PropTypes.func,
  calendarConfig: PropTypes.shape({
    weekDays: PropTypes.arrayOf(PropTypes.number),
  }),
};

export { Calendar };
