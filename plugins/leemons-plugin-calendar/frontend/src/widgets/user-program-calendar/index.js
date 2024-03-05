/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, createStyles, Loader, Stack, Title } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { BigCalendar } from '@bubbles-ui/calendars';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';
import { getCentersWithToken } from '@users/session';
import * as _ from 'lodash';
import { find, forEach, keyBy, map } from 'lodash';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import { listSessionClassesRequest } from '@academic-portfolio/request';
import hooks from 'leemons-hooks';
import { getCalendarsToFrontendRequest } from '../../request';
import useTransformEvent from '../../helpers/useTransformEvent';
import EmptyState from './components/EmptyState/EmptyState';

const Styles = createStyles((theme, { inTab }) => ({
  root: {
    width: '100%',
  },
  title: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
  },
  calendarContainer: {
    height: inTab ? 'calc(100vh - 230px)' : '750px',
    backgroundColor: '#FFFFFF',
    marginTop: theme.spacing[4],
    padding: theme.spacing[6],
    borderRadius: 4,
  },
}));

function UserProgramCalendar({
  program,
  classe,
  session,
  inTab,
  showToolbarToggleWeekend,
  showToolbarPeriodSelector,
}) {
  const { classes: styles } = Styles({ inTab });
  const [store, render] = useStore({
    loading: true,
  });
  const [transformEv, evLoading] = useTransformEvent();
  const [t] = useTranslateLoader(prefixPN('userProgramCalendar'));
  const [tc] = useTranslateLoader(prefixPN('calendar'));
  const [toggleEventModal, EventModal, { openModal: openEventModal }] = useCalendarEventModal();

  function getEvents() {
    const events = [];
    const calendarIds = map(store.calendarFilters, 'value');
    if (program) {
      const programCalendar = find(store.centerData.calendars, {
        key: `calendar.program.${program.id}`,
      });
      if (programCalendar) {
        calendarIds.push(programCalendar.id);
      }
    }
    forEach(store.centerData.events, (event) => {
      let canShowInCalendar = true;

      if (event.data?.hideInCalendar) {
        canShowInCalendar = false;
      }

      if (canShowInCalendar) {
        // console.log(event, calendarIds, calendarIds.includes(event.calendar), store.selectedCalendar);
        if (event.type === 'calendar.task' && event.data && event.data.classes) {
          // eslint-disable-next-line consistent-return
          forEach(event.data.classes, (calendar) => {
            if (
              (!store.selectedCalendar ||
                store.selectedCalendar === '*' ||
                calendar === store.selectedCalendar) &&
              calendarIds.includes(calendar)
            ) {
              events.push(transformEv(event, store.centerData.calendars));
              return false;
            }
          });
        } else if (
          (!store.selectedCalendar ||
            store.selectedCalendar === '*' ||
            event.calendar === store.selectedCalendar) &&
          calendarIds.includes(event.calendar)
        ) {
          events.push(transformEv(event, store.centerData.calendars));
        }
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
    store.currentLoaded = JSON.stringify({ program, classe });
    store.centers = getCentersWithToken();
    if (store.centers) {
      const promises = [getCalendarsToFrontendRequest(store.centers[0].token)];
      if (program) promises.push(listSessionClassesRequest({ program: program.id }));
      const [centerData, programData] = await Promise.all(promises);
      store.centerData = centerData;
      if (program) {
        store.classesById = keyBy(programData.classes, 'id');
      }
      if (classe) {
        store.classesById = {
          [classe.id]: classe,
        };
      }

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
      openEventModal();
    }
  }

  React.useEffect(() => {
    const toLoad = JSON.stringify({ program, classe });
    if (
      (program || classe) &&
      !evLoading &&
      (!store.currentLoaded || toLoad !== store.currentLoaded)
    ) {
      load();
    }
  }, [program, classe, evLoading]);

  useEffect(() => {
    hooks.addAction('calendar:force:reload', load);
    return () => {
      hooks.removeAction('calendar:force:reload', load);
    };
  });

  const onNewEvent = () => {
    store.selectedEvent = null;
    openEventModal();
  };

  return (
    <Box className={styles.root}>
      {!inTab ? (
        <Stack fullWidth alignItems="center" justifyContent="space-between">
          {/* <PluginCalendarIcon /> */}
          <Box>
            <Box className={styles.title}>{t('agenda')}</Box>
            {/*
            {program && !store.loading ? (
              <Select
                data={[{ label: t('allSubjects'), value: '*' }, ...store.calendarFilters]}
                value={store.selectedCalendar || '*'}
                onChange={onChangeSelectedCalendar}
              />
            ) : null}
            */}
          </Box>
          <Box>
            <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onNewEvent}>
              {tc('new')}
            </Button>
          </Box>
        </Stack>
      ) : null}

      {!store.loading && !store.filteredEvents?.length && <EmptyState onNewEvent={onNewEvent} />}
      {!store.loading && (
        <EventModal
          centerToken={store.centers[0].token}
          event={store.selectedEvent}
          close={toggleEventModal}
          classCalendars={store.calendarFilters}
        />
      )}
      {!store.loading && !!store.filteredEvents.length && (
        <Box className={styles.calendarContainer}>
          <BigCalendar
            style={{ height: '100%' }}
            currentView="agenda"
            eventClick={onEventClick}
            events={store.filteredEvents || []}
            {...store.fullCalendarConfig}
            messages={{
              month: tc('month'),
              week: tc('week'),
              day: tc('day'),
              agenda: tc('agenda'),
              today: tc('today'),
              previous: tc('previous'),
              next: tc('next'),
              showWeekends: tc('showWeekends'),
              display: tc('display'),
              entirePeriod: tc('entirePeriod'),
              onlyInitAndEnd: tc('onlyInitAndEnd'),
              onlyEnd: tc('onlyEnd'),
              allDay: tc('allDay'),
              init: tc('init'),
              end: tc('end'),
              date: tc('date'),
              time: tc('time'),
              event: tc('event'),
              new: tc('new'),
              noEventsInRange: (
                <Box sx={(theme) => ({ textAlign: 'center', marginTop: theme.spacing[12] })}>
                  <Title order={2}>{tc('empty')}</Title>
                </Box>
              ),
            }}
            locale={session?.locale}
            showToolbarAddButton={false}
            showToolbarViewSwitcher={false}
            showToolbarToggleWeekend={showToolbarToggleWeekend}
            showToolbarPeriodSelector={showToolbarPeriodSelector}
          />
        </Box>
      )}
      {store.loading && <Loader />}
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
