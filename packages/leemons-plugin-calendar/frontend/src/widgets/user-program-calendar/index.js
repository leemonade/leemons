/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, createStyles, Select, Stack, Text } from '@bubbles-ui/components';
import { ChevRightIcon, PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { BigCalendar } from '@bubbles-ui/calendars';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';
import { getCentersWithToken } from '@users/session';
import * as _ from 'lodash';
import { forEach, keyBy, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import { listSessionClassesRequest } from '@academic-portfolio/request';
import { getCalendarsToFrontendRequest } from '../../request';

const Styles = createStyles((theme) => ({
  root: {
    width: '100%',
  },
  title: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
  },
  calendarContainer: {
    paddingTop: theme.spacing[6],
    height: '520px',
  },
}));

function UserProgramCalendar({ program, session }) {
  const { classes: styles } = Styles();
  const [store, render] = useStore({
    loading: true,
  });
  const [t] = useTranslateLoader(prefixPN('userProgramCalendar'));
  const [tC] = useTranslateLoader(prefixPN('calendar'));
  const [toggleEventModal, EventModal] = useCalendarEventModal();
  const history = useHistory();

  function getEvents() {
    const events = [];
    const calendarIds = map(store.calendarFilters, 'value');
    forEach(store.centerData.events, (event) => {
      if (event.type === 'plugins.calendar.task' && event.data && event.data.classes) {
        // eslint-disable-next-line consistent-return
        /*
        31/03/22 Juanjo dijo que no se mostraran los eventos tipo tarea
        forEach(event.data.classes, (calendar) => {

          if (
            (!store.selectedCalendar ||
              store.selectedCalendar === '*' ||
              calendar === store.selectedCalendar) &&
            calendarIds.includes(calendar)
          ) {
            events.push(transformEvent(event, store.centerData.calendars));
            return false;
          }
        });
         */
      } else if (
        (!store.selectedCalendar ||
          store.selectedCalendar === '*' ||
          event.calendar === store.selectedCalendar) &&
        calendarIds.includes(event.calendar)
      ) {
        events.push(event);
      }
    });
    return events;
  }

  function getFilteredEvents() {
    return transformDBEventsToFullCalendarEvents(
      getEvents(),
      store.centerData.calendars,
      store.centerData.calendarConfig
    );
  }

  async function load() {
    store.centers = getCentersWithToken();
    if (store.centers) {
      const [centerData, { classes }] = await Promise.all([
        getCalendarsToFrontendRequest(store.centers[0].token),
        listSessionClassesRequest({ program: program.id }),
      ]);
      store.centerData = centerData;
      store.classesById = keyBy(classes, 'id');

      if (store.centerData) {
        store.calendarFilters = map(
          _.filter(store.centerData.calendars, (calendar) => {
            if (calendar.isClass) {
              const keySplit = calendar.key.split('.');
              const classId = keySplit[keySplit.length - 1];
              return !!store.classesById[classId];
            }
            return false;
          }),
          (calendar) => ({
            label: calendar.name,
            value: calendar.id,
          })
        );

        if (store.centerData.calendarConfig) {
          store.fullCalendarConfig = {
            firstDay: store.centerData.calendarConfig.weekday,
            validRange: {
              start: new Date(
                store.centerData.calendarConfig.startYear,
                store.centerData.calendarConfig.startMonth,
                1
              ),
              end: new Date(
                store.centerData.calendarConfig.endYear,
                store.centerData.calendarConfig.endMonth + 1,
                0
              ),
            },
          };
        }

        store.filteredEvents = getFilteredEvents();
      }
    }

    store.loading = false;
    render();
  }

  function onChangeSelectedCalendar(value) {
    store.selectedCalendar = value;
    store.filteredEvents = getFilteredEvents();
    render();
  }

  function onEventClick(info) {
    if (info.originalEvent) {
      const { bgColor, icon, borderColor, ...e } = info.originalEvent;
      store.selectedEvent = e;
      toggleEventModal();
    }
  }

  React.useEffect(() => {
    if (program) load();
  }, [program]);

  if (store.loading) return null;

  // TODO VER CON JOHAN COMO FILTRAR SOLO LOS EVENTOS DEL PROGRAMA

  return (
    <Box className={styles.root}>
      <Stack alignItems="center">
        <PluginCalendarIcon />
        <Text size="lg" color="primary" className={styles.title}>
          {t('calendar')}
        </Text>
        <Select
          data={[{ label: t('allSubjects'), value: '*' }, ...store.calendarFilters]}
          value={store.selectedCalendar || '*'}
          onChange={onChangeSelectedCalendar}
        />
      </Stack>
      <Box className={styles.calendarContainer}>
        <EventModal
          centerToken={store.centers[0].token}
          event={store.selectedEvent}
          close={toggleEventModal}
          classCalendars={store.calendarFilters}
        />
        <BigCalendar
          style={{ height: '100%' }}
          currentView="week"
          eventClick={onEventClick}
          events={store.filteredEvents || []}
          {...store.fullCalendarConfig}
          locale={session?.locale}
          showToolbarAddButton={false}
          showToolbarViewSwitcher={false}
          toolbarRightNode={
            <Button variant="link" onClick={() => history.push('/private/calendar/home')}>
              {t('showAllCalendar')}
              <ChevRightIcon />
            </Button>
          }
          messages={{
            today: tC('today'),
            previous: tC('previous'),
            next: tC('next'),
            showWeekends: tC('showWeekends'),
          }}
        />
      </Box>
    </Box>
  );
}

UserProgramCalendar.propTypes = {
  program: PropTypes.object.isRequired,
  session: PropTypes.object,
};

export default UserProgramCalendar;
