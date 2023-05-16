/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  createStyles,
  IconButton,
  ImageLoader,
  Loader,
  Select,
  Stack,
  Text,
  Title,
} from '@bubbles-ui/components';
import { AddIcon as PlusIcon, PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { BigCalendar } from '@bubbles-ui/calendars';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';
import { getCentersWithToken } from '@users/session';
import * as _ from 'lodash';
import { find, forEach, keyBy, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import { listSessionClassesRequest } from '@academic-portfolio/request';
import hooks from 'leemons-hooks';
import { getCalendarsToFrontendRequest } from '../../request';
import useTransformEvent from '../../helpers/useTransformEvent';

const Styles = createStyles((theme, { inTab }) => ({
  root: {
    width: '100%',
  },
  title: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
  },
  calendarContainer: {
    paddingTop: theme.spacing[6],
    height: inTab ? '1150px' : '750px',
  },
}));

function UserProgramCalendar({ program, classe, session, inTab }) {
  const { classes: styles } = Styles({ inTab });
  const [store, render] = useStore({
    loading: true,
  });
  const [transformEv, evLoading] = useTransformEvent();
  const [t] = useTranslateLoader(prefixPN('userProgramCalendar'));
  const [tc] = useTranslateLoader(prefixPN('calendar'));
  const [toggleEventModal, EventModal, { openModal: openEventModal }] = useCalendarEventModal();

  const history = useHistory();

  function getEvents() {
    const events = [];
    const calendarIds = map(store.calendarFilters, 'value');
    if (program) {
      const programCalendar = find(store.centerData.calendars, {
        key: `plugins.calendar.program.${program.id}`,
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
        if (event.type === 'plugins.calendar.task' && event.data && event.data.classes) {
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

  // if (store.loading) return null;

  return (
    <Box className={styles.root}>
      {!inTab ? (
        <Stack alignItems="center">
          <PluginCalendarIcon />
          <Text size="lg" color="primary" className={styles.title}>
            {t('calendar')}
          </Text>
          {program && !store.loading ? (
            <Select
              data={[{ label: t('allSubjects'), value: '*' }, ...store.calendarFilters]}
              value={store.selectedCalendar || '*'}
              onChange={onChangeSelectedCalendar}
            />
          ) : null}
        </Stack>
      ) : null}

      {!store.loading ? (
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
              noEventsInRange: (
                <Box sx={(theme) => ({ textAlign: 'center', marginTop: theme.spacing[12] })}>
                  <Title order={2}>{tc('empty')}</Title>
                  <Box sx={(theme) => ({ display: 'flex', marginTop: theme.spacing[12] })}>
                    <ImageLoader
                      src={'/public/calendar/no-events.png'}
                      imageStyles={{ margin: '0px auto' }}
                      width={300}
                      height={240}
                    />
                  </Box>
                </Box>
              ),
            }}
            locale={session?.locale}
            showToolbarAddButton={false}
            showToolbarViewSwitcher={false}
            toolbarRightNode={
              <Stack alignItems="center">
                {/* <Box sx={(theme) => ({ marginRight: theme.spacing[4] })}>
                <Button variant="link" onClick={() => history.push('/private/calendar/home')}>
                  {t('showAllCalendar')}
                  <ChevRightIcon />
                </Button>
              </Box> */}

                <Box>
                  <IconButton color="primary" size="lg" rounded onClick={onNewEvent}>
                    <PlusIcon />
                  </IconButton>
                </Box>
              </Stack>
            }
          />
        </Box>
      ) : (
        <Loader />
      )}
    </Box>
  );
}

UserProgramCalendar.propTypes = {
  program: PropTypes.object,
  classe: PropTypes.object,
  session: PropTypes.object,
  inTab: PropTypes.bool,
};

export default UserProgramCalendar;
