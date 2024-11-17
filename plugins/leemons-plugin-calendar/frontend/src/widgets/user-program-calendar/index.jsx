/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { listSessionClassesRequest } from '@academic-portfolio/request';
import { Title, Box, Button, createStyles, Stack } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import getProjectedEvents from '../../helpers/getProjectedEvents';
import { getCalendarsToFrontendRequest, getScheduleToFrontendRequest } from '../../request';

import { Calendar } from './components/Calendar';
import { EmptyState } from './components/EmptyState/EmptyState';
import { WeekEventList } from './components/WeekEventList';

import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import { prefixPN } from '@calendar/helpers';
import { getCalendarDaysOffToEvents } from '@calendar/helpers/getCalendarDaysOffToEvents';
import { getEventColor } from '@calendar/helpers/getEventColor';
import { getEventsByProgram } from '@calendar/helpers/getEventsByProgram';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';

const Styles = createStyles((theme, { inTab }) => ({
  root: {
    width: '100%',
  },
  calendarContainer: {
    height: 'fit-content',
    maxHeight: inTab && 'calc(100vh - 230px)',
    maxWidth: 1600,
    backgroundColor: '#FFFFFF',
    marginTop: theme.spacing[4],
    padding: theme.spacing[6],
    borderRadius: 4,
    display: 'flex',
  },
}));

function UserProgramCalendar({ inTab, program, classe }) {
  const [parsedEvents, setParsedEvents] = useState([]);
  const [currentMonthRange, setCurrentMonthRange] = useState({ start: null, end: null });
  const [startDate, setStartDate] = React.useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const [endDate, setEndDate] = React.useState(() => {
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + 6);
    return end;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [centerToken, setCenterToken] = useState(null);
  const [calendarConfig, setCalendarConfig] = useState(null);

  const [currentProgram, setCurrentProgram] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allCalendars, setAllCalendars] = useState([]);

  const { classes: styles } = Styles({ inTab });

  const [t] = useTranslateLoader(prefixPN('userProgramCalendar'));
  const [tc] = useTranslateLoader(prefixPN('calendar'));
  const [toggleEventModal, EventModal, { openModal: openEventModal }] = useCalendarEventModal();

  const { data: welcomeCompleted } = useWelcome();

  const calculateCurrentMonthRange = () => {
    const start = dayjs(startDate).startOf('month').subtract(1, 'week');
    const end = dayjs(endDate).endOf('month').add(1, 'week');

    setCurrentMonthRange({
      start: start.toJSON(),
      end: end.toJSON(),
    });
  };

  useEffect(() => {
    calculateCurrentMonthRange();
  }, [startDate, endDate]);

  async function getCalendarsForCenter() {
    const center = getCentersWithToken();
    setCenterToken(center.token);
    const [{ calendars, events }, schedule, programData] = await Promise.all([
      getCalendarsToFrontendRequest(center.token, { showHiddenColumns: true }),
      getScheduleToFrontendRequest(center.token),
      listSessionClassesRequest({ program: program?.id, type: null }),
    ]);
    setAllCalendars([...allCalendars, ...calendars]);

    setCalendarConfig(schedule?.calendarConfig);
    setCurrentProgram(programData);

    const getCalendarEvents = getCalendarDaysOffToEvents(schedule);

    const eventsByProgram = getEventsByProgram(
      events,
      programData.classes,
      calendars,
      classe,
      inTab
    );

    const parsedEventsNotProjected = transformDBEventsToFullCalendarEvents(
      eventsByProgram,
      calendars,
      calendarConfig
    );

    const projectedEvents = getProjectedEvents(parsedEventsNotProjected, currentMonthRange);
    const eventsWithColor = projectedEvents.map((event) => ({
      ...event,
      color: getEventColor(event, calendars),
    }));

    setParsedEvents([...eventsWithColor, ...getCalendarEvents]);
    setIsLoading(false);
  }

  useEffect(() => {
    if (currentMonthRange.start && currentMonthRange.end && program !== currentProgram?.id) {
      getCalendarsForCenter();
    }
  }, [currentMonthRange, startDate, endDate, program]);

  const onNewEvent = () => {
    setSelectedEvent(null);
    openEventModal();
  };

  if (!welcomeCompleted && !parsedEvents?.length) {
    return null;
  }

  const handleEventModalClose = () => {
    toggleEventModal();
    getCalendarsForCenter();
  };

  const handleEventModal = (event = null) => {
    setSelectedEvent(event);
    toggleEventModal();
    if (!event) {
      getCalendarsForCenter();
    }
  };

  return (
    <Box className={styles.root}>
      <Stack fullWidth alignItems="end" justifyContent="space-between">
        <Box>
          <Title order={3}>{t('agenda')}</Title>
        </Box>
        <Box>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onNewEvent}>
            {tc('new')}
          </Button>
        </Box>
      </Stack>
      {!parsedEvents && <EmptyState onNewEvent={onNewEvent} />}
      <EventModal
        centerToken={centerToken}
        event={selectedEvent}
        close={handleEventModalClose}
        classCalendars={allCalendars}
      />
      {!isLoading && (
        <Box className={styles.calendarContainer}>
          <Stack fullWidth spacing={8}>
            <Calendar
              key={parsedEvents}
              events={parsedEvents || []}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              calendarConfig={calendarConfig}
              t={tc}
            />
            <WeekEventList
              key={parsedEvents.length}
              events={parsedEvents || []}
              startDate={startDate}
              calendarConfig={calendarConfig}
              endDate={endDate}
              t={tc}
              onEventClick={handleEventModal}
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
}

UserProgramCalendar.propTypes = {
  program: PropTypes.object,
  classe: PropTypes.object,
  session: PropTypes.object,
  inTab: PropTypes.bool,
  showToolbarToggleWeekend: PropTypes.bool,
  showToolbarPeriodSelector: PropTypes.bool,
};

export default UserProgramCalendar;
