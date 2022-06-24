import * as _ from 'lodash';
import { find, flatten, forEach, keyBy, map, uniq } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  ImageLoader,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  Title,
} from '@bubbles-ui/components';
import { BigCalendar } from '@bubbles-ui/calendars';
import { CalendarSubNavFilters, EventDetailPanel } from '@bubbles-ui/leemons';
import { getCentersWithToken } from '@users/session';
import { getCalendarsToFrontendRequest, getScheduleToFrontendRequest } from '@calendar/request';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import hooks from 'leemons-hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import { useLocale, useStore } from '@common';
import getCourseName from '@academic-portfolio/helpers/getCourseName';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import getClassScheduleAsEvents from '@calendar/helpers/getClassScheduleAsEvents';
import { useHistory } from 'react-router-dom';
import getCalendarNameWithConfigAndSession from '../../../helpers/getCalendarNameWithConfigAndSession';
import useTransformEvent from '../../../helpers/useTransformEvent';

function Calendar({ session }) {
  const locale = useLocale();
  const history = useHistory();
  const [store, render] = useStore({ loading: true });

  const [transformEv, evLoading] = useTransformEvent();
  const [t] = useTranslateLoader(prefixPN('calendar'));
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [toggleEventModal, EventModal, { openModal: openEventModal }] = useCalendarEventModal();

  async function getCalendarsForCenter(center) {
    const [{ calendars, events, userCalendar, ownerCalendars, calendarConfig }, schedule] =
      await Promise.all([
        getCalendarsToFrontendRequest(center.token),
        getScheduleToFrontendRequest(center.token),
      ]);

    if (!_.isObject(store.scheduleCenter)) {
      store.scheduleCenter = {};
    }
    store.scheduleCenter[center.id] = schedule;

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
    store.centers = getCentersWithToken();
    if (store.centers) {
      store.centersSelect = map(store.centers, ({ name, id }) => ({
        label: name,
        value: id,
      }));
      [store.center] = store.centers;
      const centersData = await Promise.all(
        map(store.centers, (center) => getCalendarsForCenter(center))
      );

      store.calendarNamesTranslations = await getTranslationDataCalendars(centersData);
      store.calendarSectionNamesTranslations = await getTranslationSections(centersData);

      forEach(centersData, (data) => {
        forEach(data.calendars, (calendar) => {
          // eslint-disable-next-line no-param-reassign
          calendar.name = getCalendarName(
            calendar.name,
            store.calendarNamesTranslations,
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
            sectionName: getSectionName(sectionName, store.calendarSectionNamesTranslations),
          });
        });
        centersDataValues[data.center].sections = calendarSections;
      });

      store.centersDataById = centersDataValues;
    }
    store.loading = false;
    render();
  }

  function getScheduleConfig() {
    const schedule = store.scheduleCenter[store.center.id];
    store.schedule = {};
    if (!schedule.selectedCourseId) {
      store.schedule.selectedCourse = schedule.config.allCoursesHaveSameConfig
        ? null
        : schedule.courses[0];
    } else {
      store.schedule.selectedCourse = _.find(schedule.courses, {
        id: schedule.selectedCourseId,
      });
    }
    store.schedule.showCourseSelect = true;
    if (schedule.courses.length === 1 || schedule.config.allCoursesHaveSameConfig) {
      store.schedule.showCourseSelect = false;
    }
    store.schedule.courseData = _.map(schedule.courses, (course) => ({
      label: getCourseName(course),
      value: course.id,
    }));

    const classes = _.filter(schedule.classes, (classe) => {
      if (store.schedule.selectedCourse) {
        if (_.isArray(classe)) {
          return _.map(classe.courses, 'id').includes(store.schedule.selectedCourse.id);
        }
        return classe.courses.id === store.schedule.selectedCourse.id;
      }
      return true;
    });

    store.schedule.calendarConfig = store.schedule.selectedCourse
      ? schedule.calendarConfig
      : schedule.calendarConfigByCourse[store.schedule.selectedCourse];
    store.schedule.sections = [
      {
        sectionName: t('classes'),
        calendars: _.map(classes, (classe) => ({
          ...classe,
          bgColor: classe.color,
          borderColor: classe.color,
          fullName: `${classe.subject.name} (${classe.groups.abbreviation})`,
          name: `${classe.subject.name} (${classe.groups.abbreviation})`,
          showEvents: true,
          icon: classe.subject.icon ? getAssetUrl(classe.subject.icon.id) : null,
        })),
      },
    ];

    store.schedule.events = getClassScheduleAsEvents(store.schedule.sections[0].calendars);
  }

  async function reloadCalendar() {
    store.centersDataById[store.center.id].data = await getCalendarsForCenter(store.center);
    store.centersDataById[store.center.id].events = getFilteredEvents(
      store.centersDataById[store.center.id].data
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

  function onEventClick(info) {
    if (info.originalEvent) {
      const { bgColor, icon, borderColor, ...e } = info.originalEvent;
      setSelectedEvent(e);
      openEventModal();
    }
  }

  function onNewEvent() {
    setSelectedEvent(null);
    openEventModal();
  }

  function changePage(event) {
    store.activePage = event;
    getScheduleConfig();
    render();
  }

  function onScheduleClick(e) {
    const event = e.originalEvent;
    const { classe } = event;
    const mainTeacher = _.find(classe.teachers, { type: 'main-teacher' }).teacher;
    store.activeSchedule = {
      id: classe.id,
      title: `${classe.subject.name} - ${classe.groups?.abbreviation || ''}`,
      dateRange: [e.start, e.end],
      period: t('everyWeekInWorkdays'),
      classGroup: `${classe.program.name} - ${t('group')} ${classe.groups.abbreviation}`,
      subject: {
        name: classe.subject.name,
        icon: classe.subject.icon?.cover ? getAssetUrl(classe.subject.icon.id) : null,
      },
      teacher: {
        image: mainTeacher.user.avatar,
        name: mainTeacher.user.name,
        surnames: mainTeacher.user.surnames + (mainTeacher.user.secondSurname || ''),
      },
      classroom: classe.virtualUrl,
      location: classe.address,
    };
    render();
  }

  const fullCalendarConfigs = useMemo(() => {
    const config = {};
    if (!store.loading) {
      const { data } = store.centersDataById[store.center.id];
      if (data && data.calendarConfig) {
        config.firstDay = data.calendarConfig.weekday;
        config.validRange = {
          start: new Date(data.calendarConfig.startYear, data.calendarConfig.startMonth, 1),
          end: new Date(data.calendarConfig.endYear, data.calendarConfig.endMonth + 1, 0),
        };
      }
    }
    return config;
  }, [store.center, store.loading]);

  if (store.loading) return <LoadingOverlay visible />;

  return (
    <Box style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Box style={{ width: '250px', height: '100vh' }}>
        <CalendarSubNavFilters
          style={{ position: 'static' }}
          showPageControl={store.scheduleCenter?.[store.center?.id]?.classes?.length}
          messages={{
            title: t('calendar'),
            centers: t('centers'),
            closeTooltip: t('close'),
          }}
          pages={[
            { label: t('calendar'), value: 'calendar' },
            { label: t('schedule'), value: 'schedule' },
          ]}
          pageOnChange={changePage}
          value={
            store.activePage === 'schedule'
              ? store.schedule.sections
              : store.centersDataById[store.center.id].sections
          }
          onChange={(event) => {
            if (store.activePage === 'schedule') {
              store.schedule.sections = event;
              store.schedule.events = getClassScheduleAsEvents(
                store.schedule.sections[0].calendars
              );
              render();
            } else {
              store.centersDataById[store.center.id].sections = event;

              store.centersDataById[store.center.id].data.calendars = flatten(
                map(event, 'calendars')
              );
              store.centersDataById[store.center.id].events = getFilteredEvents(
                store.centersDataById[store.center.id].data
              );
            }
            render();
          }}
          centers={store.centersSelect}
          centerValue={store.center.id}
          centerOnChange={(id) => {
            store.center = find(store.centers, { id });
            getScheduleConfig();
            render();
          }}
        />
      </Box>

      <Box sx={(theme) => ({ padding: theme.spacing[4], width: '100%', height: '100vh' })}>
        {store.center ? (
          <EventModal
            centerToken={store.center.token}
            event={selectedEvent}
            close={toggleEventModal}
            classCalendars={store.centersDataById[store.center.id].data.classCalendars}
          />
        ) : null}

        {!store.activePage || store.activePage === 'calendar' ? (
          <BigCalendar
            key="1"
            style={{ height: '100%' }}
            currentView="month"
            eventClick={onEventClick}
            addEventClick={onNewEvent}
            events={store.centersDataById[store.center.id].events}
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
              allDay: t('allDay'),
              init: t('init'),
              end: t('end'),
              date: t('date'),
              time: t('time'),
              event: t('event'),
              noEventsInRange: (
                <Box sx={(theme) => ({ textAlign: 'center', marginTop: theme.spacing[12] })}>
                  <Title order={2}>{t('empty')}</Title>
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
          />
        ) : (
          <>
            <EventDetailPanel
              labels={{
                attendanceControl: t('attendanceControl'),
                mainTeacher: t('mainTeacher'),
              }}
              locale={locale}
              event={store.activeSchedule}
              opened={!!store.activeSchedule}
              onClose={() => {
                store.activeSchedule = null;
                render();
              }}
              onControl={() => {
                history.push(`/private/dashboard/class/${store.activeSchedule.id}`);
              }}
            />

            <Box sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
              <Stack fullWidth justifyContent="space-between">
                <Box>
                  <Text color="primary" size="xl">
                    {t('weekSchedule')}
                  </Text>
                </Box>
                <Box>
                  {store.schedule.showCourseSelect ? (
                    <Stack alignItems="center">
                      <Box sx={(theme) => ({ paddingRight: theme.spacing[2] })}>
                        <Text color="primary">{t('course')}</Text>
                      </Box>
                      <Select
                        value={store.schedule.selectedCourse?.id}
                        data={store.schedule.courseData}
                        onChange={(e) => {
                          store.scheduleCenter[store.center.id].selectedCourseId = e;
                          getScheduleConfig();
                          render();
                        }}
                      />
                    </Stack>
                  ) : null}
                </Box>
              </Stack>
            </Box>
            <BigCalendar
              key="2"
              style={{ height: '90%' }}
              currentView="week"
              hideToolbar={true}
              minWeekDay={store.schedule.calendarConfig.minDayWeek}
              maxWeekDay={store.schedule.calendarConfig.maxDayWeek}
              minHour={store.schedule.calendarConfig.minHour}
              maxHour={store.schedule.calendarConfig.maxHour}
              timeslots={2}
              timeslotHeight={100}
              hideAllDayCells={true}
              forceBgColorToEvents={true}
              locale={locale}
              events={store.schedule.events}
              eventClick={onScheduleClick}
              messages={{
                month: t('month'),
                week: t('week'),
                day: t('day'),
                agenda: t('agenda'),
                today: t('today'),
                previous: t('previous'),
                next: t('next'),
                showWeekends: t('showWeekends'),
                allDay: t('allDay'),
                init: t('init'),
                end: t('end'),
                date: t('date'),
                time: t('time'),
                event: t('event'),
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

Calendar.propTypes = {
  session: PropTypes.object,
};

export default Calendar;
