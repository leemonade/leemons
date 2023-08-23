import * as _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withLayout } from '@layout/hoc';
import { useAsync } from '@common/useAsync';
import { useHistory, useParams } from 'react-router-dom';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { PageContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import {
  detailCalendarConfigsRequest,
  listCalendarConfigCalendarsRequest,
} from '@calendar/request';
import { FullCalendar } from '@calendar/components/fullcalendar';
import transformCalendarConfigToEvents from '@calendar/helpers/transformCalendarConfigToEvents';
import { useCalendarSimpleEventModal } from '@calendar/components/calendar-simple-event-modal';
import hooks from 'leemons-hooks';
import DateMonthRangeView from '@calendar/components/fullcalendar-views/DateMonthRange';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';

function ConfigAdd({ session }) {
  const monthsList = useMemo(
    () => [
      { value: 0, name: 'january' },
      { value: 1, name: 'february' },
      { value: 2, name: 'march' },
      { value: 3, name: 'april' },
      { value: 4, name: 'may' },
      { value: 5, name: 'june' },
      { value: 6, name: 'july' },
      { value: 7, name: 'august' },
      { value: 8, name: 'september' },
      { value: 9, name: 'october' },
      { value: 10, name: 'november' },
      { value: 11, name: 'december' },
    ],
    []
  );

  const [t] = useTranslateLoader(prefixPN('detail_calendars_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [config, setConfig] = useState(null);
  const [eventTypesT, setEventTypesT] = useState([]);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);

  const [toggleEventModal, EventModal] = useCalendarSimpleEventModal();
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();
  const params = useParams();

  const eventTypes = useMemo(
    () => _.map(calendars, ({ name, bgColor }) => ({ key: name, color: bgColor })),
    [calendars]
  );

  const getEventTypeTranslations = async () => {
    const { items } = await getLocalizationsByArrayOfItems(_.map(eventTypes, 'key'));
    setEventTypesT(items);
  };

  const getEventTypeName = (sectionName) => tKeys(sectionName, eventTypesT);

  useEffect(() => {
    getEventTypeTranslations();
  }, [eventTypes]);

  const load = useCallback(async () => {
    setLoading(true);
    if (params && params.id) {
      const { id } = params;
      if (id) {
        const [list, detail] = await Promise.all([
          listCalendarConfigCalendarsRequest(id),
          detailCalendarConfigsRequest(id),
        ]);
        return { _calendars: list.calendars, _config: detail.config };
      }
    }
    return null;
  }, [params.id]);

  const onSuccess = useCallback((_data) => {
    if (_data) {
      const { _calendars, _config } = _data;
      if (_calendars && _config) {
        let _events = [];
        _.forEach(_calendars, (calendar) => {
          _events = _events.concat(calendar.events);
        });
        setEvents(_events);
        setCalendars(_calendars);
        setConfig(_config);
      }
      setLoading(false);
    }
  }, []);

  const onError = useCallback((e) => {
    setError(e);
    setLoading(false);
  }, []);

  useAsync(load, onSuccess, onError, [params.id]);

  const fullCalendarConfigs = useMemo(() => {
    const conf = {
      events: [],
    };
    if (config) {
      conf.firstDay = config.weekday;
      conf.validRange = {
        start: new Date(config.startYear, config.startMonth, 1),
        end: new Date(config.endYear, config.endMonth + 1, 0),
      };
      conf.events = transformCalendarConfigToEvents(config);
    }

    if (events && calendars && calendars.length) {
      const calendarsByName = _.keyBy(calendars, 'name');
      conf.events = conf.events.concat(
        _.map(transformDBEventsToFullCalendarEvents(events, calendars), (e) => ({
          ...e,
          display: 'background',
          backgroundColor: calendarsByName[e.originalEvent.type].bgColor,
        }))
      );
    }

    return conf;
  }, [config, calendars, events]);

  const onDateClick = async (date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 0);
    setEvent({
      startDate,
      endDate,
      isAllDay: true,
      type: eventTypes[0].key,
    });
    toggleEventModal();
  };

  const onEventClick = async (info) => {
    if (info.originalEvent) {
      setEvent(info.originalEvent);
      toggleEventModal();
    } else {
      await onDateClick(info.start);
    }
  };

  const reloadCalendarEvents = async () => {
    const { id } = params;
    const list = await listCalendarConfigCalendarsRequest(id);
    let _events = [];
    _.forEach(list.calendars, (calendar) => {
      _events = _events.concat(calendar.events);
    });
    setEvents(_events);
    setCalendars(list.calendars);
  };

  useEffect(() => {
    hooks.addAction('calendar:force:reload', reloadCalendarEvents);
    return () => {
      hooks.removeAction('calendar:force:reload', reloadCalendarEvents);
    };
  });

  return (
    <>
      {!error && !loading ? (
        <>
          <EventModal
            config={config}
            calendars={calendars}
            close={toggleEventModal}
            eventTypes={eventTypes}
            event={event}
          />
          <AdminPageHeader
            labels={{
              title: config.title,
            }}
            buttons={{
              save: tCommonHeader('save'),
            }}
            loading={saveLoading && 'save'}
          />
          <div className="bg-primary-content">
            <PageContainer>
              <div className="page-description max-w-screen-sm">{t('description')}</div>

              <div className="flex group-4">
                <div style={{ backgroundColor: '#fff' }}>{t('school_day')}</div>
                <div style={{ backgroundColor: 'rgba(51,51,51,0.3)' }}>{t('non_school_day')}</div>
                {eventTypes.map(({ key, color }) => (
                  <div key={key} style={{ backgroundColor: color }}>
                    {getEventTypeName(key)}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <FullCalendar
                  defaultView="dateMonthRange"
                  views={{
                    dateMonthRange: DateMonthRangeView,
                  }}
                  toolbar={false}
                  dateMonthRange={config}
                  {...fullCalendarConfigs}
                  dateClick={onDateClick}
                  eventClick={onEventClick}
                  backgroundEventClick={onEventClick}
                  language={session?.locale}
                />
              </div>

              {/*
              <div className="mt-4 grid grid-cols-3 gap-4">
                {years.map((year) => {
                  const isStartYear = config.startYear === year;
                  const isEndYear = config.endYear === year;
                  let startMonth = 1;
                  let endMonth = 12;
                  if (isStartYear) startMonth = config.startMonth;
                  if (isEndYear) endMonth = config.endMonth;
                  const months = [];
                  for (let i = startMonth; i <= endMonth; i++) {
                    months.push(i);
                  }
                  return months.map((month) => {
                    return (
                      <div key={`${year}${month}`}>
                        <FullCalendar
                          onCalendarInit={() => setCalendarInit(true)}
                          initialView="dayGridMonth"
                          initialDate={new Date(year, month, 1)}
                          {...fullCalendarConfigs}
                          aspectRatio={0.9}
                          dateClick={onDateClick}
                          eventClick={onEventClick}
                          headerToolbar={{
                            left: '',
                            center: 'title',
                            right: '',
                          }}
                        />
                      </div>
                    );
                  });
                })}
              </div>
              */}
            </PageContainer>
          </div>
        </>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default withLayout(ConfigAdd);
