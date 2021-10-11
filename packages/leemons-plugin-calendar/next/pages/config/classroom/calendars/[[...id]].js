import * as _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { detailClassroomLevelRequest } from '@calendar/request';
import { FullCalendar } from '@calendar/components/fullcalendar';
import { useCalendarSimpleEventModal } from '@calendar/components/calendar-simple-event-modal';
import hooks from 'leemons-hooks';
import DateMonthRangeView from '@calendar/components/fullcalendar-views/DateMonthRange';
import transformDBEventsToFullCalendarEvents from '@calendar/helpers/transformDBEventsToFullCalendarEvents';
import getAllLevelParents from '@classroom/services/levels/getAllLevelParents';

function ConfigAdd() {
  const session = useSession({ redirectTo: goLoginPage });

  const [t] = useTranslateLoader(prefixPN('detail_calendars_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [centerConfig, setCenterConfig] = useState(null);
  const [event, setEvent] = useState(null);

  const [toggleEventModal, EventModal] = useCalendarSimpleEventModal();
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    if (router.isReady && router.query && _.isArray(router.query.id) && session) {
      const id = router.query.id[0];
      if (id) {
        const { config: _config } = await detailClassroomLevelRequest(id);
        const levelsTree = await getAllLevelParents(_config.level, session.locale);

        const centerLevel = _.find(levelsTree, { properties: { isCenter: true } });
        console.log(centerLevel);

        return {
          _config: {
            ..._config,
            levelsTree: _.reverse(levelsTree),
          },
        };
      }
    }
    return null;
  }, [router, session]);

  const onSuccess = useCallback((_data) => {
    if (_data) {
      const { _config } = _data;

      console.log(_config);

      setLoading(false);
    }
  }, []);

  const onError = useCallback((e) => {
    setError(e);
    setLoading(false);
  }, []);

  useAsync(load, onSuccess, onError, [router]);

  const fullCalendarConfigs = useMemo(() => {
    const conf = {
      events: [],
    };
    if (config) {
      /*
      conf.firstDay = config.weekday;
      conf.validRange = {
        start: new Date(config.startYear, config.startMonth, 1),
        end: new Date(config.endYear, config.endMonth + 1, 0),
      };
      conf.events = transformCalendarConfigToEvents(config);

       */
      conf.events = conf.events.concat(
        _.map(
          transformDBEventsToFullCalendarEvents(config.calendar.events, [config.calendar]),
          (e) => {
            return {
              ...e,
              display: 'background',
              backgroundColor: config.calendar.bgColor,
            };
          }
        )
      );
    }

    return conf;
  }, [config]);

  const onDateClick = async (date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 0);
    setEvent({
      startDate,
      endDate,
      isAllDay: true,
      type: null,
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
    const id = router.query.id[0];
    const { config: _config } = await detailClassroomLevelRequest(id);
    setConfig({
      ...config,
      calendar: _config.calendar,
    });
  };

  useEffect(() => {
    hooks.addAction('calendar:force:reload', reloadCalendarEvents);
    return () => {
      hooks.removeAction('calendar:force:reload', reloadCalendarEvents);
    };
  });

  const pageTitle = useMemo(() => {
    let title = '';
    if (config) {
      const length = config.levelsTree.length - 1;
      _.forEach(config.levelsTree, (level, index) => {
        title += level.name + (length !== index ? '/' : '');
      });
    }
    return title;
  }, [config]);

  return (
    <>
      {!error && !loading ? (
        <>
          <EventModal
            config={config}
            calendars={[]}
            close={toggleEventModal}
            eventTypes={[]}
            event={event}
          />
          <PageHeader
            title={pageTitle}
            saveButton={tCommonHeader('save')}
            saveButtonLoading={saveLoading}
          />
          <div className="bg-primary-content">
            <PageContainer>
              <div className="page-description max-w-screen-sm">{t('description')}</div>

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
