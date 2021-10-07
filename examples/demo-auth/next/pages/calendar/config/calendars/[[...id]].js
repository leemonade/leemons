import * as _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { useAsync } from '@common/useAsync';
import { useRouter } from 'next/router';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { PageContainer, PageHeader } from 'leemons-ui';
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

function ConfigAdd() {
  useSession({ redirectTo: goLoginPage });

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

  const eventClicked = useRef(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [config, setConfig] = useState(null);
  const [calendarInit, setCalendarInit] = useState(false);
  const [eventTypesT, setEventTypesT] = useState([]);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);

  const [toggleEventModal, EventModal] = useCalendarSimpleEventModal();
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const router = useRouter();

  const eventTypes = useMemo(
    () =>
      _.map(calendars, ({ name, bgColor }) => {
        return { key: name, color: bgColor };
      }),
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
    if (router.isReady && router.query && _.isArray(router.query.id)) {
      const id = router.query.id[0];
      if (id) {
        const [list, detail] = await Promise.all([
          listCalendarConfigCalendarsRequest(id),
          detailCalendarConfigsRequest(id),
        ]);
        return { _calendars: list.calendars, _config: detail.config };
      }
    }
    return null;
  }, [router]);

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

  useAsync(load, onSuccess, onError, [router]);

  const years = useMemo(() => {
    const acc = [];
    if (config) {
      for (let i = config.startYear; i <= config.endYear; i++) {
        acc.push(i);
      }
    }
    return acc;
  }, [config]);

  const fullCalendarConfigs = useMemo(() => {
    const conf = {
      events: [],
    };
    if (config && calendarInit) {
      conf.firstDay = config.weekday;
      conf.validRange = {
        start: new Date(config.startYear, config.startMonth, 1),
        end: new Date(config.endYear, config.endMonth + 1, 0),
      };
      conf.events = transformCalendarConfigToEvents(config);
    }
    /*
    if (events && calendarInit) {
      const calendarsByName = _.keyBy(calendars, 'name');
      console.log(events);
      conf.events = conf.events.concat(
        _.map(transformDBEventsToFullCalendarEvents(events, calendars), (e) => {
          return {
            ...e,
            display: 'background',
            backgroundColor: calendarsByName[e.originalEvent.type].bgColor,
          };
        })
      );
    }

     */
    console.log(conf);
    return conf;
  }, [config, calendarInit, events]);

  const onDateClick = async ({ dateStr }) => {
    if (!eventClicked.current) {
      const startDate = new Date(dateStr);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateStr);
      endDate.setHours(23, 59, 59, 0);
      setEvent({
        startDate,
        endDate,
        isAllDay: true,
        type: eventTypes[0].key,
      });
      toggleEventModal();
    }
  };

  const onEventClick = async (info) => {
    eventClicked.current = true;
    setEvent(info.event.extendedProps.originalEvent);
    toggleEventModal();
    setTimeout(() => {
      eventClicked.current = false;
    }, 100);
  };

  const reloadCalendarEvents = async () => {
    const id = router.query.id[0];
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
          <PageHeader
            title={config.title}
            saveButton={tCommonHeader('save')}
            saveButtonLoading={saveLoading}
          />
          <div className="bg-primary-content">
            <PageContainer>
              <div className="page-description max-w-screen-sm">{t('description')}</div>

              <div className="flex group-4">
                <div style={{ backgroundColor: '#fff' }}>{t('school_day')}</div>
                <div style={{ backgroundColor: 'rgba(51,51,51,0.3)' }}>{t('non_school_day')}</div>
                {eventTypes.map(({ key, color }) => {
                  return (
                    <div key={key} style={{ backgroundColor: color }}>
                      {getEventTypeName(key)}
                    </div>
                  );
                })}
              </div>

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
